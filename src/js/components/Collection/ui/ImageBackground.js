import { TweenLite } from 'gsap';
import Utils from '../Utils';
const PIXI = require('pixi.js');

export default class ImageBackground extends PIXI.Container {
    constructor(stageWidth = window.innerWidth, stageHeight = window.innerHeight) {
        super();
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
    }
    addMainTexture(img) {
        this.mainTexture = new PIXI.Sprite(img);
        this.mainTexture.alpha = 0;
        Utils.scaleTextureToCover(this.mainTexture, this.stageWidth, this.stageHeight, 'center');
        this.addChild(this.mainTexture);
        TweenLite.to(this.mainTexture, 1, { alpha: 1 });
    };
};
