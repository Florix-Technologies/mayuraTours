"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A native `<select>`'s closed box can be themed, but its open dropdown list
 * is rendered by the OS/browser chrome — not the DOM — so brand colors,
 * fonts and rounded corners on it are effectively unreachable with CSS
 * across Chrome/Firefox/Safari. This reimplements the same control as a
 * plain listbox combobox (WAI-ARIA listbox pattern) so the open panel is
 * ordinary styleable markup instead.
 */
type SelectProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

export default function Select({ options, value, onChange, ariaLabel, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setHighlighted(Math.max(0, options.indexOf(value)));
    listRef.current?.focus();
  }, [open, value, options]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted]);

  function commit(index: number) {
    const opt = options[index];
    if (opt !== undefined) onChange(opt);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(options.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(0, h - 1));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(highlighted);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 border-none bg-transparent text-left text-base font-medium text-ink outline-none ${className ?? ""}`}
      >
        <span className="truncate">{value}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-slate transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`${listboxId}-${highlighted}`}
          onKeyDown={onListKeyDown}
          className="absolute top-[calc(100%+10px)] left-0 z-50 max-h-64 w-max min-w-[calc(100%+40px)] max-w-[min(88vw,300px)] overflow-auto rounded-xl border border-line bg-white p-1.5 shadow-[0_28px_60px_-24px_rgba(8,33,76,0.45)] outline-none"
        >
          {options.map((opt, i) => {
            const selected = opt === value;
            const active = i === highlighted;
            return (
              <li
                key={opt}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => commit(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors ${
                  selected ? "bg-accent text-white" : active ? "bg-accent/10 text-accent-ink" : "text-ink"
                }`}
              >
                <span className="truncate">{opt}</span>
                {selected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
