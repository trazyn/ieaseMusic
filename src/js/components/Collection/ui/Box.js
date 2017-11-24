import BoxImage from '../ui/BoxImage';
import BoxLabel from './BoxLabel';
// import { TimelineMax, Strong } from 'gsap';
const PIXI = require('pixi.js');
export default class Box extends PIXI.Container {
    constructor(data, w, h, xv, yv, zv) {
        super();
        this.imageWidth = w;
        this.imageHeight = h;
        this._setupData = data;
        this.pureY = yv;
        this.y = yv;
        this.zval = zv;
        this.pureX = xv;
        this.init(xv);
    }
    init(xv) {
        this.setX(xv);
        this.boxImage = new BoxImage(this._setupData, this.imageWidth, this.imageHeight);
        this.boxLabel = new BoxLabel(this._setupData.name, this.imageWidth, this.imageHeight);
        this.boxImage.y = -Math.round((this.boxImage.getHeight()) * 0.5);
        this.interactive = true;
        this.buttonMode = true;
        this.addChild(this.boxImage);
        this.addChild(this.boxLabel);
        this.addEvents();
    }
    setX(xval, effectAmt) {
        // let inv = 1/this.zval;
        // effectAmt = window.EFFA || effectAmt;
        let inv = 1 / this.zval * effectAmt;
        this.x = xval * inv;
    }
    addForce(dx, sw, sh) {
        this.pureX += dx;
        let tgAspect = 1.7;
        let aspect = sw / sh;
        let effectAmt = aspect > tgAspect ? 1.15 : 1.2;
        this.setX(this.pureX, effectAmt);
    }
    getBoxPosition() {
        let pt = this.toGlobal(this.boxImage.position);
        pt.width = this.imageWidth;
        pt.height = this.imageHeight;
        return pt;
    }
    addEvents() {
        this.on('mouseover', this.handleOver);
        this.on('mouseout', this.handleOut);
        this.on('click', this.handleClickToAction);
    }
    handleOver() {
    }
    handleClickToAction() {
        let eve = new window.CustomEvent('pixiopenlink', {
            detail: {
                link: this._setupData.link
            }
        });
        window.dispatchEvent(eve);
    }
    // animIn(d = 0, cb = null, cbp = []) {
    //     // this.addEvents();
    //     // if (this.anim) this.anim.kill();
    //     this.anim = new TimelineMax({ onComplete: cb, onCompleteParams: cbp });
    //     // this.anim.add(this.boxImage.animIn(d), 0);
    //     return this.anim;
    // }
    // animOut(d = 0, cb = null, cbp = []) {
    //     // if (this.anim) this.anim.kill();
    //     this.anim = new TimelineMax({ delay: d, onComplete: cb, onCompleteParams: cbp });
    //     this.anim.to(this, 0.3, { x: '-30', ease: Strong.easeOut }, 0);
    //     return this.anim;
    // }
};
