/* BREVES — Experiência imersiva. Orb WebGL (Three.js vendorado) + scroll.
   Porte estático/vanilla do componente React "Ethereal" (ScrollHero):
   mantém o espírito — esfera deformada por ruído, brilho de borda, rotação
   guiada pelo scroll e seções que revelam em sequência. Sem GSAP nem
   pós-processamento pesado; o brilho é feito no próprio shader + halo aditivo. */

import * as THREE from './vendor/three.module.min.js';

(function () {
  var root = document.querySelector('[data-eth]');
  if (!root) return;

  var canvas = root.querySelector('[data-eth-canvas]');
  var progressBar = root.querySelector('[data-eth-progress]');
  var loading = root.querySelector('[data-eth-loading]');
  var sections = Array.prototype.slice.call(root.querySelectorAll('[data-eth-section]'));
  var navLinks = Array.prototype.slice.call(root.querySelectorAll('[data-eth-nav]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll: progresso, seção ativa, revelação ---------- */
  var progress = 0, targetProgress = 0;

  function computeProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
  }
  function markScrolled() {
    if (window.scrollY > 40) root.classList.add('scrolled');
    else root.classList.remove('scrolled');
  }
  function updateActive() {
    var mid = window.innerHeight / 2, activeId = '', bestD = Infinity;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      var d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestD) { bestD = d; activeId = s.id; }
    });
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + activeId); });
  }
  window.addEventListener('scroll', function () { computeProgress(); markScrolled(); updateActive(); }, { passive: true });
  computeProgress(); updateActive();

  // revelação das seções
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.25 });
    sections.forEach(function (s) { io.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add('in'); });
  }

  function hideLoading() { if (loading) loading.classList.add('loaded'); }

  /* ---------- caminho sem WebGL / movimento reduzido ---------- */
  var gl = null;
  try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch (e) { gl = null; }
  if (reduce || !gl) {
    // fundo estático (o gradiente do CSS já dá o clima); ainda anima a barra
    function frameLite() {
      progress += (targetProgress - progress) * 0.15;
      if (progressBar) progressBar.style.transform = 'scaleY(' + progress.toFixed(4) + ')';
      window.requestAnimationFrame(frameLite);
    }
    frameLite();
    hideLoading();
    return;
  }

  /* ---------- shaders ---------- */
  var noiseGLSL = [
    'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
    'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
    'float snoise(vec3 v){',
    '  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);',
    '  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);',
    '  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);',
    '  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);',
    '  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));',
    '  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z);',
    '  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy;',
    '  vec4 h=1.0-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);',
    '  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));',
    '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
    '  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);',
    '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
    '  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;',
    '  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;',
    '  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
    '}',
    'float fbm(vec3 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*snoise(p);p*=2.0;a*=0.5;}return v;}'
  ].join('\n');

  var vert = [
    'varying vec3 vNormal; varying vec3 vPos; varying float vDisp;',
    'uniform float uTime; uniform float uScroll;',
    noiseGLSL,
    'void main(){',
    '  vNormal=normalize(normalMatrix*normal);',
    '  vec3 pos=position; float t=uTime*0.26;',
    '  float n=fbm(pos*1.15+vec3(t*0.4,-t*0.3,t*0.2));',
    '  float ridge=1.0-abs(snoise(pos*1.7+t*0.5));',
    '  float disp=n*0.18+ridge*0.04+uScroll*0.08;',
    '  vDisp=disp; vec3 np=pos+normal*disp; vPos=np;',
    '  gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.0);',
    '}'
  ].join('\n');

  var frag = [
    'precision highp float;',
    'varying vec3 vNormal; varying vec3 vPos; varying float vDisp;',
    'uniform float uTime; uniform vec3 uAmber; uniform vec3 uAmberDeep; uniform vec3 uViolet;',
    'void main(){',
    '  vec3 N=normalize(vNormal); vec3 V=vec3(0.0,0.0,1.0);',
    '  float ndv=max(dot(N,V),0.0); float fres=pow(1.0-ndv,2.4);',
    '  float g=clamp(0.5+vDisp*1.3+0.18*sin(uTime*0.4+vPos.y*1.5),0.0,1.0);',
    '  vec3 base=mix(uAmberDeep,uAmber,g);',
    '  vec3 L=normalize(vec3(0.6,0.85,0.7)); float diff=max(dot(N,L),0.0);',
    '  base*=(0.32+0.8*diff);',
    '  vec3 rim=mix(uAmber,uViolet,0.55)*fres*1.25;',
    '  vec3 glow=uAmber*abs(vDisp)*0.7;',
    '  vec3 col=base+rim+glow;',
    '  col+=sin(vPos.x*28.0+uTime)*sin(vPos.y*26.0-uTime)*0.012;',
    '  gl_FragColor=vec4(col,1.0);',
    '}'
  ].join('\n');

  var haloVert = [
    'varying vec3 vN;',
    'void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }'
  ].join('\n');
  var haloFrag = [
    'precision highp float; varying vec3 vN; uniform vec3 uColor;',
    'void main(){ vec3 V=vec3(0.0,0.0,1.0); float f=pow(1.0-max(dot(normalize(vN),V),0.0),3.0); gl_FragColor=vec4(uColor,f*0.55); }'
  ].join('\n');

  /* ---------- cena ---------- */
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6.0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  var detail = window.matchMedia('(min-width: 1024px)').matches ? 6 : 4;
  var geo = new THREE.IcosahedronGeometry(1.5, detail);

  var uAmber = new THREE.Color('#efb66f');
  var uAmberDeep = new THREE.Color('#a2662c');
  var uViolet = new THREE.Color('#8b7fd0');

  var mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uScroll: { value: 0 },
      uAmber: { value: uAmber }, uAmberDeep: { value: uAmberDeep }, uViolet: { value: uViolet }
    },
    vertexShader: vert, fragmentShader: frag
  });
  var orb = new THREE.Mesh(geo, mat);
  scene.add(orb);

  var haloMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: uAmber } },
    vertexShader: haloVert, fragmentShader: haloFrag,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false
  });
  var halo = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2), haloMat);
  halo.scale.setScalar(1.32);
  scene.add(halo);

  /* mouse parallax sutil */
  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5);
    mouse.y = (e.clientY / window.innerHeight - 0.5);
  });

  var startTime = performance.now();
  var raf = null, rotY = 0, rotX = 0, hidden = false;

  var errLogged = false;
  function frame() {
    raf = window.requestAnimationFrame(frame);
    if (hidden) return;
    try {
    var t = (performance.now() - startTime) / 1000;
    progress += (targetProgress - progress) * 0.08;

    mat.uniforms.uTime.value = t;
    mat.uniforms.uScroll.value = progress;

    // rotação: giro leve constante + guiada pelo scroll (com suavização)
    var tgtY = progress * Math.PI * 4.0 + t * 0.05;
    var tgtX = progress * Math.PI * 1.6;
    rotY += (tgtY - rotY) * 0.06;
    rotX += (tgtX - rotX) * 0.06;
    orb.rotation.y = halo.rotation.y = rotY;
    orb.rotation.x = halo.rotation.x = rotX;

    // respiração + parallax
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;
    var breathe = 1 + Math.sin(t * 0.5) * 0.015;
    orb.scale.setScalar(breathe);
    orb.position.x = halo.position.x = mouse.sx * 0.35;
    orb.position.y = halo.position.y = -mouse.sy * 0.35 + Math.sin(t * 0.45) * 0.04;

    if (progressBar) progressBar.style.transform = 'scaleY(' + progress.toFixed(4) + ')';
    renderer.render(scene, camera);
    } catch (err) {
      if (!errLogged) { errLogged = true; console.error('eth frame error:', err && err.message); }
      window.cancelAnimationFrame(raf); raf = null; hideLoading();
    }
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; });

  frame();
  // primeiro quadro pronto → esconde o "Carregando"
  window.setTimeout(hideLoading, 450);
})();
