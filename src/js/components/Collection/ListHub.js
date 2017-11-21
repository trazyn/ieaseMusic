import ImageBackground from './ui/ImageBackground';
import ParticleBackground from './ui/ParticleBackground';
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
        this.app = new PIXI.Application(rendererOptions);
        this.app.view.style['touch-action'] = 'pan-y';
        this.app.renderer.plugins.interaction.autoPreventDefault = false;
        document.body.appendChild(this.app.view);
        // const bg = PIXI.Sprite.fromImage(bgcolorful);
        window.addEventListener('mouseover', this.handleMouseover);
        this.createBackground();
        this.loadManifest();
    }
    createBackground() {
        this.bg = new ImageBackground(this.stageWidth, this.stageHeight);
        this.bgParticles = new ParticleBackground(80);
        this.app.stage.addChildAt(this.bg, 0);
        this.app.stage.addChildAt(this.bgParticles, 1);
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
        // console.log(PIXI.loader.resources['bg-main'].texture);
        this.bg.addMainTexture(PIXI.loader.resources['bg-main'].texture);
        let pArray = [PIXI.loader.resources['bg-particle-01'].texture, PIXI.loader.resources['bg-particle-02'].texture];
        this.bgParticles.initParticles(pArray);
        this.app.ticker.add((tick = 0) => {
            this.bgParticles.update();
            tick += 0.1;
        });
    }
};
