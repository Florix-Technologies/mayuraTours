import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, mocks, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => mocks[name] ?? { default: {} }, ...globals });
  return exports;
}

function storage() {
  const items = new Map();
  return {
    getItem: key => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: key => items.delete(key),
  };
}

test('profiles survive logout/login and refresh without authenticating a signed-out account', () => {
  const window = { localStorage: storage(), sessionStorage: storage() };
  const booking = load('src/lib/booking/intent.ts', {}, { window });
  const auth = load('src/lib/auth/session.ts', { '@/lib/booking/intent': booking }, { window });
  const first = { email: 'asha@example.com', name: 'Asha', age: '32', gender: 'female' };
  auth.persistUser(first, true);
  assert.equal(auth.readStoredUser().name, 'Asha');
  booking.saveBookingIntent({ slug: 'goa', leadEmail: first.email, leadPhone: '123', travellerDetails: [first] });
  auth.clearStoredUser();
  assert.equal(auth.readStoredUser(), null);
  assert.equal(booking.readBookingIntent().slug, 'goa');
  assert.equal(booking.readBookingIntent().travellerDetails, undefined);
  assert.equal(booking.readBookingIntent().leadEmail, undefined);
  assert.equal(booking.readBookingIntent().leadPhone, undefined);
  auth.persistUser({ email: ' ASHA@example.com ' }, false);
  assert.equal(auth.readStoredUser().name, 'Asha');
  assert.equal(auth.readStoredUser().age, '32');
  assert.equal(window.localStorage.getItem(auth.AUTH_STORAGE_KEY), null);
  // Recreate the module to simulate a refresh, preserving only browser storage.
  const refreshed = load('src/lib/auth/session.ts', { '@/lib/booking/intent': booking }, { window });
  assert.equal(refreshed.readStoredUser().gender, 'female');
  refreshed.persistUser({ email: 'other@example.com' }, true);
  assert.equal(refreshed.readStoredUser().name, undefined);
  refreshed.clearStoredUser();
  refreshed.persistUser({ email: first.email }, true);
  assert.equal(refreshed.readStoredUser().name, 'Asha');
});

test('legacy partial profiles migrate; missing data is never invented or taken from another account', () => {
  const window = { localStorage: storage(), sessionStorage: storage() };
  const auth = load('src/lib/auth/session.ts', { '@/lib/booking/intent': { updateBookingIntent() {} } }, { window });
  window.sessionStorage.setItem(auth.AUTH_STORAGE_KEY, JSON.stringify({ email: 'older@example.com', name: 'Older', age: 41, gender: 'Male' }));
  auth.clearStoredUser();
  auth.persistUser({ email: 'older@example.com' }, true);
  assert.equal(auth.readStoredUser().name, 'Older');
  assert.equal(auth.readStoredUser().age, '41');
  assert.equal(auth.readStoredUser().gender, 'male');
  auth.persistUser({ email: 'partial@example.com', name: 'Partial' }, true);
  auth.clearStoredUser();
  auth.persistUser({ email: 'partial@example.com' }, true);
  assert.equal(auth.readStoredUser().name, 'Partial');
  assert.equal(auth.readStoredUser().age, undefined);
  assert.equal(auth.readStoredUser().gender, undefined);
  auth.persistUser({ email: 'email-only@example.com' }, true);
  assert.equal(auth.readStoredUser().name, undefined);
  // Invalid local data must not conceal a valid session-only account.
  window.localStorage.setItem(auth.AUTH_STORAGE_KEY, '{broken');
  window.sessionStorage.setItem(auth.AUTH_STORAGE_KEY, JSON.stringify({ email: 'session@example.com' }));
  assert.equal(auth.readStoredUser().email, 'session@example.com');
  window.localStorage.setItem('mayura-account-profile:session@example.com', JSON.stringify({ email: 'older@example.com', name: 'Wrong account' }));
  assert.equal(auth.readStoredUser().name, undefined);
});

test('AuthProvider restores browser sessions after hydration and login retrieves the matching profile', () => {
  let frame;
  const window = {
    localStorage: storage(), sessionStorage: storage(),
    requestAnimationFrame(fn) { frame = fn; return 1; }, cancelAnimationFrame() {},
  };
  const session = load('src/lib/auth/session.ts', { '@/lib/booking/intent': { updateBookingIntent() {} } }, { window });
  session.persistUser({ email: 'signup@example.com', name: 'Signup name', age: '28', gender: 'female' }, true);
  const states = [];
  const react = {
    createContext: () => ({ Provider: 'Provider' }),
    useState(initial) {
      const index = states.length;
      states.push(initial);
      return [initial, next => { states[index] = next; }];
    },
    useEffect: fn => fn(), useCallback: fn => fn, useMemo: fn => fn(),
  };
  const { AuthProvider } = load('src/components/auth/AuthProvider.tsx', {
    react, '@/lib/auth/session': session,
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
  }, { window });
  const context = AuthProvider({ children: null }).props.value;
  assert.equal(context.user, null);
  assert.equal(context.isReady, false);
  frame();
  assert.equal(states[0].name, 'Signup name');
  assert.equal(states[1], true);
  context.signOut();
  assert.equal(states[0], null);
  context.signIn(' SIGNUP@example.com ', false);
  assert.equal(states[0].name, 'Signup name');
  assert.equal(states[0].age, '28');
  context.signIn('different@example.com', true);
  assert.equal(states[0].name, undefined);
});

test('signup verification passes profile details only for the email being verified', () => {
  function verify(pendingEmail) {
    const sessionStorage = storage();
    sessionStorage.setItem('mayura-pending-signup', JSON.stringify({
      email: pendingEmail, name: 'Signup name', age: '28', gender: 'female',
    }));
    let signedIn;
    const jsx = (type, props) => ({ type, props });
    const Form = load('src/components/auth/VerifyEmailForm.tsx', {
      react: {
        useState(initial) {
          const value = typeof initial === 'function' ? initial() : initial;
          return [Array.isArray(value) ? Array(6).fill('1') : value, () => {}];
        },
        useEffect() {}, useRef: current => ({ current }),
      },
      'react/jsx-runtime': { jsx, jsxs: jsx },
      'next/navigation': {
        useRouter: () => ({ push() {}, replace() {} }),
        useSearchParams: () => new URLSearchParams('email=signup@example.com'),
      },
      '@/components/auth/AuthProvider': {
        useAuth: () => ({ signIn: (...args) => { signedIn = args; }, isReady: true, isAuthenticated: false }),
      },
      '@/lib/auth/paths': { safeNextPath: () => '/booking/traveler-details', signupHref: () => '/signup' },
      '@/lib/data/packages': { packages: [{}] },
    }, { sessionStorage }).default;
    function findForm(node) {
      if (Array.isArray(node)) return node.map(findForm).find(Boolean);
      if (!node || typeof node !== 'object') return;
      return node.type === 'form' ? node : findForm(node.props?.children);
    }
    findForm(Form()).props.onSubmit({ preventDefault() {} });
    assert.equal(sessionStorage.getItem('mayura-pending-signup'), null);
    return signedIn;
  }
  assert.equal(verify('SIGNUP@example.com')[2].name, 'Signup name');
  assert.equal(verify('different@example.com')[2].name, undefined);
});

// Exercise the actual page handlers and effect dependencies with an isolated hook
// runner. This checks form state and booking payloads without a browser dependency.
function formHarness(bookingOverride) {
  let slots = [], cursor, pending, dirty, tree, accountKey;
  let auth = { isReady: true, isAuthenticated: true, user: { email: 'asha@example.com', name: 'Asha', age: '32', gender: 'Female' } };
  let saved, pushed;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useRef(initial) { const i = cursor++; return slots[i] ?? (slots[i] = { current: initial }); },
    useMemo(fn, deps) {
      const i = cursor++;
      if (!slots[i] || deps.some((v, j) => !Object.is(v, slots[i].deps[j]))) slots[i] = { deps, value: fn() };
      return slots[i].value;
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!slots[i] || deps.some((v, j) => !Object.is(v, slots[i][j]))) { slots[i] = deps; pending.push(fn); }
    },
  };
  const jsx = (type, props, key) => ({ type, props, key });
  const router = { replace() {}, back() {}, push(path) { pushed = path; } };
  const Page = load('src/app/booking/traveler-details/page.tsx', {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/navigation': { useRouter: () => router },
    '@/components/auth/AuthProvider': { useAuth: () => auth },
    '@/lib/booking/intent': {
      readBookingIntent: () => bookingOverride ?? ({ slug: 'goa', packageName: 'Goa', travellers: '2' }),
      updateBookingIntent: value => { saved = value; },
    },
    '@/lib/data/packages': { packages: [] },
    '@/lib/data/business': { business: {}, telHref() {} },
    '@/lib/auth/paths': { loginHref: () => '/login' },
  }).default;
  function render() {
    const root = Page();
    if (root.key !== accountKey) { slots = []; accountKey = root.key; }
    let iterations = 0;
    do {
      dirty = false; cursor = 0; pending = [];
      tree = root.type();
      pending.forEach(fn => fn());
      assert.ok(++iterations < 20, 'effects must settle');
    } while (dirty);
  }
  function nodes(node, predicate, found = []) {
    if (Array.isArray(node)) node.forEach(n => nodes(n, predicate, found));
    else if (node && typeof node === 'object') {
      if (predicate(node)) found.push(node);
      nodes(node.props?.children, predicate, found);
    }
    return found;
  }
  const find = predicate => nodes(tree, predicate);
  const fields = () => find(n => (n.type === 'input' && ['text', 'number'].includes(n.props.type)) || n.type === 'select');
  const change = (node, value) => { node.props.onChange({ target: { value } }); render(); };
  render();
  return {
    values: () => fields().map(n => n.props.value),
    choose(self) { find(n => n.type === 'button' && 'aria-pressed' in n.props)[self ? 0 : 1].props.onClick(); render(); },
    edit(index, value) { change(fields()[index], value); },
    updateUser(user) { auth = { ...auth, user, isAuthenticated: Boolean(user) }; render(); },
    success: () => find(n => n.type === 'small' && n.props.children === 'Profile details applied').length > 0,
    contact(type, value) { change(find(n => n.type === 'input' && n.props.type === type)[0], value); },
    email: () => find(n => n.type === 'input' && n.props.type === 'email')[0].props.value,
    submit() { find(n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} }); return { saved, pushed }; },
  };
}

test('autofill handles late profiles, manual edits, both choices, and booking submission', () => {
  const form = formHarness();
  assert.equal(form.success(), false);
  form.choose(true);
  assert.deepEqual(form.values(), ['Asha', '32', 'female', '', '', '']);
  assert.equal(form.success(), true);
  form.edit(0, 'Edited');
  form.edit(3, 'Second'); form.edit(4, '25'); form.edit(5, 'male');
  form.updateUser({ email: 'asha@example.com', name: 'Later', age: '33', gender: 'female' });
  assert.deepEqual(form.values(), ['Edited', '33', 'female', 'Second', '25', 'male']);
  form.choose(false);
  assert.deepEqual(form.values(), ['', '', '', 'Second', '25', 'male']);
  assert.equal(form.success(), false);
  form.edit(0, 'Someone else');
  form.choose(false);
  assert.equal(form.values()[0], 'Someone else');
  form.choose(true);
  assert.equal(form.values()[0], 'Later');
  form.contact('tel', '9876543210');
  const { saved, pushed } = form.submit();
  assert.equal(saved.travellerDetails[0].fullName, 'Later');
  assert.equal(saved.travellerDetails[1].fullName, 'Second');
  assert.equal(pushed, '/booking/payment');
});

test('account changes clear all form data; missing profiles never show success', () => {
  const form = formHarness();
  form.choose(true); form.edit(3, 'Previous companion'); form.contact('tel', '12345');
  form.updateUser({ email: 'older@example.com' });
  assert.deepEqual(form.values(), ['', '', '', '', '', '']);
  assert.equal(form.email(), 'older@example.com');
  form.choose(true);
  assert.equal(form.success(), false);
  form.edit(0, 'Manual before load');
  form.updateUser({ email: 'older@example.com', name: 'Available', gender: 'male' });
  assert.deepEqual(form.values(), ['Manual before load', '', 'male', '', '', '']);
  assert.equal(form.success(), true);
  form.edit(2, '');
  assert.equal(form.success(), false);
  form.updateUser(null);
  form.updateUser({ email: 'asha@example.com', name: 'Asha', age: '32', gender: 'female' });
  assert.deepEqual(form.values(), ['', '', '', '', '', '']);
});

test('editing a saved booking restores manual traveller details and contact data', () => {
  const form = formHarness({
    slug: 'goa', packageName: 'Goa', travellers: '2',
    leadEmail: 'manual@example.com', leadPhone: '9876543210',
    travellerDetails: [
      { fullName: 'Manual lead', age: '45', gender: 'other' },
      { fullName: 'Manual companion', age: '40', gender: 'female' },
    ],
  });
  assert.equal(form.email(), 'manual@example.com');
  assert.equal(form.success(), false);
  form.choose(false);
  assert.deepEqual(form.values(), ['Manual lead', '45', 'other', 'Manual companion', '40', 'female']);
  form.edit(0, 'Updated lead');
  const { saved, pushed } = form.submit();
  assert.equal(saved.leadEmail, 'manual@example.com');
  assert.equal(saved.leadPhone, '9876543210');
  assert.equal(saved.travellerDetails[0].fullName, 'Updated lead');
  assert.equal(saved.travellerDetails[1].fullName, 'Manual companion');
  assert.equal(pushed, '/booking/payment');
});
