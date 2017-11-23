import ImageBackground from './ui/ImageBackground';
import ParticleBackground from './ui/ParticleBackground';
import List from './ui/List';
import { Manifest } from './ui/Manifest';
// import { TimelineMax } from 'gsap';
const PIXI = require('pixi.js');

export default class ListHub {
    constructor(element) {
        this.element = element;
        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;
        this.manifest = Manifest;
    }
    init(playList) {
        this._playList = playList;
        this.bgParticles = new ParticleBackground(80);
        this.grabbing = false;
        let rendererOptions = { width: this.stageWidth, height: this.stageHeight, resolution: 1, backgroundColor: 0x000000 };
        this.app = new PIXI.Application(rendererOptions);
        this.app.view.style['touch-action'] = 'pan-y';
        this.app.stage.interactive = true;
        this.app.renderer.plugins.interaction.autoPreventDefault = false;
        document.body.appendChild(this.app.view);
        this.loadManifest();
        this.createBackground();
        this.createBoxList();
        // this.createBoxStream();
        console.log(this.app.stage);
        // last bind event
        this.addMouseEvents();
        this.loopFrame();
    }
    createBackground() {
        this.bg = new ImageBackground(this.stageWidth, this.stageHeight);
        this.app.stage.addChildAt(this.bg, 0);
        this.app.stage.addChildAt(this.bgParticles, 1);
    }
    createBoxList() {
        this.boxList = new List(this._playList, this.stageWidth, this.stageHeight);
        this.boxList.animIn();
        this.app.stage.addChild(this.boxList);
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
    addMouseEvents = () => {
        this.grabbing = false;
        this.app.stage.on('mousedown', this.handleMouseDown);
        this.app.stage.on('mouseup', this.handleMouseUp);
        this.app.stage.on('mouseupoutside', this.handleMouseUp);
        this.app.stage.on('mousemove', this.handleMouseMove);
        this.app.stage.on('touchstart', this.handleMouseDown);
        this.app.stage.on('touchend', this.handleMouseUp);
        this.app.stage.on('touchendoutside', this.handleMouseUp);
        this.app.stage.on('touchmove', this.handleMouseMove);
        this.app.stage.on('keydown', this.handleKeyDown);
    }
    handleMouseMove = (e) => {
        if (!this.lastMousePos) this.lastMousePos = { x: e.data.global.x, y: e.data.global.y };
        let dx = this.lastMousePos.x - e.data.global.x;
        let dy = this.lastMousePos.y - e.data.global.y;
        if (dx > dy && this.grabbing) e.stopped = true;
        this.lastMousePos = { x: e.data.global.x, y: e.data.global.y };
        if (dx > 20) dx = 20;
        if (dx < -20) dx = -20;
        if (dy > 20) dy = 20;
        if (dy < -20) dy = -20;
        if (this.boxList && this.grabbing) this.boxList.addPushForce(-dx, dy);
        if (this.bgParticles && this.grabbing) this.bgParticles.pushParticles(dx, dy, this.grabbing);
    }

    handleMouseDown = (e) => {
        this.lastMousePos = { x: e.data.global.x, y: e.data.global.y };
        this.grabbing = true;
    }
    handleMouseUp = (e) => {
        this.grabbing = false;
    }
    startScene() {
        this.bg.addMainTexture(PIXI.loader.resources['bg-main'].texture);
        let pArray = [PIXI.loader.resources['bg-particle-01'].texture, PIXI.loader.resources['bg-particle-02'].texture];
        this.bgParticles.initParticles(pArray);
        // this.animIn();
        // this.animOut();
        // this.app.ticker.add((tick = 0) => {
        //     // this.bgParticles.update();
        //     // this.boxList.update();
        //     tick += 0.1;
        // });
    }

    loopFrame = () => {
        window.requestAnimationFrame(this.loopFrame);
        if (this.bgParticles) this.bgParticles.update();
        if (this.boxList) this.boxList.update();
    }
};
