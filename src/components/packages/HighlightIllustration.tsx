import type { ReactNode } from "react";
import type { HighlightIllustrationKind } from "@/lib/data/highlight-illustrations";
import styles from "./highlight-cards.module.css";

/** Original, consistent SVG travel vignettes: ink outlines, white forms, theme-coloured detail. */
export default function HighlightIllustration({ kind }: { kind: HighlightIllustrationKind }) {
  const scenes: Record<HighlightIllustrationKind, ReactNode> = {
    beach: <><path d="M28 128Q88 109 145 130t70-3M24 141q43-14 79-3m27 7q43-13 81-4"/><path d="M75 122q15-37 12-76M87 46Q55 21 40 47q24-10 47-1Q107 16 134 35q-27-1-47 11Q118 45 132 64q-23-11-45-18Q63 48 54 73"/><path d="m144 113 22-37 25 38Z" fill="white"/><path d="M166 76v43m-26 0h56l-10 8h-35Z" className={styles.vectorAccent}/></>,
    church: <><path d="M56 132V67h29V48h70v19h29v65Z" fill="white"/><path d="M85 48 120 25l35 23M120 25V13m-6 6h12M70 67V39m-6 6h12m94 22V39m-6 6h12M52 132h136M85 67h70M85 82h70"/><path d="M105 132V106a15 15 0 0 1 30 0v26M65 84h11v15H65Zm99 0h11v15h-11Z" className={styles.vectorAccent}/><circle cx="120" cy="61" r="7"/></>,
    palace: <><path d="M37 135V80h166v55ZM53 80V55h26v25m82 0V55h26v25M91 80V53h58v27M91 53q29-44 58 0M53 55q13-24 26 0m82 0q13-24 26 0M120 30V18M30 135h180" fill="white"/><path d="M105 135v-26a15 15 0 0 1 30 0v26M52 94h15v20H52Zm32 0h12v20H84Zm60 0h12v20h-12Zm28 0h15v20h-15Z" className={styles.vectorAccent}/></>,
    fortress: <><path d="M38 134V77h17V62h17v15h17V62h17v15h28V62h17v15h17V62h17v15h17v57Z" fill="white"/><path d="M104 134v-23a16 16 0 0 1 32 0v23M34 134h172M53 94h12v14H53Zm122 0h12v14h-12ZM120 65V26l32 7-32 14" className={styles.vectorAccent}/><path d="M45 121h30m80 0h35M83 88h23m29 0h22"/></>,
    temple: <><path d="M61 136V99h118v37M79 99l8-18h66l8 18M88 81l9-18h46l9 18M98 63l9-17h26l9 17M108 46l12-21 12 21M120 25V15M51 136h138" fill="white"/><path d="M109 136v-24h22v24M72 110v17m20-17v17m56-17v17m20-17v17M101 75h38M110 57h20" className={styles.vectorAccent}/></>,
    food: <><ellipse cx="120" cy="101" rx="51" ry="37" fill="white"/><ellipse cx="120" cy="101" rx="39" ry="27"/><path d="M49 64v28q0 11 15 11V64m-7 0v70m135-70q-20 17-14 41h14V64Zm0 41v29M103 51q-10-9 0-18m19 17q-10-9 0-18m19 19q-10-9 0-18"/><path d="M96 108q23-32 48-9-17 24-48 9Z" className={styles.vectorAccent}/></>,
    adventure: <><path d="m27 137 59-86 47 62 24-34 57 58M71 74l15 12 9-13M26 145h188"/><circle cx="143" cy="43" r="9" fill="white"/><path d="m138 56-14 28 21 16 9 32m-17-35-19 33m18-65 22 15 17-14m-5 11 10 59M120 63l-12 17 15 8 11-27Z" fill="white"/><path d="m108 80 15 8 11-27-14 2Z" className={styles.vectorAccent}/></>,
    mountains: <><path d="m20 135 63-94 44 62 30-44 64 76ZM64 69l19 14 15-20m40 25 19 11 13-21M26 145h188" fill="white"/><path d="M71 144q50-31 61-28t-5 28M42 117l-13 20h26Zm149-4-14 24h28Z" className={styles.vectorAccent}/><path d="M39 43h25m105-10h25m-82-9h23" opacity=".5"/></>,
    tea: <><path d="M21 112q48-52 98-13t100 0M25 126q45-40 93-8t97-2M29 140q43-28 86-7t95-2M44 83l44-47 40 45 31-33 47 40"/><path d="M124 134q-4-35 12-61m-8 28q-32-4-29-27 28-1 29 27Zm5-15q2-26 27-28 4 24-27 28Z" fill="white"/><path d="m50 108 6-10m14 2 5-9m91 28 6-10m13 4 5-10" className={styles.vectorAccent}/></>,
    coffee: <><path d="M49 138q69-39 110-102M91 111Q49 96 56 68q40-3 35 43Zm31-28q-26-36-9-59 35 14 9 59Zm-11 17q42 5 57-20-22-28-57 20Zm32-34q42 3 53-19-24-22-53 19Z" fill="white"/><ellipse cx="79" cy="125" rx="9" ry="12" className={styles.vectorAccent}/><ellipse cx="133" cy="94" rx="9" ry="12" className={styles.vectorAccent}/><path d="m78 115 2 19m52-49 2 19M31 145h178"/></>,
    garden: <><path d="M28 138h184M57 132V86m-20 15q-12-25 6-36-2-31 23-27 26-10 27 20 23 18 2 40-28 20-58 3Z" fill="white"/><path d="M122 116h72m-65 0v18m57-18v18m-64-30h72v12h-72Zm7-12h58v12h-58Z" className={styles.vectorAccent}/><path d="M103 138q5-22 14-28m87 28q-4-18-12-23"/></>,
    waterfall: <><path d="m29 137 9-49 32-16 4-36h91l7 44 27 8 13 49M83 37h72l-10 88H92Z" fill="white"/><path d="m99 46-2 63m19-63-2 76m20-76-4 62M70 136q47-17 99 0m-87 12q39-10 73 0" className={styles.vectorAccent}/><path d="m42 75 11-26 12 26m106-9 12-25 13 25"/></>,
    boat: <><path d="M34 111h174l-25 23H61ZM58 111V77q0-23 25-23h75q25 0 25 23v34Z" fill="white"/><path d="M72 75h25v20H72Zm38 0h25v20h-25Zm38 0h25v20h-25Z" className={styles.vectorAccent}/><path d="M26 143q24-12 47 0t47 0 47 0 47 0M43 51V23m0 0L22 37m21-14 21 14"/></>,
    evening: <><path d="M32 135q56-18 105 0t74-2M33 146h177M42 58q80 38 158 0"/><path d="M47 95h60v35H47Zm-6-1 36-23 36 23M154 126V92m-25 0h50l-25-26Z" fill="white"/><path d="M68 104h18v26H68ZM61 64v13m29-5v13m30-10v13m29-16v13m29-22v13" className={styles.vectorAccent}/><path d="M143 36a19 19 0 1 0 27 25 22 22 0 0 1-27-25Z"/></>,
    journey: <><path d="M38 132q-10-57 41-57t35 43 64-55" strokeDasharray="3 6"/><circle cx="42" cy="134" r="6"/><path d="m137 51 66-24-21 64-14-27-31-13 66-24-35 37Z" fill="white"/><path d="M81 53V34h21v19m-31 0h42v42H71Z" className={styles.vectorAccent}/></>,
  };
  return <svg viewBox="0 0 240 170" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.illustration}>
    <path d="M36 65C19 103 39 145 94 145C149 145 203 154 207 103C211 52 178 38 136 41C94 44 59 18 36 65Z" className={styles.vectorBackdrop} stroke="none" />
    <g className={styles.vectorScene}>{scenes[kind] || scenes.journey}</g>
  </svg>;
}
