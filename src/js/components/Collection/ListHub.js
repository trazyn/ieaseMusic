import ImageBackground from './ui/ImageBackground';
import ParticleBackground from './ui/ParticleBackground';
import ParticleStream from './ui/ParticleStream';
import Box from './ui/Box';
import { Manifest } from './ui/Manifest';
const PIXI = require('pixi.js');

export default class ListHub {
    constructor(element) {
        this.element = element;
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;
        this.manifest = Manifest;
    }
    init() {
        let rendererOptions = { width: this.stageWidth, height: this.stageHeight, resolution: 1, backgroundColor: 0x000000 };
        this.layoutData = [
            { dx: 0, dy: 0, dz: 1, w: 150, h: 150 },
            { dx: 200, dy: 80, dz: 0.89, w: 120, h: 120 },
            { dx: 150, dy: 50, dz: 0.89, w: 130, h: 130 },
            { dx: 150, dy: 70, dz: 0.89, w: 160, h: 160 },
            // { dx: 400, dy: -180, dz: 0.9, w: 100, h: 80 },
            // { dx: 250, dy: 230, dz: 1, w: 110, h: 80 },
            // { dx: 460, dy: -80, dz: 0.91, w: 100, h: 80 },
            // { dx: 10, dy: 300, dz: 0.9, w: 100, h: 80 },
            // { dx: 320, dy: -160, dz: 0.8, w: 100, h: 80 },
            // { dx: 240, dy: 270, dz: 0.96, w: 100, h: 80 },
            // { dx: 310, dy: -250, dz: 0.87, w: 100, h: 80 },
            // { dx: 260, dy: 330, dz: 0.82, w: 100, h: 80 }
        ];
        this.app = new PIXI.Application(rendererOptions);
        this.app.view.style['touch-action'] = 'pan-y';
        this.app.renderer.plugins.interaction.autoPreventDefault = false;
        document.body.appendChild(this.app.view);
        // const bg = PIXI.Sprite.fromImage(bgcolorful);
        // this.app.view.addEventListener('mouseover', this.handleMouseover);
        this.createBackground();
        this.loadManifest();
        this.createBoxList();
        this.createBoxStream();
        console.log(this.app.stage);
    }
    createBackground() {
        this.bg = new ImageBackground(this.stageWidth, this.stageHeight);
        this.bgParticles = new ParticleBackground(80);
        this.particleStream = new ParticleStream(40, this.stageWidth, this.stageHeight);
        this.app.stage.addChildAt(this.bg, 0);
        this.app.stage.addChildAt(this.bgParticles, 1);
        this.app.stage.addChild(this.particleStream);
    }

    createBoxList() {
        this.AllBoxes = [];
        this.BoxListLayer = new PIXI.Container();
        let lyLength = this.layoutData.length;
        let xCount = this.layoutData[0].dx;
        for (let i = 0; i < lyLength; i++) {
            let n = i % lyLength;
            let data = { 'test': 1 };
            xCount += this.layoutData[n].dx;
            // if (i > 0 && n === 0) xCount += 50;
            console.log('x', xCount);
            let SingleBox = new Box(data, this.layoutData[n].w, this.layoutData[n].h, xCount, this.layoutData[n].dy, this.layoutData[n].dz);
            this.BoxListLayer.addChildAt(SingleBox, 0);
            this.AllBoxes.push(SingleBox);
        }
        this.app.stage.addChild(this.BoxListLayer);
    }
    createBoxStream() {
        let max = this.AllBoxes.length;
        let arr = [];
        for (let i = 0; i < max; i++) {
            // this.AllBoxes[i].addForce(this.externalForces.x + this.driftForce, this.stageWidth);
            let pt = this.AllBoxes[i].getBoxPosition();
            let w = pt.width * this.BoxListLayer.scale.x;
            let h = pt.height * this.BoxListLayer.scale.y;
            let pt2 = { x: pt.x + w, y: pt.y };
            let pt3 = { x: pt.x + w, y: pt.y + h };
            let pt4 = { x: pt.x, y: pt.y + h };
            arr.push(pt);
            arr.push(pt2);
            arr.push(pt3);
            arr.push(pt4);
        }
        console.log(arr);
        // this.particleStream.update(arr);
    }
    loadManifest() {
        this.ldr = PIXI.loader;
        for (let i = 0; i < this.manifest.length; i++) {
            this.ldr.add(this.manifest[i].id, this.manifest[i].src);
        }
        this.ldr.once('complete', this.handleLoadComplete.bind(this));
        this.ldr.load();
    }
    handleLoadComplete() {
        this.startScene();
    }
    handleMouseover = (e) => {
        console.log(e);
    }
    startScene() {
        this.bg.addMainTexture(PIXI.loader.resources['bg-main'].texture);
        let pArray = [PIXI.loader.resources['bg-particle-01'].texture, PIXI.loader.resources['bg-particle-02'].texture];
        this.bgParticles.initParticles(pArray);
        this.app.ticker.add((tick = 0) => {
            this.bgParticles.update();
            tick += 0.1;
        });
    }
};
