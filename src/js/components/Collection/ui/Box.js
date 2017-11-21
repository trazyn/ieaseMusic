import BoxImage from '../ui/BoxImage';
const PIXI = require('pixi.js');
export default class Box extends PIXI.Container {
    constructor(data, w, h, xv, yv, zv) {
        super();
        this.imageWidth = w;
        this.imageHeight = h;
        this.setupData = data;
        this.pureY = yv;
        this.y = yv;
        this.zval = zv;
        this.pureX = xv;
        this.init(xv);
    }
    init(xv) {
        // this.setX(xv);
        this.boxImage = new BoxImage(this.imageWidth, this.imageHeight);
        this.x = this.pureX;
        this.boxImage.y = -Math.round((this.boxImage.getHeight()) * 0.5);
        this.addChild(this.boxImage);
    }
    setX(xval, effectAmt) {
        // let inv = 1/this.zval;
        // effectAmt = window.EFFA || effectAmt;
        let inv = 1 / this.zval * effectAmt;
        this.x = xval * inv;
    }
    getBoxPosition() {
        let pt = this.toGlobal(this.boxImage.position);
        pt.width = this.imageWidth;
        pt.height = this.imageHeight;
        return pt;
    }
};
