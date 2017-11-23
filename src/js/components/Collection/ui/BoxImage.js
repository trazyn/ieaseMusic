import Utils from '../Utils';
// import TestImg from '../../../../assets/ui/test.jpg';
import { TimelineMax, Strong } from 'gsap';
const PIXI = require('pixi.js');

export default class BoxImage extends PIXI.Container {
    constructor(data, w = 150, h = 150) {
        super();
        this._data = data;
        this.imageWidth = w;
        this.imageHeight = h;
        this.init();
    }
    init() {
        this.thumbHolder = new PIXI.Container();
        this.msk = new PIXI.Graphics();
        this.msk.beginFill(0xff0000);
        this.msk.drawRect(0, 0, this.imageWidth, this.imageHeight);
        this.msk.cacheAsBitmap = true;
        this.msk.scale.x = 0;
        // this.thumbHolder.addChild(this.msk);
        this.loadImage();
    }
    loadImage() {
        this.ldr = new PIXI.loaders.Loader();
        this.ldr.add(`ablum-cover-${this._data.id}`, this._data.cover);
        this.ldr.on('progress', this.handleImageLoadProgress);
        this.ldr.once('complete', this.handleImageLoadComplete.bind(this));
        this.ldr.load();
        this.addChild(this.thumbHolder);
    }
    handleImageLoadComplete() {
        let img = this.ldr.resources[`ablum-cover-${this._data.id}`].texture;
        this.thumb = new PIXI.Sprite(img);
        Utils.scaleTextureToCover(this.thumb, this.imageWidth, this.imageHeight, 'center');
        this.thumbHolder.alpha = 1;
        this.thumbHolder.x = this.imageWidth * 0.5;
        this.thumbHolder.y = this.imageHeight * 0.5;
        this.addChild(this.thumbHolder);
        this.thumbHolder.addChild(this.thumb);
    }
    getHeight() {
        return this.imageHeight;
    }
    checkDoAnimIn = (d = 0) => {
        let anim = new TimelineMax({ delay: d });
        anim.to(this.thumbHolder, 2, { alpha: 1, ease: Strong.easeOut }, 0);
        anim.to(this.thumbHolder.scale, 2, { x: 1, y: 1, ease: Strong.easeOut }, 0);
        anim.to(this.msk.scale, 1, { x: 1, ease: Strong.easeIn }, 0);
        return anim;
    }

    animIn = (d = 0) => {
        this.animInRequested = true;
        this.animDelay = d;
        let anim = this.checkDoAnimIn(d);
        return anim;
    }
};
