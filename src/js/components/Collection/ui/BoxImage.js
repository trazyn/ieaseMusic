import Utils from '../Utils';
import TestImg from '../../../../assets/ui/test.jpg';
const PIXI = require('pixi.js');

export default class BoxImage extends PIXI.Container {
    constructor(imgSRC, w = 150, h = 150) {
        super();
        this.imageWidth = w;
        this.imageHeight = h;
        this.init();
        console.log('w:' + w, 'h:' + h);
        console.log('test' + this.imageWidth);
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
        this.ldr.add('test-image', TestImg);
        this.ldr.on('progress', this.handleImageLoadProgress);
        this.ldr.once('complete', this.handleImageLoadComplete.bind(this));
        this.ldr.load();
        this.addChild(this.thumbHolder);
    }
    handleImageLoadComplete() {
        let img = this.ldr.resources['test-image'].texture;
        this.thumb = new PIXI.Sprite(img);
        Utils.scaleTextureToCover(this.thumb, this.imageWidth, this.imageHeight, 'center');
        this.thumb.x = this.imageWidth * 0.5;
        this.thumb.y = this.imageHeight * 0.5;
        this.addChild(this.thumbHolder);
        this.thumbHolder.addChild(this.thumb);
    }
    getHeight() {
        return this.imageHeight;
    }
};
