/* Ilustrações anatômicas animadas (SVG desenhado no navegador).
   Rodam sozinhas em loop, só enquanto estão visíveis; nada depende do scroll. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);

/* ---------- texturas geradas uma vez ---------- */
function tile(size, draw){ const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'); draw(x, size); return c.toDataURL(); }
const grain = tile(140, (x, n) => { const d = x.createImageData(n, n); for (let i = 0; i < d.data.length; i += 4){ const v = Math.random()*255; d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 26; } x.putImageData(d, 0, 0); });
const boneTex = tile(160, (x, n) => {
  const d = x.createImageData(n, n); for (let i = 0; i < d.data.length; i += 4){ d.data[i] = 120; d.data[i+1] = 95; d.data[i+2] = 70; d.data[i+3] = Math.random()*22; } x.putImageData(d, 0, 0);
  x.strokeStyle = 'rgba(140,110,80,.16)'; x.lineWidth = 1.1;
  for (let i = 0; i < 46; i++){ x.beginPath(); x.ellipse(Math.random()*n, Math.random()*n, 2 + Math.random()*6, 1.5 + Math.random()*4, Math.random()*3, 0, 7); x.stroke(); }
});
const texImg = $('sxTexImg'); if (texImg) texImg.setAttribute('href', boneTex);
document.querySelectorAll('.sx-card').forEach(el => { const g = document.createElement('div'); g.className = 'sx-grain'; g.style.backgroundImage = `url(${grain})`; el.prepend(g); });

/* ---------- utilitários ---------- */
const rad = d => d * Math.PI / 180;
const f = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
const X = p => p[0].toFixed(1), Y = p => p[1].toFixed(1);
const mid = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2];
const add = (a, b, k = 1) => [a[0] + b[0]*k, a[1] + b[1]*k];
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [0,1].map(i => u*u*u*p0[i] + 3*u*u*t*p1[i] + 3*u*t*t*p2[i] + t*t*t*p3[i]); };

/* ================= COLUNA DE PERFIL ================= */
const H = 94, CX = 85, CY = 47;
const tf = (l, px, py) => { const a = rad(l.r), dx = px - CX, dy = py - CY; return [l.x + CX + dx*Math.cos(a) - dy*Math.sin(a), l.y + CY + dx*Math.sin(a) + dy*Math.cos(a)]; };
const LV = [{n:'L3', r:8, x:330, y:96}, {n:'L4', r:2}, {n:'L5', r:-6}, {n:'S1', r:-16}];
const SHIFT = [0, -8, 4, 16];
for (let i = 1; i < LV.length; i++) { const p = tf(LV[i-1], 164, H), l = LV[i]; l.x = 0; l.y = 0; const o = tf(l, 164, 0); l.x = p[0] + SHIFT[i] - o[0]; l.y = p[1] + 22 - o[1]; }
const [L3, L4, L5, S1] = LV;
const T_ = l => `translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r} ${CX} ${CY})`;
const HC = add(mid(tf(L4, 166, H), tf(L5, 166, 0)), [12, 0]);
const U = [Math.cos(rad(-27)), Math.sin(rad(-27))], N = [-U[1], U[0]];
const TIP = add(HC, [16, -8]);
const SKX = 806, E = add(TIP, U, (SKX - TIP[0]) / U[0]);
const yA = HC[1] - 125, yB = HC[1] + 85;
const D1 = tf(L4, 258, 18), D2 = tf(L5, 258, 66);
const FPL = Math.hypot(E[0]-TIP[0], E[1]-TIP[1]);
const R = document.documentElement.style, px = v => v.toFixed(1) + 'px';
R.setProperty('--sx-ox', px(U[0]*440)); R.setProperty('--sx-oy', px(U[1]*440));
R.setProperty('--sx-hx', px(TIP[0]-HC[0])); R.setProperty('--sx-hy', px(TIP[1]-HC[1]));
R.setProperty('--sx-fx', px(E[0]-HC[0])); R.setProperty('--sx-fy', px(E[1]-HC[1]));
R.setProperty('--sx-il', (yB - yA + 4).toFixed(0)); R.setProperty('--sx-fpl', FPL.toFixed(0));

function buildSpine(uid, labels){
  const bone = (d, cls = '') => `<path class="bone ${cls}" d="${d}"/><path class="tex ${cls}" d="${d}"/>`;
  const rr = (x, y, w, h, r) => `M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
  let s = `<defs><linearGradient id="gCan${uid}" gradientUnits="userSpaceOnUse" x1="${X(add(TIP,N,-8))}" y1="${Y(add(TIP,N,-8))}" x2="${X(add(TIP,N,8))}" y2="${Y(add(TIP,N,8))}"><stop offset="0" stop-color="#5E5A66"/><stop offset=".35" stop-color="#F1EEF4"/><stop offset=".65" stop-color="#9A95A2"/><stop offset="1" stop-color="#46424D"/></linearGradient>
    <clipPath id="cm${uid}"><path id="mp${uid}" d="M610 44 C690 30 780 36 806 60 C800 250 800 450 812 660 C740 676 650 672 600 650 C560 520 566 330 584 200 C590 130 596 80 610 44Z"/></clipPath></defs>`;
  s += `<use href="#mp${uid}" class="muscle"/><g clip-path="url(#cm${uid})">`;
  for (let y = 50; y < 680; y += 16) s += `<path class="fib" d="M560 ${y} C640 ${y-16} 720 ${y+6} 820 ${y-10}"/>`;
  s += `<rect x="560" y="30" width="270" height="660" fill="url(#sxTex)" opacity=".5"/></g>`;
  s += `<path class="skinB" d="M822 28 C798 250 798 430 834 700"/><path class="skinL" d="M822 28 C798 250 798 430 834 700"/>`;
  const dp = 'M' + [tf(L3,192,-70), tf(L3,192,47), tf(L4,192,47), tf(L5,192,47), tf(S1,206,40), tf(S1,214,120)].map(f).join(' L');
  s += `<path class="dura" d="${dp}"/>`; [-8, 8].forEach(dx => s += `<path class="duraL" transform="translate(${dx} 0)" d="${dp}"/>`);
  s += `<g filter="url(#sxShadow)">`;
  for (let i = 0; i < 3; i++) {
    const u = LV[i], d = LV[i+1];
    const a = tf(u, 4, H-3), b = tf(u, 166, H-3), c = tf(d, 166, 3), e = tf(d, 4, 3);
    const dd = `M${f(a)} L${f(b)} Q${f(add(mid(b, c), [10, 0]))} ${f(c)} L${f(e)} Q${f(add(mid(e, a), [-12, 0]))} ${f(a)}Z`;
    const m = add(mid(mid(a, b), mid(c, e)), [4, 0]), gap = (Math.hypot(a[0]-e[0], a[1]-e[1]) + Math.hypot(b[0]-c[0], b[1]-c[1])) / 2, rot = (u.r + d.r) / 2;
    s += `<clipPath id="dc${uid}${i}"><path d="${dd}"/></clipPath><path class="disc" d="${dd}"/><g clip-path="url(#dc${uid}${i})" transform="rotate(${rot} ${f(m)})">
      <ellipse class="ring" cx="${X(m)}" cy="${Y(m)}" rx="62" ry="${(gap*.44).toFixed(1)}"/><ellipse class="ring" cx="${X(m)}" cy="${Y(m)}" rx="76" ry="${(gap*.6).toFixed(1)}"/>
      <ellipse class="nuc" cx="${X(m)}" cy="${Y(m)}" rx="46" ry="${(gap*.28).toFixed(1)}"/></g>`;
  }
  LV.forEach(l => {
    s += `<g transform="${T_(l)}">`;
    if (l.n !== 'S1') {
      s += bone('M250 8 L382 22 Q398 30 394 50 L388 70 Q382 82 366 82 L252 88 Z');
      s += bone(rr(160, 10, 62, 30, 12));
      s += bone(rr(214, -8, 42, 62, 16));
      s += bone(rr(214, 42, 42, 60, 16), l.n === 'L4' ? 'cut4' : '');
      s += bone(rr(0, 0, 170, 94, 12));
      s += `<path class="rim" d="M14 6 H156 M14 88 H156"/>`;
    } else {
      s += bone('M0 8 Q0 0 10 0 L160 0 L224 -6 L242 24 C254 100 246 172 212 236 L188 262 C168 250 150 220 120 180 C80 128 30 70 0 8Z');
      s += `<path d="M30 64 L222 44 M72 124 L234 108 M112 180 L226 168" stroke="#A8927A" stroke-opacity=".25" fill="none"/><path class="rim" d="M14 5 H150"/>`;
    }
    s += `</g>`;
  });
  s += `</g>`;
  /* área mexida na cirurgia aberta */
  s += `<polygon class="dmg" points="${[[812, yA-34], [812, yB+34], tf(L5, 246, 104), tf(L4, 246, -24)].map(f).join(' ')}" fill="url(#sxHatch)" stroke="#D93A55" stroke-opacity=".5" stroke-dasharray="4 4"/>`;
  s += `<g class="cav"><polygon points="${[[812,yA],[812,yB],D2,D1].map(f).join(' ')}" fill="url(#sxCav)" stroke="#D93A55" stroke-opacity=".7"/>
    ${[[D1, [880, yA-40]], [D2, [880, yB+40]]].map(([p, q]) => `<line x1="${X(p)}" y1="${Y(p)}" x2="${q[0]}" y2="${q[1]}" stroke="#8D8893" stroke-width="10" stroke-linecap="round"/><line x1="${X(p)}" y1="${Y(p)}" x2="${q[0]}" y2="${q[1]}" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round" transform="translate(0 -2)"/>`).join('')}</g>`;
  /* trajeto da endoscopia (comparação) */
  s += `<line class="fpe" x1="${X(E)}" y1="${Y(E)}" x2="${X(TIP)}" y2="${Y(TIP)}"/>`;
  /* hérnia */
  s += `<g class="rip"><circle cx="${X(HC)}" cy="${Y(HC)}" r="24"/><circle cx="${X(HC)}" cy="${Y(HC)}" r="24"/></g>`;
  s += `<path class="her" d="M${HC[0]-18} ${HC[1]-12} C${HC[0]-4} ${HC[1]-26} ${HC[0]+24} ${HC[1]-18} ${HC[0]+22} ${HC[1]+2} C${HC[0]+20} ${HC[1]+20} ${HC[0]-6} ${HC[1]+22} ${HC[0]-18} ${HC[1]+12}Z"/>`;
  /* nervos */
  const roots = {};
  const root = (l, a, q, p1, c1, c2, p3, hot) => {
    const A = tf(l, ...a), Q = tf(l, ...q), P1 = tf(l, ...p1), C1 = tf(l, ...c1), C2 = tf(l, ...c2), P3 = tf(l, ...p3);
    roots[l.n] = [P1, C1, C2, P3];
    const d = `M${f(A)} Q${f(Q)} ${f(P1)} C${f(C1)} ${f(C2)} ${f(P3)}`, h = hot ? ' hot' : '';
    s += `<path class="root${h}" d="${d}"/><path class="core${h}" d="${d}" transform="translate(-1.5 -1.5)"/>`;
    if (hot) s += `<path class="pulse" d="${d}"/><path class="calm" d="${d}"/>`;
  };
  root(L3, [194,40], [192,80], [186,108], [166,140], [80,190], [-70,250]);
  root(L5, [194,40], [192,80], [186,108], [166,140], [80,190], [-60,250]);
  root(S1, [206,30], [204,52], [190,72], [150,110], [60,190], [-10,300]);
  root(L4, [194,40], [192,80], [186,108], [166,140], [80,190], [-70,250], true);
  /* marcas de cada etapa */
  s += `<g class="fx inc-e"><line x1="${SKX-6}" y1="${(E[1]-9).toFixed(1)}" x2="${SKX+6}" y2="${(E[1]+9).toFixed(1)}" stroke="#E0A93B" stroke-width="6" stroke-linecap="round" filter="url(#sxGlowG)"/>
    <text class="olab g" x="${SKX+20}" y="${(E[1]+30).toFixed(1)}">Corte de</text><text class="olab g" x="${SKX+20}" y="${(E[1]+54).toFixed(1)}">~8 mm</text></g>`;
  s += `<path class="inc-o" d="M806 ${yA} L806 ${yB}"/>`;
  s += `<g class="scar"><path d="M806 ${yA+6} L806 ${yB-6}" stroke="#D93A55" stroke-width="3" stroke-opacity=".85"/>`;
  for (let y = yA + 16; y < yB - 6; y += 20) s += `<line x1="796" y1="${y}" x2="816" y2="${y}" stroke="#D93A55" stroke-width="2" stroke-opacity=".85"/>`;
  s += `</g>`;
  s += `<text class="fx olab r l-inc-o" x="826" y="${yA+18}">Corte de</text><text class="fx olab r l-inc-o" x="826" y="${yA+42}">vários cm</text>`;
  s += `<text class="fx olab r l-mus" x="700" y="${yB+90}" text-anchor="middle">Músculos afastados</text>`;
  const lb = [Math.max(D1[0], D2[0]) + 18, (D1[1] + D2[1]) / 2];
  s += `<text class="fx olab w l-bone" x="${X(lb)}" y="${(lb[1]-6).toFixed(1)}">Parte do osso</text><text class="fx olab w l-bone" x="${X(lb)}" y="${(lb[1]+18).toFixed(1)}">retirada</text>`;
  s += `<text class="fx olab r l-heal" x="700" y="${yB+90}" text-anchor="middle">Mais tecido para cicatrizar</text>`;
  s += `<text class="fx olab r l-o2" x="700" y="${yB+90}" text-anchor="middle">Cirurgia aberta</text>`;
  s += `<text class="fx olab g l-e2" x="${SKX-30}" y="${(E[1]-26).toFixed(1)}" text-anchor="end">Endoscopia</text>`;
  /* tubo com câmera */
  const FAR = add(TIP, U, 620), H1 = add(TIP, U, 330), H2 = add(TIP, U, 430);
  s += `<g class="can"><line x1="${X(TIP)}" y1="${Y(TIP)}" x2="${X(FAR)}" y2="${Y(FAR)}" stroke="url(#gCan${uid})" stroke-width="15" stroke-linecap="round"/>
    <line x1="${X(H1)}" y1="${Y(H1)}" x2="${X(H2)}" y2="${Y(H2)}" stroke="#2A2730" stroke-width="30" stroke-linecap="round"/>
    <line x1="${X(H1)}" y1="${Y(H1)}" x2="${X(H2)}" y2="${Y(H2)}" stroke="#fff" stroke-opacity=".18" stroke-width="4" stroke-linecap="round" transform="translate(${(-N[0]*8).toFixed(1)} ${(-N[1]*8).toFixed(1)})"/>
    <circle cx="${X(TIP)}" cy="${Y(TIP)}" r="5" fill="#fff"/></g>`;
  s += `<g class="light"><circle cx="${X(TIP)}" cy="${Y(TIP)}" r="74" fill="url(#sxLight)"/></g>`;
  s += `<circle class="frag" cx="${X(HC)}" cy="${Y(HC)}" r="8"/>`;
  s += `<text class="fx olab g free" x="${(HC[0]-50).toFixed(1)}" y="${(HC[1]+74).toFixed(1)}" text-anchor="end">Nervo livre</text>`;
  s += `<text class="fx olab g keep" x="700" y="${yB+90}" text-anchor="middle">Músculos preservados</text>`;
  if (labels) {
    const disc0 = mid(tf(L3, 4, H), tf(L4, 4, 0));
    const LB = [
      {n:'Vértebra', a:tf(L3, 40, 30), side:'l'},
      {n:'Disco', a:add(disc0, [16, 0]), side:'l'},
      {n:'Hérnia', a:HC, side:'l', hot:true},
      {n:'Nervo', a:bez(...roots.L4, .45), side:'l', hot:true},
      {n:'Músculos', a:[650, 120], side:'r'},
      {n:'Pele', a:[806, 560], side:'r'},
    ];
    ['l','r'].forEach(side => { let prev = -1e9; LB.filter(i => i.side === side).sort((a, b) => a.a[1] - b.a[1]).forEach(i => { i.ly = Math.max(i.a[1], prev + 56); prev = i.ly; }); });
    LB.forEach(i => { const L = i.side === 'l';
      s += `<g class="lbl"><line x1="${L ? 246 : 870}" y1="${i.ly.toFixed(1)}" x2="${X(i.a)}" y2="${Y(i.a)}"/><circle cx="${X(i.a)}" cy="${Y(i.a)}" r="4"/><text class="${i.hot ? 'hot' : ''}" x="${L ? 236 : 880}" y="${(i.ly+7).toFixed(1)}" text-anchor="${L ? 'end' : 'start'}">${i.n}</text></g>`; });
  }
  return s;
}

/* ================= CORPO DE COSTAS (sinais) ================= */
/* metade direita do corpo de costas (cintura → pés); espelhada para a esquerda */
const KX = .8;
const BH = 'M0,236 L98,236 C92,286 86,316 84,330 C80,350 82,366 90,384 C100,410 104,440 102,470 C100,520 92,570 86,610 C84,630 90,660 86,690 C82,712 74,728 72,740 C78,748 82,756 74,760 L30,760 C26,748 30,738 32,728 C28,700 22,670 24,640 C26,620 24,600 20,580 C16,540 8,480 4,450 L0,446 Z';
const bm = (d, sd = 1) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(sd*KX*x).toFixed(1)} ${y}`);
function lowerBody(uid){
  const P = [bm(BH), bm(BH, -1)];
  let s = `<clipPath id="${uid}R"><path d="${P[0]}"/></clipPath>`;
  s += `<g class="skinOut" filter="url(#sxShadow)">${P.map(d => `<path d="${d}"/>`).join('')}</g>`;
  s += P.map(d => `<path class="skin" d="${d}"/>`).join('') + P.map(d => `<path class="skinTex soft" d="${d}"/>`).join('');
  const SH = 'M6,470 C30,482 64,480 92,464 M38,616 Q54,624 72,616 M64,292 C54,322 56,346 70,360';
  s += `<path d="M0 250 L0 392" stroke="#B98A7E" stroke-opacity=".16" stroke-width="9" stroke-linecap="round" fill="none"/>`;
  s += `<path class="shadeL" d="${bm(SH)} ${bm(SH, -1)} M0 404 L0 452"/>`;
  s += `<g class="bspine">`;
  for (let i = 0; i < 6; i++) { const y = 246 + i*23, w = (17 + i*1.5)*KX*1.25, x = (-w/2).toFixed(1);
    s += `<rect class="bone${i ? ' vl' : ''}" x="${x}" y="${y}" width="${w.toFixed(1)}" height="14" rx="4.5"/><rect class="tex" x="${x}" y="${y}" width="${w.toFixed(1)}" height="14" rx="4.5"/>`; }
  const sac = bm('M-14,388 L14,388 L9,414 Q0,424 -9,414 Z');
  s += `<path class="bone" d="${sac}"/><path class="tex" d="${sac}"/></g>`;
  return s;
}
function buildBody(){
  const S = 1.36, CXV = 250, TY = 22 - 236*S;
  const A = (x, y) => [CXV + S*KX*x, TY + S*y];
  let s = `<ellipse cx="${CXV}" cy="742" rx="100" ry="8" fill="#5A1828" opacity=".08"/>`;
  s += `<g transform="translate(${CXV} ${TY.toFixed(1)}) scale(${S})">` + lowerBody('sxBd');
  s += `<g class="zone z1"><circle cx="0" cy="335" r="62" fill="url(#sxPain)"/></g>`;
  s += `<g class="zone z2"><circle cx="${KX*46}" cy="444" r="42" fill="url(#sxPain)"/></g>`;
  const nerve = 'M10,388 C24,404 42,420 46,446 C50,500 52,560 52,610 C52,650 52,690 52,748';
  s += `<path class="nb" d="${bm(nerve, -1)}"/><path class="nb" d="${bm(nerve)}"/><path class="nr" d="${bm(nerve)}"/><path class="np" d="${bm(nerve)}"/>`;
  s += `<g class="tg">`;
  [[40,618],[62,646],[44,676],[60,704],[42,730],[64,748],[52,720],[34,700]].forEach(([x, y], i) => { x *= KX;
    s += `<path style="animation-delay:${(i*0.19).toFixed(2)}s" d="M${x} ${y-5} L${x+1.3} ${y-1.3} L${x+5} ${y} L${x+1.3} ${y+1.3} L${x} ${y+5} L${x-1.3} ${y+1.3} L${x-5} ${y} L${x-1.3} ${y-1.3}Z"/>`; });
  s += `</g><g class="wk" clip-path="url(#sxBdR)"><path d="M0 600H130V770H0Z" fill="url(#sxHatchG)"/></g>`;
  s += `<rect x="-120" y="230" width="240" height="64" fill="url(#sxFadeTop)"/></g>`;
  const MK = [[1, A(0, 335), 'Dor lombar'], [2, A(46, 444), 'Glúteo e perna'], [3, A(52, 662), 'Formigamento'], [4, A(52, 744), 'Fraqueza']];
  MK.forEach(([n, a, t]) => { const ly = a[1];
    s += `<g class="bm bm${n}"><polyline points="${(a[0]+14).toFixed(1)},${ly.toFixed(1)} 440,${ly.toFixed(1)}"/><circle cx="${a[0].toFixed(1)}" cy="${ly.toFixed(1)}" r="13"/><text class="bn" x="${a[0].toFixed(1)}" y="${ly.toFixed(1)}">${n}</text><text class="bt" x="452" y="${(ly+7).toFixed(1)}">${t}</text></g>`; });
  return s;
}

/* ================= reprodução automática ================= */
function swap(el, html){ if (!el || el.innerHTML === html) return; el.classList.add('out'); setTimeout(() => { el.innerHTML = html; el.classList.remove('out'); }, 280); }
function player({watch, figs, durs, segs, onStep, still}){
  let k = -1, t = 0, vis = false;
  const bars = segs ? [...segs.querySelectorAll('i')] : [];
  const set = n => {
    figs.forEach(fg => { if (n === 0) [...fg.classList].filter(c => /^p\d$/.test(c)).forEach(c => fg.classList.remove(c)); else for (let j = 1; j <= n; j++) fg.classList.add('p' + j); });
    bars.forEach((b, i) => { b.style.transition = 'none'; b.style.width = i < n ? '100%' : '0'; });
    const b = bars[n]; if (b) { void b.offsetWidth; b.style.transition = `width ${durs[n]}ms linear`; b.style.width = '100%'; }
    onStep && onStep(n);
  };
  if (reduce) { set(still ?? 0); bars.forEach(b => { b.style.transition = 'none'; b.style.width = '100%'; }); return; }
  const next = () => { k = (k + 1) % durs.length; set(k); t = setTimeout(next, durs[k]); };
  const run = () => { clearTimeout(t); if (!vis) return; if (k < 0) next(); else { set(k); t = setTimeout(next, durs[k]); } };
  onStep && onStep(0);
  new IntersectionObserver(es => { vis = es[0].isIntersecting; run(); }, {threshold:.2}).observe(watch);
}
const mount = (id, vb, html, aria) => { const el = $(id); if (el) el.innerHTML = `<svg viewBox="${vb}" role="img" aria-label="${aria}">${html}</svg>`; return el; };

/* --- Como funciona a endoscopia --- */
const fMet = mount('sxMetodo', '0 0 1100 770', buildSpine('m', true), 'Coluna vista de lado com uma hérnia de disco apertando o nervo; um tubo fino com câmera entra por um pequeno corte, retira a hérnia e o nervo fica livre.');
if (fMet) {
  const T = [
    ['O disco saiu do lugar e apertou o nervo', 'O disco é um amortecedor entre as vértebras. Quando parte dele sai do lugar (a hérnia), aperta o nervo e a dor pode descer para a perna.'],
    ['Um corte de cerca de 8 mm', 'Por ele entra um tubo fino, que passa entre os músculos sem precisar soltá-los do osso.'],
    ['Uma câmera mostra a hérnia, que é retirada', 'Pela câmera na ponta do tubo, o médico vê e remove o pedaço do disco que apertava o nervo.'],
    ['Nervo livre, músculos preservados', 'O tubo sai e fica apenas o pequeno corte na pele.'],
  ];
  const MAP = [[0, 1], [3], [4, 5], [6]];
  const steps = [...document.querySelectorAll('#metodo .step')], cap = $('sxMetodoCap'), num = $('sxMetodoNum');
  player({watch: fMet, figs: [fMet], durs: [6500, 5000, 5800, 5000], segs: $('sxMetodoSegs'), still: 0,
    onStep: n => { swap(cap, `<b>${T[n][0]}</b>${T[n][1]}`); if (num) num.textContent = `0${n+1} / 04`; steps.forEach((s, i) => s.classList.toggle('on', MAP[n].includes(i))); }});
}

/* --- Um caminho menor --- */
const fCam = mount('sxCaminho', '240 40 720 690', buildSpine('c', false), 'A mesma hérnia de disco e dois caminhos até ela: a área grande aberta na cirurgia convencional e o trajeto fino da endoscopia, por um corte de cerca de 8 mm.');
if (fCam) {
  fCam.querySelector('svg').setAttribute('preserveAspectRatio', 'xMinYMid meet');
  const T = [
    ['Para chegar à hérnia, há dois caminhos', ''],
    ['Na cirurgia aberta, a área mexida é grande', 'Corte de vários centímetros e músculos afastados.'],
    ['Na endoscopia, o caminho é um tubo fino', 'Um corte de cerca de 8 mm, passando entre os músculos.'],
    ['Pelo tubo, a câmera chega e a hérnia é retirada', 'O médico vê o pedaço do disco que apertava o nervo e o remove.'],
    ['Nervo livre, por um caminho menor', 'Em casos selecionados, menos tecido mexido no acesso.'],
  ];
  const cap = $('sxCaminhoCap');
  player({watch: fCam, figs: [fCam], durs: [2800, 3800, 4200, 6200, 5200], segs: $('sxCaminhoSegs'), still: 4,
    onStep: n => swap(cap, `<b>${T[n][0]}</b>${T[n][1]}`)});
}
/* ================= ABERTA × ENDOSCÓPICA (vista de cima) ================= */
function buildVersus(){
  const T = (x, y, t, cls = '', anchor = 'middle', st = '') => `<text class="vt ${cls}" x="${x}" y="${y}" text-anchor="${anchor}"${st ? ` style="${st}"` : ''}>${t}</text>`;
  const draw = (x1, y1, x2, y2, cls) => { const l = Math.hypot(x2-x1, y2-y1).toFixed(0); return `<line class="draw ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--l:${l};stroke-dasharray:${l}"/>`; };
  /* só a região lombar, vista de trás */
  const back = (cx, id) => { const S = 1.75, TY = 64 - 240*S;
    return `<g transform="translate(${cx} ${TY}) scale(${S})"><clipPath id="${id}"><rect x="-140" y="236" width="280" height="236"/></clipPath><g clip-path="url(#${id})">${lowerBody(id + 'b')}</g>
      <rect x="-140" y="230" width="280" height="46" fill="url(#sxFadeTop)"/><rect x="-140" y="430" width="280" height="46" fill="url(#sxFadeTop)" transform="rotate(180 0 453)"/></g>`; };
  /* vértebra vista de cima, com músculos */
  const anat = side => {
    const k = side === 'a' ? 'mK' : 'mE';
    let s = `<path class="skinB" d="M-330 300 Q0 366 330 300"/><path class="skinL" d="M-330 300 Q0 366 330 300"/>`;
    s += `<ellipse class="psoas" cx="-150" cy="-110" rx="44" ry="70" transform="rotate(-18 -150 -110)"/><ellipse class="psoas" cx="150" cy="-110" rx="44" ry="70" transform="rotate(18 150 -110)"/>`;
    s += `<g class="musc ${k}L"><ellipse class="mus" cx="-90" cy="146" rx="86" ry="70"/><ellipse class="fibE" cx="-90" cy="146" rx="86" ry="70"/></g>`;
    s += `<g class="musc ${k}R"><ellipse class="mus" cx="90" cy="146" rx="86" ry="70"/><ellipse class="fibE" cx="90" cy="146" rx="86" ry="70"/></g>`;
    const body = 'M-130 -130 C-130 -205 -70 -230 0 -230 C70 -230 130 -205 130 -130 C130 -75 95 -48 50 -46 C28 -45 18 -54 0 -54 C-18 -54 -28 -45 -50 -46 C-95 -48 -130 -75 -130 -130Z';
    s += `<g filter="url(#sxShadow)"><path class="bone" d="${body}"/><path class="tex" d="${body}"/>`;
    s += `<ellipse class="annA" cx="0" cy="-134" rx="92" ry="66"/><ellipse class="nucA" cx="0" cy="-134" rx="60" ry="42"/>`;
    ['M-70 -48 L-90 0 L-64 20 L-38 -8Z', 'M70 -48 L90 0 L64 20 L38 -8Z'].forEach(d => s += `<path class="bone" d="${d}"/><path class="tex" d="${d}"/>`);
    const arch = 'M-54 22 Q0 54 54 22 L38 54 L16 162 Q0 176 -16 162 L-38 54Z';
    s += `<path class="bone${side === 'a' ? ' lam' : ''}" d="${arch}"/><path class="tex${side === 'a' ? ' lam' : ''}" d="${arch}"/></g>`;
    s += `<ellipse class="canal" cx="0" cy="-8" rx="44" ry="30"/>`;
    s += `<circle class="nrv" cx="-46" cy="-24" r="10"/><circle class="nrv hotA" cx="46" cy="-24" r="10"/>`;
    s += `<path class="herA" d="M22 -50 C34 -60 54 -54 56 -40 C58 -28 44 -22 32 -26 C20 -30 14 -42 22 -50Z"/>`;
    return s;
  };
  /* mesmos ícones do site (window.SITE_ICONS, em index.html): cama, caminhada, batimento e maleta */
  const ICN = ['bed', 'walk', 'heartbeat', 'briefcase'];
  const ic = k => {
    const src = (window.SITE_ICONS || {})[ICN[k]] || '';
    const paths = (src.match(/<path[^>]*\/>/g) || []).join('');
    return `<g transform="translate(-18 -18) scale(1.5)" style="stroke-width:1.5">${paths}</g>`;
  };
  const LBn = ['Internação', 'Mobilidade', 'Recuperação', 'Retorno'], ys = [130, 230, 330, 430];
  /* a linha liga os círculos sem atravessá-los */
  const track = (cx, side) => ys.slice(1).map((y, k) => `<line x1="${cx}" y1="${ys[k]+31}" x2="${cx}" y2="${y-31}" class="trk ${side}"/>`).join('') + ys.map((y, k) =>
    `<g class="node n${k} ${side}"><circle class="nodeC" cx="${cx}" cy="${y}" r="31"/><g transform="translate(${cx} ${y})" class="nodeI">${ic(k)}</g>${T(side === 'e' ? cx+48 : cx-48, y+4, LBn[k], side === 'e' ? 'w' : '', side === 'e' ? 'start' : 'end')}</g>`).join('');
  let s = `<line x1="500" y1="50" x2="500" y2="540" stroke="#141317" stroke-opacity=".1" stroke-dasharray="2 6"/>`;
  /* A · incisão */
  s += `<g class="vsc" id="vA">${back(250, 'vsBkA')}${back(750, 'vsBkE')}
    ${draw(250, 122, 250, 302, 'incA')}
    <g class="fade">${Array.from({length: 9}, (_, k) => `<line x1="242" y1="${132+k*20}" x2="258" y2="${132+k*20}" stroke="#B4233F" stroke-width="1.6"/>`).join('')}</g>
    <g class="fade"><circle cx="798" cy="262" r="38" fill="url(#sxLight)"/><line x1="798" y1="254" x2="798" y2="270" stroke="#C98A1A" stroke-width="5" stroke-linecap="round"/></g>
    <g class="fade">${T(250, 506, 'Incisão maior')}${T(250, 524, 'vários centímetros', 'm')}${T(750, 506, 'Pequena incisão', 'w')}${T(750, 524, 'cerca de 8 mm', 'm')}</g></g>`;
  /* B · acesso e tecidos */
  s += `<g class="vsc" id="vB">
    <g transform="translate(250 300) scale(.6)">${anat('a')}
      <path class="fade field" d="M-10 304 L-4 46 L-46 36 L-128 290Z"/>
      ${draw(-84, 318, -42, 44, 'retr')}${draw(-14, 318, -6, 48, 'retr')}
      <path class="fade" d="M-46 30 Q-26 44 -6 46" fill="none" stroke="#D93A55" stroke-width="3" stroke-dasharray="3 4"/></g>
    <g transform="translate(750 300) scale(.6)">${anat('e')}
      ${draw(262, 300, 58, -18, 'canO')}${draw(262, 300, 58, -18, 'canI')}
      <circle class="fade" cx="58" cy="-18" r="34" fill="url(#sxLight)"/></g>
    <g class="fade">${T(160, 536, 'Afastadores')}${T(842, 536, 'Cânula', 'w')}</g>
    <g class="tisL">${T(250, 70, 'Músculos afastados', 'w')}${T(750, 70, 'Músculos preservados', 'ok')}</g></g>`;
  /* C · linha do tempo */
  s += `<g class="vsc" id="vC">${track(285, 'a')}${track(715, 'e')}${T(500, 532, 'Sem escala de tempo · cada etapa é definida individualmente', 'm', 'middle', 'font-size:9.5px')}</g>`;
  /* D · indicação */
  s += `<g class="vsc" id="vD">
    <g transform="translate(250 230)"><circle r="56" class="badge"/><path d="M0 -26 L22 -16 V4 C22 18 12 26 0 32 C-12 26 -22 18 -22 4 V-16Z M-10 2 L-2 10 L12 -6" fill="none" stroke="#141317" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></g>
    ${T(250, 342, 'Indicada em', 'serif')}${T(250, 376, 'diversas situações', 'serif')}
    <g transform="translate(750 230)"><circle r="56" class="badge e"/><path d="M0 -24 V8 M0 20 V22" fill="none" stroke="#8A2240" stroke-width="3.4" stroke-linecap="round"/></g>
    ${T(750, 342, 'Casos', 'serif w')}${T(750, 376, 'selecionados', 'serif w')}
    ${T(500, 460, 'As duas técnicas têm riscos · a escolha é individual', 'm')}</g>`;
  s += `<circle cx="500" cy="300" r="24" fill="#fff" stroke="#141317" stroke-opacity=".15"/><text x="500" y="309" text-anchor="middle" style="font-family:'Instrument Serif',serif;font-style:italic;font-size:26px;fill:#76727A">×</text>`;
  return s;
}
const fVs = mount('sxVs', '70 30 860 540', buildVersus(), 'Comparação lado a lado entre cirurgia aberta e cirurgia endoscópica, etapa por etapa.');
if (fVs) {
  const svg = fVs.querySelector('svg');
  const SC = ['A', 'B', 'B', 'C', 'C', 'C', 'C', 'D'];
  const NAMES = ['Incisão', 'Acesso às estruturas', 'Abordagem dos tecidos', 'Tempo de internação', 'Mobilidade pós-operatória', 'Recuperação', 'Retorno às atividades', 'Cuidados e limitações'];
  const scenes = {A: $('vA'), B: $('vB'), C: $('vC'), D: $('vD')}, now = $('sxVsNow');
  const rows = () => [...document.querySelectorAll('#vsRows .vs2-row')];
  player({watch: fVs, figs: [], durs: [4200, 4600, 5200, 3400, 3400, 3400, 3400, 4600], segs: $('sxVsSegs'), still: 2,
    onStep: n => {
      Object.entries(scenes).forEach(([key, g]) => g && g.classList.toggle('on', key === SC[n]));
      svg.classList.toggle('tis', n === 2);
      svg.querySelectorAll('.node').forEach(el => el.classList.toggle('cur', el.classList.contains('n' + (n - 3))));
      swap(now, `${String(n+1).padStart(2, '0')} · ${NAMES[n]}`);
      rows().forEach((r, i) => r.classList.toggle('on', i === n));
    }});
}
})();
