import 'babel-polyfill';
import * as dat from 'dat.gui';
import './../sass/styles.scss';


/*--------------------
Settings
--------------------*/
let settings = {
  background: '#0a0117',
  gradientStart: '#60000e',
  gradientEnd: '#6616d4',
  cells: 30,
  minSize: 80,
  maxSize: 160,
  sensibility: 0.2,
  download: () => {
    saveSVG();
  },
  random: () => {
    randomize();
  }
}


/*--------------------
Vars
--------------------*/
const svg = document.getElementById('mitosys');
let winW = window.innerWidth,
  winH = window.innerHeight,
  Balls = [];


/*--------------------
Mouse
--------------------*/
let mouse = {
  x: 0,
  y: 0
};
const onMouseMove = (e) => {
  mouse = {
    x: e.clientX || e.pageX || e.touches[0].pageX || 0,
    y: e.clientY || e.pageY || e.touches[0].pageY || 0
  };
};
['mousemove', 'touchmove'].forEach(event => {
  window.addEventListener(event, onMouseMove);
});


/*--------------------
Balls
--------------------*/
class Ball {
  constructor(options) {
    Object.assign(this, options);

    this.r = settings.minSize + Math.random() * Math.abs(settings.maxSize - settings.minSize);
    this.pos = {
      x: Math.random() * (winW + this.r * 2),
      y: Math.random() * (winH + this.r * 2)
    };
    this.vel = 0.5;
    this.dir = {
      x: -1 + Math.random() * 2,
      y: -1 + Math.random() * 2
    }
    this.acc = {
      x: 0,
      y: 0
    }
    this.diff = {
      x: 0,
      y: 0
    }
    this.options = {
      cx: this.pos.x,
      cy: this.pos.y,
      r: this.r,
      fill: 'url("#radialGradient")',
      style: 'mix-blend-mode: lighten;'
    }
    this.el = document.createElementNS(svg.namespaceURI, 'circle');

    this.draw();
  }

  draw() {
    for (const i in this.options) {
      this.el.setAttribute(i, this.options[i]);
    }
    svg.appendChild(this.el);
  }

  checkDistance() {
    this.diff.x = mouse.x - this.pos.x;
    this.diff.y = mouse.y - this.pos.y;
    this.dist = Math.sqrt(this.diff.x * this.diff.x + this.diff.y * this.diff.y);
  }

  remove() {
    this.el.parentNode.removeChild(this.el);
  }

  update() {

    this.checkDistance();
    if (this.dist < this.r) {
      this.acc.x += -this.diff.x / this.r * settings.sensibility;
      this.acc.y += -this.diff.y / this.r * settings.sensibility;
    }

    this.acc.x *= 0.96;
    this.acc.y *= 0.96;

    this.pos.x += this.dir.x * this.vel + this.acc.x;
    this.pos.y += this.dir.y * this.vel + this.acc.y;

    this.el.setAttribute('cx', this.pos.x);
    this.el.setAttribute('cy', this.pos.y);

    if (this.pos.x < -this.r) {
      this.acc.x = -7;
      this.pos.x = winW + this.r - 1;
    } else if (this.pos.x > winW + this.r) {
      this.acc.x = 7;
      this.pos.x = -this.r + 1;
    }

    if (this.pos.y < -this.r) {
      this.acc.y = -7;
      this.pos.y = winH + this.r - 1;
    } else if (this.pos.y > winH + this.r) {
      this.acc.y = 7;
      this.pos.y = -this.r + 1;
    }
  }
}


/*--------------------
Add Gradient
--------------------*/
const addGradient = () => {
  const defs = document.createElementNS(svg.namespaceURI, 'defs');
  const radialGradient = document.createElementNS(svg.namespaceURI, 'radialGradient');
  const radialOptions = {
    id: 'radialGradient',
    spreadMethod: 'reflect',
    cx: '50%',
    cy: '50%',
    r: '50%',
    fx: '55%',
    fy: '65%',
    fr: '100%'
  }
  for (const i in radialOptions) {
    radialGradient.setAttribute(i, radialOptions[i]);
  }

  const radialGradientStart = document.createElementNS(svg.namespaceURI, 'stop');
  radialGradientStart.setAttribute('offset', '0%');
  radialGradientStart.setAttribute('stop-color', '#fff');

  const radialGradientStop = document.createElementNS(svg.namespaceURI, 'stop');
  radialGradientStop.setAttribute('offset', '100%');
  radialGradientStop.setAttribute('stop-color', '#000');

  const linearGradient = document.createElementNS(svg.namespaceURI, 'linearGradient');
  const linearOptions = {
    id: 'linearGradient',
    x1: '0%',
    y1: '100%',
    x2: '100%',
    y2: '0%'
  }
  for (const i in linearOptions) {
    linearGradient.setAttribute(i, linearOptions[i]);
  }

  const linearGradientStart = document.createElementNS(svg.namespaceURI, 'stop');
  linearGradientStart.setAttribute('class', 'gradient-start');
  linearGradientStart.setAttribute('offset', '0%');
  linearGradientStart.setAttribute('stop-color', settings.gradientStart);

  const linearGradientEnd = document.createElementNS(svg.namespaceURI, 'stop');
  linearGradientEnd.setAttribute('class', 'gradient-end');
  linearGradientEnd.setAttribute('offset', '100%');
  linearGradientEnd.setAttribute('stop-color', settings.gradientEnd);

  svg.appendChild(defs);
  defs.appendChild(radialGradient);
  radialGradient.appendChild(radialGradientStart);
  radialGradient.appendChild(radialGradientStop);
  defs.appendChild(linearGradient);
  linearGradient.appendChild(linearGradientStart);
  linearGradient.appendChild(linearGradientEnd);
}


/*--------------------
CreateRect
--------------------*/
const createRects = () => {
  const baseRect = document.createElementNS(svg.namespaceURI, 'rect');
  const baseRectOptions = {
    'class': 'rect-bg',
    height: '100%',
    width: '100%',
    fill: settings.background
  }
  for (let i in baseRectOptions) {
    baseRect.setAttribute(i, baseRectOptions[i]);
  }
  svg.prepend(baseRect);

  const rect = document.createElementNS(svg.namespaceURI, 'rect');
  const rectOptions = {
    height: '100%',
    width: '100%',
    fill: 'url("#linearGradient")',
    style: 'mix-blend-mode: hard-light'
  }
  for (let i in rectOptions) {
    rect.setAttribute(i, rectOptions[i]);
  }
  svg.appendChild(rect);
}


/*--------------------
CreateText
--------------------*/
const createText = () => {
  const text = document.createElementNS(svg.namespaceURI, 'text');
  const textOptions = {
    'text-anchor': 'middle',
    x: '50%',
    y: '50%',
    fill: '#fff',
    textLength: winW / 1.3,
    style: 'font-family: "Montserrat", sans-serif; mix-blend-mode: soft-light; font-size: ' + Math.min(winW / 40, 20) + 'px;'
  }
  for (let i in textOptions) {
    text.setAttribute(i, textOptions[i]);
  }
  text.innerHTML = 'MITOSYS'
  svg.appendChild(text);
}


/*--------------------
Init
--------------------*/
const init = () => {
  console.clear();
  winW = window.innerWidth;
  winH = window.innerHeight;
  svg.innerHTML = '';
  const svgAttributes = {
    width: winW,
    height: winH,
    viewBox: '0 0 ' + winW + ' ' + winH,
    xmlns: 'http://www.w3.org/2000/svg'
  }
  for (let i in svgAttributes) {
    svg.setAttribute(i, svgAttributes[i]);
  }
  addGradient();

  Balls = [];
  for (let i = 0; i < settings.cells; i++) {
    Balls.push(new Ball({
      ind: i
    }));
  }

  createRects();
  createText();
}
init();


/*--------------------
Animate
--------------------*/
const animate = () => {
  window.requestAnimationFrame(animate);
  Balls.forEach(ball => {
    ball.update();
  });
}
animate();


/*--------------------
Resize
--------------------*/
window.addEventListener('resize', () => {
  init();
});


/*--------------------
Download
--------------------*/
const saveSVG = () => {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.innerHTML = 'download';
  link.href = url;
  link.target = '_blank';
  link.setAttribute('download', 'mitosys.svg');
  link.click();
}


/*--------------------
Randomize
--------------------*/
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomize = () => {
  settings.gradientStart = getRandomColor();
  settings.gradientEnd = getRandomColor();
  settings.cell = getRandom(5, 100);
  settings.minSize = getRandom(5, 200);
  settings.maxSize = getRandom(5, 200);

  init();
}


/*--------------------
Dat Gui
--------------------*/
const datGui = () => {
  const gui = new dat.GUI();
  gui.open();
  document.querySelector('.dg.ac').style.right = '-15px'

  let guiSettings = gui.addFolder('Settings');
  guiSettings.add(settings, 'cells', 5, 100).step(5).name('Cells number').onChange(init).listen();
  guiSettings.add(settings, 'minSize', 5, 200).name('Min radius').step(1).onChange(init).listen();
  guiSettings.add(settings, 'maxSize', 5, 200).name('Max radius').step(1).onChange(init).listen();
  guiSettings.add(settings, 'sensibility', 0, 2).name('Sensibility').step(.1).onChange(init).listen();
  guiSettings.close();

  let guiColors = gui.addFolder('Colors');
  guiColors.addColor(settings, 'gradientStart').name('Color 1').onChange(() => {
    document.querySelector('.gradient-start').setAttribute('stop-color', settings.gradientStart);
  }).listen();
  guiColors.addColor(settings, 'gradientEnd').name('Color 2').onChange(() => {
    document.querySelector('.gradient-end').setAttribute('stop-color', settings.gradientEnd);
  }).listen();
  gui.add(settings, 'random').name("Randomize");
  gui.add(settings, 'download').name("Download SVG");

  return gui;
}
datGui();