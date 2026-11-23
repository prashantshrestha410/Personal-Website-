
    :    .      grid-template-rows: auto 1fr auto;
      column-gap:       font-size: 15px;
      cursor: pointer;
      font-family: var(--body);
      transition: background 0.25s, color 0.25s, transform 0.25s var(--ease), border-color 0.25s;
    }
    .btn:active { transform: scale(0.97); }
    .btn-solid { background: var(--ink); color: var(--paper); }
    .btn-solid:hover { background: var(--accent); border-color: var(--accent); }
    .btn-ghost { background: transparent; color: var(--ink); }
    .btn-ghost:hover { background: var(--ink); color: var(--paper); }
    .btn svg { width: 14px; height: 14px; transition: transform 0.3s var(--ease); }
    .btn:hover svg { transform: translate(2px, -2px); }

    /* rotating stamp */
    .stamp {
      position: absolute;
      right: var(--gutter);
      top: clamp(90px, 14vw, 150px);
      width: clamp(96px, 11vw, 140px);
      aspect-ratio: 1;
      opacity: 0;
      animation: fade 1s var(--ease) 0.8s forwards;
    }
    .stamp svg { width: 100%; height: 100%; animation: spin 26s linear infinite; }
    .stamp::after {
      content: "";
      position: absolute;
      inset: 37%;
      border-radius: 50%;
      background: var(--accent);
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ---------- Marquee ---------- */
    .marquee {
      border-top: 1px solid var(--ink);
      border-bottom: 1px solid var(--ink);
      background: var(--ink);
      color: var(--paper);
      overflow: hidden;
      white-space: nowrap;
      padding: 16px 0;
    }
    .marquee-track {
      display: inline-flex;
      gap: 40px;
      animation: slide 38s linear infinite;
      font-family: var(--display);
      font-size: clamp(22px, 2.6vw, 34px);
      font-style: italic;
      font-weight: 300;
    }
    .marquee-track span { display: inline-flex; align-items: center; gap: 40px; }
    .marquee-track span::after { content: "✦"; font-style: normal; font-size: 0.55em; color: var(--accent); }
    @keyframes slide { to { transform: translateX(-50%); } }

    /* ---------- Sections ---------- */
    section { padding: clamp(80px, 11vw, 150px) var(--gutter); }

    .sec-head {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      column-gap: 20px;
      align-items: baseline;
      margin-bottom: clamp(40px, 6vw, 80px);
    }
    .sec-num { grid-column: 1 / span 2; color: var(--accent); }
    .sec-head h2 {
      grid-column: 3 / -1;
      font-family: var(--display);
      font-weight: 360;
      font-size: clamp(40px, 6vw, 88px);
      line-height: 0.98;
      letter-spacing: -0.035em;
    }
    .sec-head h2 em { font-style: italic; font-weight: 300; }

    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s var(--ease), transform 0.9s var(--ease); }
    .reveal.in { opacity: 1; transform: none; }

    /* ---------- About ---------- */
    .about-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      column-gap: 20px;
      row-gap: 48px;
    }
    .about-lede {
      grid-column: 3 / span 6;
      font-family: var(--display);
      font-size: clamp(24px, 2.4vw, 34px);
      line-height: 1.3;
      font-weight: 350;
      letter-spacing: -0.015em;
    }
    .about-lede em { color: var(--accent); }
    .about-body {
      grid-column: 3 / span 5;
      color: var(--ink-soft);
      display: grid;
      gap: 18px;
    }
    .facts {
      grid-column: 9 / -1;
      grid-row: 1 / span 2;
      align-self: start;
      border-top: 1px solid var(--ink);
    }
    .facts div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--line);
    }
    .facts dt { color: var(--muted); }
    .facts dd { text-align: right; font-weight: 500; }
    #clock { font-variant-numeric: tabular-nums; }

    /* ---------- Work ---------- */
    #work { background: var(--paper-deep); }

    .work-list { list-style: none; border-top: 1px solid var(--ink); }
    .work-item {
      position: relative;
      display: grid;
      grid-template-columns: 2fr 6fr 3fr 1fr;
      gap: 20px;
      align-items: center;
      padding: clamp(22px, 3vw, 36px) 0;
      border-bottom: 1px solid var(--line);
      cursor: default;
      isolation: isolate;
    }
    .work-item::before {
      content: "";
      position: absolute;
      inset: 0 calc(var(--gutter) * -1);
      background: var(--ink);
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.5s var(--ease);
      z-index: -1;
    }
    .work-item:hover::before { transform: scaleY(1); transform-origin: top; }
    .work-item > * { transition: color 0.35s, transform 0.5s var(--ease); }
    .work-item:hover > * { color: var(--paper); }
    .work-item:hover .work-title { transform: translateX(14px); }

    .work-year { color: var(--muted); }
    .work-title {
      font-family: var(--display);
      font-size: clamp(28px, 3.6vw, 52px);
      font-weight: 380;
      letter-spacing: -0.03em;
      line-height: 1.05;
    }
    .work-title small {
      display: block;
      font-family: var(--body);
      font-size: 15px;
      letter-spacing: 0;
      color: var(--ink-soft);
      margin-top: 6px;
      font-weight: 400;
    }
    .work-item:hover .work-title small { color: rgba(243, 237, 226, 0.7); }
    .work-tags { color: var(--ink-soft); }
    .work-arrow {
      justify-self: end;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid currentColor;
      display: grid;
      place-items: center;
    }
    .work-arrow svg { width: 16px; height: 16px; transition: transform 0.4s var(--ease); }
    .work-item:hover .work-arrow { background: var(--accent); border-color: var(--accent); }
    .work-item:hover .work-arrow svg { transform: rotate(45deg); }

    /* ---------- Services ---------- */
    .services {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      column-gap: 20px;
      row-gap: clamp(40px, 5vw, 64px);
    }
    .service { border-top: 1px solid var(--ink); padding-top: 22px; }
    .service:nth-child(1) { grid-column: 1 / span 5; }
    .service:nth-child(2) { grid-column: 7 / span 6; margin-top: clamp(0px, 8vw, 120px); }
    .service:nth-child(3) { grid-column: 3 / span 5; }
    .service:nth-child(4) { grid-column: 9 / span 4; margin-top: clamp(0px, 5vw, 70px); }
    .service .mono { color: var(--accent); }
    .service h3 {
      font-family: var(--display);
      font-weight: 400;
      font-size: clamp(28px, 2.8vw, 40px);
      letter-spacing: -0.025em;
      line-height: 1.1;
      margin: 14px 0 12px;
    }
    .service p { color: var(--ink-soft); max-width: 42ch; }

    /* ---------- Contact ---------- */
    #contact {
      background: var(--ink);
      color: var(--paper);
    }
    #contact .sec-head h2 em { color: var(--accent); }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      column-gap: 20px;
      row-gap: 48px;
    }
    .contact-side {
      grid-column: 1 / span 4;
      display: flex;
      flex-direction: column;
      gap: 28px;
      color: rgba(243, 237, 226, 0.7);
    }
    .contact-side .mono { color: rgba(243, 237, 226, 0.45); display: block; margin-bottom: 6px; }
    .contact-side a {
      font-family: var(--display);
      font-size: 26px;
      font-style: italic;
      color: var(--paper);
      text-decoration: none;
      border-bottom: 1px solid rgba(243, 237, 226, 0.25);
      transition: border-color 0.25s, color 0.25s;
    }
    .contact-side a:hover { color: var(--accent); border-color: var(--accent); }

    form {
      grid-column: 6 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px 28px;
    }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .field.full { grid-column: 1 / -1; }
    .field label { color: rgba(243, 237, 226, 0.55); }
    .field input, .field textarea, .field select {
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(243, 237, 226, 0.3);
      color: var(--paper);
      font-family: var(--display);
      font-size: 24px;
      font-weight: 350;
      padding: 6px 0 12px;
      border-radius: 0;
      outline: none;
      transition: border-color 0.25s;
      width: 100%;
    }
    .field textarea { resize: vertical; min-height: 120px; line-height: 1.4; }
    .field select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23f3ede2' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 4px center; }
    .field select option { color: var(--ink); }
    .field input::placeholder, .field textarea::placeholder { color: rgba(243, 237, 226, 0.25); }
    .field input:focus, .field textarea:focus, .field select:focus { border-bottom-color: var(--accent); }
    .field.invalid input, .field.invalid textarea { border-bottom-color: #e8826f; }
    .err { color: #e8826f; font-size: 13px; min-height: 1em; }

    .verify-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .verify-row .btn { padding: 10px 16px; font-size: 13px; }
    .otp-field { display: none; }
    .otp-field.show { display: flex; }
    .verify-status { color: rgba(243, 237, 226, 0.65); font-size: 13px; min-height: 1em; }
    .verify-status.ok { color: #a9c89a; }
    .verify-status.bad { color: #e8826f; }
    #sendBtn[disabled] { opacity: 0.45; cursor: not-allowed; }

    .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
.policy-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.policy-links a {
  color: inherit;
  text-decoration: none;
  opacity: 0.75;
}

.policy-links a:hover {
  opacity: 1;
  text-decoration: underline;
}
    .form-foot {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .form-note { color: rgba(243, 237, 226, 0.5); font-size: 14px; }
    .form-note.ok { color: #a9c89a; }
    .form-note.bad { color: #e8826f; }

    #contact .btn-solid { background: var(--paper); color: var(--ink); border-color: var(--paper); }
    #contact .btn-solid:hover { background: var(--accent); color: var(--paper); border-color: var(--accent); }
    #contact .btn[disabled] { opacity: 0.55; cursor: progress; }

    .sent {
      grid-column: 6 / -1;
      display: none;
      border-top: 1px solid rgba(243, 237, 226, 0.3);
      padding-top: 28px;
    }
    .sent h3 { font-family: var(--display); font-weight: 350; font-size: clamp(32px, 4vw, 52px); letter-spacing: -0.03em; line-height: 1.05; }
    .sent h3 em { color: var(--accent); }
    .sent p { margin-top: 14px; color: rgba(243, 237, 226, 0.65); }
    .sent button { margin-top: 26px; }
    .contact-grid.done form { display: none; }
    .contact-grid.done .sent { display: block; animation: fade 0.8s var(--ease); }
    
/* Contact section - theme-safe colors */

#contact {
  background: #101827;
  color: #F1F5FC;
  transition: background 0.4s ease, color 0.4s ease;
}

[data-theme="dark"] #contact {
  background: #080D19;
  color: #F1F5FC;
}

[data-theme="dark"] #contact .sec-head h2,
[data-theme="dark"] #contact .sent h3 {
  text-shadow: 0 0 12px rgba(36, 91, 255, 0.45),
               0 0 28px rgba(36, 91, 255, 0.2);
}

[data-theme="dark"] #contact .sec-head h2 em,
[data-theme="dark"] #contact .sent h3 em {
  color: #5685FF;
}

[data-theme="dark"] #contact .contact-side a:hover {
  color: #5685FF;
  text-shadow: 0 0 12px rgba(36, 91, 255, 0.7);
}

[data-theme="dark"] #contact .field input:focus,
[data-theme="dark"] #contac
