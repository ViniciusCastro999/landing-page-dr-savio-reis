/* Coluna lombar em 3D para a seção "caminho menor".
   Modelo procedural (sem arquivos externos). Segue as etapas do player de anatomia.js
   lendo as classes p1…p4 de #sxCaminho. Se o WebGL falhar, a ilustração SVG continua. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('sxCaminho');
if (host) {
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '600px 0px' });
  io.observe(host);
}

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return; }
  if (!renderer.getContext()) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 's3-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);

  /* ---------- luz ---------- */
  // fundo claro (seção sem data-dark): cores e mesclas próprias para não sumir no branco
  const LIGHT = !host.closest('[data-dark]');
  scene.add(new THREE.HemisphereLight(0xfff4ea, LIGHT ? 0x8a6a6a : 0x2a0d16, LIGHT ? 0.8 : 0.55));
  const key = new THREE.DirectionalLight(0xfff1e0, 2.2);
  key.position.set(12, 14, -4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff8fa6, LIGHT ? 1.2 : 2.4);
  rim.position.set(-10, 6, -12);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffe2c4, 0.5);
  fill.position.set(8, -6, 12);
  scene.add(fill);

  /* ---------- materiais ---------- */
  const M = {
    bone: new THREE.MeshPhysicalMaterial({ color: 0xe6d7bf, roughness: 0.68, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0xfff3e0), sheenRoughness: 0.6 }),
    disc: new THREE.MeshPhysicalMaterial({ color: 0xe7a39a, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color(0xffd0c8) }),
    dura: new THREE.MeshPhysicalMaterial({ color: 0xe9bcc6, roughness: 0.35, clearcoat: 0.5, transparent: true, opacity: 0.92 }),
    nerve: new THREE.MeshStandardMaterial({ color: 0xe0a93b, roughness: 0.35, metalness: 0.05, emissive: 0x6a4300, emissiveIntensity: 0.35 }),
    hot: new THREE.MeshStandardMaterial({ color: 0xd93a55, roughness: 0.35, emissive: 0xd93a55, emissiveIntensity: 0.6 }),
    hern: new THREE.MeshPhysicalMaterial({ color: 0xd93a55, roughness: 0.3, clearcoat: 0.8, emissive: 0xb0213f, emissiveIntensity: 0.55 }),
    muscle: new THREE.MeshStandardMaterial({ color: 0x5a1a2c, roughness: 0.8, transparent: true, opacity: 0.38, depthWrite: false }),
    skin: new THREE.MeshStandardMaterial({ color: 0xc98b76, roughness: 0.6, transparent: true, opacity: 0.55, depthWrite: false }),
    open: new THREE.MeshBasicMaterial({ color: LIGHT ? 0xb3243f : 0xff4d6d, transparent: true, opacity: 0, depthWrite: false, blending: LIGHT ? THREE.NormalBlending : THREE.AdditiveBlending }),
    path: new THREE.MeshBasicMaterial({ color: LIGHT ? 0xd18f12 : 0xffc35a, transparent: true, opacity: 0.95 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd9d6de, metalness: 1, roughness: 0.22 }),
    grip: new THREE.MeshStandardMaterial({ color: 0x24212a, metalness: 0.4, roughness: 0.45 }),
  };
  const mesh = (g, m, sh = true) => { const o = new THREE.Mesh(g, m); o.castShadow = sh; o.receiveShadow = sh; return o; };

  /* ---------- geometria ---------- */
  // Eixos: Y = cabeça, +Z = frente (anterior), −Z = costas (posterior), X = lateral (lado da câmera)
  const kidney = (w, d, notch) => {
    const s = new THREE.Shape(), hw = w / 2, hd = d / 2;
    s.moveTo(0, hd - notch);
    s.bezierCurveTo(-hw * 0.45, hd + 0.05, -hw, hd * 0.95, -hw, hd * 0.3);
    s.bezierCurveTo(-hw, -hd * 0.55, -hw * 0.6, -hd, 0, -hd);
    s.bezierCurveTo(hw * 0.6, -hd, hw, -hd * 0.55, hw, hd * 0.3);
    s.bezierCurveTo(hw, hd * 0.95, hw * 0.45, hd + 0.05, 0, hd - notch);
    return s;
  };
  const slab = (shape, h, bev, waist = 0) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(h - 2 * bev, 0.01), steps: waist ? 8 : 1, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 5, curveSegments: 28 });
    g.translate(0, 0, -(h - 2 * bev) / 2);
    g.rotateX(-Math.PI / 2); // forma: v+ → posterior (−Z); extrusão → Y
    if (waist) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) / (h / 2), k = 1 - waist * (1 - y * y); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } }
    g.computeVertexNormals();
    return g;
  };

  const BODY_W = 4.6, BODY_D = 3.4, BODY_H = 2.5, DISC_H = 1.05, STEP = BODY_H + DISC_H;
  const BODY_Z = BODY_D / 2 - 0.7; // borda posterior do corpo em z = −0.7
  const CANAL_Z = -1.55;
  const gBody = slab(kidney(BODY_W, BODY_D, 0.45), BODY_H, 0.32, 0.09);
  const gDisc = slab(kidney(BODY_W * 0.97, BODY_D * 0.96, 0.42), DISC_H + 0.1, 0.22);
  const gPed = new THREE.CylinderGeometry(0.42, 0.46, 1.1, 20).rotateX(Math.PI / 2);
  const gLam = new THREE.TorusGeometry(1.18, 0.38, 16, 40, Math.PI).rotateX(-Math.PI / 2);
  const gTrans = new THREE.CapsuleGeometry(0.27, 1.9, 8, 16).rotateZ(Math.PI / 2);
  const gFacet = new THREE.CapsuleGeometry(0.3, 0.75, 8, 16);
  const spProfile = new THREE.Shape();
  spProfile.moveTo(0, 0.85); spProfile.bezierCurveTo(1.0, 0.75, 1.9, 0.45, 2.55, 0.05);
  spProfile.bezierCurveTo(2.85, -0.15, 2.8, -0.75, 2.45, -0.95); spProfile.bezierCurveTo(1.7, -0.9, 0.8, -0.85, 0, -0.75); spProfile.lineTo(0, 0.85);
  const gSpin = new THREE.ExtrudeGeometry(spProfile, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.14, bevelSegments: 4, curveSegments: 20 });
  gSpin.translate(0, 0, -0.25); gSpin.rotateY(Math.PI / 2); gSpin.computeVertexNormals(); // forma x → −Z

  const spine = new THREE.Group();
  scene.add(spine);
  const LEVELS = [{ n: 'L3', y: STEP, r: 0.06, z: -0.15 }, { n: 'L4', y: 0, r: 0, z: 0 }, { n: 'L5', y: -STEP, r: -0.09, z: 0.2 }];
  const levelGroups = {};
  LEVELS.forEach(L => {
    const g = new THREE.Group();
    g.position.set(0, L.y, L.z); g.rotation.x = L.r;
    const body = mesh(gBody, M.bone); body.position.z = BODY_Z; g.add(body);
    [-1, 1].forEach(sd => {
      const p = mesh(gPed, M.bone); p.position.set(sd * 1.12, 0.35, -1.15); g.add(p);
      const t = mesh(gTrans, M.bone); t.position.set(sd * 2.25, 0.45, -1.75); t.rotation.z = sd * 0.08; g.add(t);
      const fs = mesh(gFacet, M.bone); fs.position.set(sd * 1.15, 1.35, -2.05); g.add(fs);
      const fi = mesh(gFacet, M.bone); fi.position.set(sd * 1.05, -0.95, -2.35); g.add(fi);
    });
    const lam = mesh(gLam, M.bone); lam.position.set(0, 0.25, CANAL_Z); lam.scale.set(1, 1.9, 1); g.add(lam);
    const sp = mesh(gSpin, M.bone); sp.position.set(0, -0.05, -2.45); sp.rotation.x = -0.12; g.add(sp);
    spine.add(g); levelGroups[L.n] = g;
  });
  // sacro (topo)
  const sac = new THREE.Group();
  sac.position.set(0, -2 * STEP - 0.35, 0.65); sac.rotation.x = -0.32;
  const sb = mesh(slab(kidney(BODY_W * 1.08, BODY_D * 1.05, 0.5), BODY_H * 1.15, 0.34, 0.06), M.bone); sb.position.z = BODY_Z; sac.add(sb);
  const ala = mesh(new RoundedBoxGeometry(BODY_W * 1.5, BODY_H * 1.3, 2.6, 4, 0.5), M.bone); ala.position.set(0, -0.6, -1.6); sac.add(ala);
  spine.add(sac);
  // discos
  const discYs = [];
  for (let i = 0; i < 3; i++) {
    const a = i < 2 ? levelGroups[LEVELS[i + 1].n] : sac, b = levelGroups[LEVELS[i].n];
    const y = (b.position.y + a.position.y) / 2 + (i === 2 ? 0.45 : 0), z = (b.position.z + a.position.z) / 2, r = (b.rotation.x + a.rotation.x) / 2;
    const d = mesh(gDisc, M.disc); d.position.set(0, y, z + BODY_Z); d.rotation.x = r; spine.add(d);
    discYs.push({ y, z });
  }
  // dura-máter (canal)
  const dura = mesh(new THREE.CylinderGeometry(0.72, 0.62, 11.5, 32, 1, true), M.dura, false);
  dura.position.set(0, -2.6, CANAL_Z + 0.05); dura.rotation.x = -0.04; spine.add(dura);

  // raízes nervosas
  const roots = [];
  const rootCurve = (yd, zd, sd) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(sd * 0.45, yd + 1.05, CANAL_Z + zd),
    new THREE.Vector3(sd * 1.55, yd + 0.35, CANAL_Z + zd + 0.35),
    new THREE.Vector3(sd * 2.85, yd - 0.95, zd + 0.35),
    new THREE.Vector3(sd * 3.45, yd - 3.4, zd + 1.9),
    new THREE.Vector3(sd * 3.7, yd - 7.0, zd + 3.0),
  ], false, 'catmullrom', 0.5);
  let hotCurve;
  discYs.forEach((d, i) => [-1, 1].forEach(sd => {
    const c = rootCurve(d.y, d.z, sd), isHot = i === 1 && sd === 1;
    const m = mesh(new THREE.TubeGeometry(c, 90, isHot ? 0.21 : 0.19, 14, false), isHot ? M.hot : M.nerve);
    spine.add(m); roots.push(m); if (isHot) hotCurve = c;
  }));

  // hérnia (disco L4‑L5, póstero‑lateral, do lado da câmera)
  const hd = discYs[1];
  const HC = new THREE.Vector3(1.45, hd.y + 0.05, hd.z - 0.75);
  const gH = new THREE.IcosahedronGeometry(0.72, 5);
  { const p = gH.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + 0.12 * Math.sin(v.x * 5.1 + v.y * 3.7) * Math.cos(v.z * 4.3); v.multiplyScalar(k); p.setXYZ(i, v.x * 1.15, v.y * 0.75, v.z); }
    gH.computeVertexNormals(); }
  const hern = mesh(gH, M.hern); hern.position.copy(HC); spine.add(hern);
  const hernLight = new THREE.PointLight(0xff3b5c, 6, 4.5, 2); hernLight.position.copy(HC).add(new THREE.Vector3(0.6, 0, 0)); spine.add(hernLight);

  // músculos e pele (atrás da coluna)

  // área mexida na cirurgia aberta
  const yTop = levelGroups.L4.position.y + 1.6, yBot = levelGroups.L5.position.y - 1.6;
  const gOpen = new RoundedBoxGeometry(4.6, yTop - yBot, 4.9, 4, 0.6);
  const open = mesh(gOpen, M.open, false); open.position.set(0, (yTop + yBot) / 2, -4.85); open.renderOrder = 4; spine.add(open);
  const openEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.6, yTop - yBot, 4.9)), new THREE.LineDashedMaterial({ color: LIGHT ? 0xb3243f : 0xff6b85, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0 }));
  openEdges.computeLineDistances(); openEdges.position.copy(open.position); openEdges.renderOrder = 5; spine.add(openEdges);

  // trajeto da endoscopia
  const E = new THREE.Vector3(4.0, 3.4, -7.35), T = HC.clone().add(new THREE.Vector3(0.15, 0.05, -0.25));
  const D = T.clone().sub(E).normalize(), LEN = T.distanceTo(E);
  const gPath = new THREE.TubeGeometry(new THREE.LineCurve3(E, T), 64, 0.07, 10, false);
  const pathM = mesh(gPath, M.path, false); pathM.renderOrder = 6; spine.add(pathM);
  const pathCount = gPath.index.count; gPath.setDrawRange(0, 0);
  const cut = mesh(new THREE.CapsuleGeometry(0.09, 0.55, 6, 12), new THREE.MeshBasicMaterial({ color: LIGHT ? 0xd18f12 : 0xffc35a, transparent: true, opacity: 0 }), false);
  cut.position.copy(E); cut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.75, 0.66, 0).normalize()); spine.add(cut);

  // endoscópio
  const scope = new THREE.Group();
  const tube = mesh(new THREE.CylinderGeometry(0.2, 0.2, 9, 24).translate(0, 4.5, 0), M.steel);
  const grip = mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.6, 28).translate(0, 10.1, 0), M.grip);
  const tipRing = mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.18, 24).translate(0, 0.09, 0), new THREE.MeshStandardMaterial({ color: 0x8a2240, metalness: 0.6, roughness: 0.3 }));
  scope.add(tube, grip, tipRing);
  scope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), D.clone().negate());
  spine.add(scope);
  const tipLight = new THREE.PointLight(0xffe2a8, 0, 5, 2); spine.add(tipLight);
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(0.25, 'rgba(255,214,140,.55)'); g.addColorStop(1, 'rgba(255,200,120,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(2.6, 2.6, 1); glow.renderOrder = 10; spine.add(glow);

  spine.position.set(0, 0.4, 0);

  /* ---------- rótulos (HTML, mesma fonte do site) ---------- */
  const labWrap = document.createElement('div'); labWrap.className = 's3-labels'; labWrap.setAttribute('aria-hidden', 'true');
  const LAB = {};
  const addLab = (k, html, cls, anchor) => { const el = document.createElement('span'); el.className = 's3-lab ' + cls; el.innerHTML = html; labWrap.appendChild(el); LAB[k] = { el, anchor, o: 0 }; };
  addLab('open', 'Cirurgia aberta', 'r', new THREE.Vector3(2.4, yBot - 0.9, -4.9));
  addLab('cut', 'Corte de<br>~8 mm', 'g', E.clone().add(new THREE.Vector3(0.4, 0.2, -1.1)));
  addLab('endo', 'Endoscopia', 'g', E.clone().lerp(T, 0.32).add(new THREE.Vector3(0, 1.0, 0)));
  addLab('free', 'Nervo livre', 'g', hotCurve.getPoint(0.62).add(new THREE.Vector3(0.6, 0, 0)));

  host.appendChild(canvas); host.appendChild(labWrap);
  host.classList.add('is3d');

  /* ---------- etapas ---------- */
  const SPEED = 1.3; /* ritmo da animação (casa com as durações em anatomia.js) */
  let step = 0, stepAt = performance.now();
  const readStep = () => { let n = 0; for (let j = 1; j <= 4; j++) if (host.classList.contains('p' + j)) n = j; return n; };
  new MutationObserver(() => { const n = readStep(); if (n !== step) { step = n; stepAt = performance.now(); } }).observe(host, { attributes: true, attributeFilter: ['class'] });
  step = readStep();

  const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const seg = (t, a, b) => ease((t - a) / (b - a));
  const cur = {};
  const damp = (k, target, dt, rate = 7) => { if (cur[k] === undefined) cur[k] = target; cur[k] += (target - cur[k]) * (1 - Math.exp(-dt * rate)); return cur[k]; };
  const cRed = new THREE.Color(0xd93a55), cGold = new THREE.Color(0xe0a93b), cTmp = new THREE.Color();

  function targets(t) {
    const s = step, big = reduce ? 99 : t;
    const tt = s === 0 ? 0 : big;
    return {
      open: (LIGHT ? 1.8 : 1) * (s === 1 ? 0.13 * seg(tt, 0.1, 1.1) : s >= 2 ? 0.03 : 0),
      edges: s === 1 ? 0.85 * seg(tt, 0.1, 1.1) : s >= 2 ? 0.2 : 0,
      path: s === 2 ? seg(tt, 0.2, 1.8) : s >= 3 ? 1 : 0,
      pathO: s === 2 ? 0.95 : s === 3 ? 0.35 : s === 4 ? 0.6 : 0,
      cut: s >= 2 ? seg(s === 2 ? tt : 9, 1.0, 1.6) : 0,
      scope: s === 3 ? seg(tt, 0.2, 2.3) : s === 4 ? 1 - seg(tt, 0.2, 1.6) : 0,
      light: s === 3 ? seg(tt, 1.9, 2.5) * (1 - seg(tt, 5.2, 5.9)) : 0,
      hern: s === 3 ? 1 - seg(tt, 2.6, 4.0) : s === 4 ? 0 : 1,
      calm: s === 3 ? seg(tt, 3.6, 5.0) : s === 4 ? 1 : 0,
      lOpen: s === 1 ? seg(tt, 0.6, 1.2) : 0,
      lCut: s >= 2 ? seg(s === 2 ? tt : 9, 1.0, 1.6) : 0,
      lEndo: s === 2 ? seg(tt, 1.0, 1.6) : 0,
      lFree: s === 4 ? seg(tt, 0.9, 1.5) : 0,
    };
  }

  /* ---------- tamanho e câmera ---------- */
  let W = 1, H = 1;
  const FOCUS = new THREE.Vector3(0.9, -1.3, -2.2);
  const fit = () => {
    const r = host.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  };
  new ResizeObserver(fit).observe(host); fit();
  let px = 0, py = 0;
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5; });
  host.addEventListener('pointerleave', () => { px = py = 0; });
  const v = new THREE.Vector3();

  function place(time) {
    const fovV = THREE.MathUtils.degToRad(camera.fov), th = Math.tan(fovV / 2);
    const needH = 15.2, needW = 12.8;
    const dist = Math.max(needH / 2 / th, needW / 2 / (th * camera.aspect)) + 4;
    const az = -0.3 + (reduce ? 0 : Math.sin(time * 0.00022) * 0.1) + damp('px', px * 0.25, 0.016, 3);
    const el = 0.16 + damp('py', py * 0.12, 0.016, 3);
    camera.position.set(FOCUS.x + dist * Math.cos(az) * Math.cos(el), FOCUS.y + dist * Math.sin(el), FOCUS.z + dist * Math.sin(az) * Math.cos(el));
    camera.lookAt(FOCUS);
  }

  /* ---------- laço ---------- */
  let visible = true, last = performance.now(), raf = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }, { threshold: 0 }).observe(host);

  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const tg = targets((now - stepAt) / 1000 * SPEED);
    const g = k => damp(k, tg[k], dt);

    M.open.opacity = g('open'); openEdges.material.opacity = g('edges');
    gPath.setDrawRange(0, Math.floor(pathCount * g('path') / 3) * 3); M.path.opacity = g('pathO');
    cut.material.opacity = g('cut');
    const sc = g('scope');
    const tip = T.clone().addScaledVector(D, -(1 - sc) * (LEN + 4));
    scope.position.copy(tip); scope.visible = sc > 0.002;
    const li = g('light');
    tipLight.position.copy(tip).addScaledVector(D, -0.4); tipLight.intensity = 14 * li;
    glow.position.copy(tip); glow.material.opacity = 0.9 * li;
    const he = g('hern'), pulse = reduce ? 1 : 1 + 0.06 * Math.sin(now * 0.004);
    hern.scale.setScalar(Math.max(0.0001, he * pulse)); hern.visible = he > 0.01;
    hern.position.copy(HC).lerp(T, 1 - he);
    const ca = g('calm');
    hernLight.intensity = (1 - ca) * (reduce ? 5 : 5 + 2.5 * Math.sin(now * 0.004));
    cTmp.copy(cRed).lerp(cGold, ca); M.hot.color.copy(cTmp);
    M.hot.emissive.copy(cTmp).multiplyScalar(ca > 0.5 ? 0.35 : 1); M.hot.emissiveIntensity = 0.6 - 0.25 * ca;

    place(now);
    renderer.render(scene, camera);

    // rótulos
    const lv = { open: g('lOpen'), cut: g('lCut'), endo: g('lEndo'), free: g('lFree') };
    for (const k in LAB) {
      const L = LAB[k]; v.copy(L.anchor); spine.localToWorld(v); v.project(camera);
      L.el.style.transform = `translate(${((v.x + 1) / 2 * W).toFixed(1)}px,${((1 - v.y) / 2 * H).toFixed(1)}px) translate(-50%,-50%)`;
      L.el.style.opacity = lv[k].toFixed(3);
    }
    if (visible) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
}
