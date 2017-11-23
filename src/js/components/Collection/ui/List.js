import { TimelineMax } from 'gsap';
import Box from './Box';
import ParticleStream from './ParticleStream';
const PIXI = require('pixi.js');
export default class List extends PIXI.Container {
    constructor(playlist, w, h) {
        super();
        this.AllBoxes = [];
        this.stageWidth = w;
        this.stageHeight = h;
        this._playList = playlist;
        this.init();
    }
    init() {
        this.particleStream = new ParticleStream(40, this.stageWidth, this.stageHeight);
        this.externalForces = { x: 0, y: 0 };
        this.driftForce = -0.5;
        this.createList();
    }
    createList() {
        this.BoxListLayer = new PIXI.Container();
        this.layoutData = [
            { dx: 100, dy: 90, dz: 0.78, w: 150, h: 150 },
            { dx: 200, dy: 260, dz: 0.89, w: 130, h: 130 }
        ];
        let lyLength = this.layoutData.length;
        let ldLength = this._playList.length;
        let xCount = this.layoutData[0].dx;
        for (let i = 0; i < ldLength; i++) {
            let n = i % lyLength;
            let data = this._playList[i];
            xCount += this.layoutData[n].dx;
            if (i > 0 && n === 0) xCount += 50;
            // console.log('x:=>', xCount, 'n:=>', n);
            let SingleBox = new Box(data, this.layoutData[n].w, this.layoutData[n].h, xCount, this.layoutData[n].dy, this.layoutData[n].dz);
            this.BoxListLayer.addChildAt(SingleBox, 0);
            this.AllBoxes.push(SingleBox);
        }
        this.addChild(this.BoxListLayer);
        this.addChildAt(this.particleStream, 0);
    }
    update() {
        let max = this.AllBoxes.length;
        let arr = [];
        for (let i = 0; i < max; i++) {
            this.AllBoxes[i].addForce(this.externalForces.x + this.driftForce, this.stageWidth);
            let pt = this.AllBoxes[i].getBoxPosition();
            let w = (pt.width * this.BoxListLayer.scale.x) / 1;
            let h = (pt.height * this.BoxListLayer.scale.y) / 1;
            let pt2 = { x: pt.x + w, y: pt.y };
            let pt3 = { x: pt.x + w, y: pt.y + h };
            let pt4 = { x: pt.x, y: pt.y + h };
            arr.push(pt);
            arr.push(pt2);
            arr.push(pt3);
            arr.push(pt4);
        }
        this.particleStream.update(arr);
        this.addDrag();
    }
    addDrag() {
        this.externalForces.x = this.externalForces.x * 0.95;
        this.externalForces.y = this.externalForces.y * 0.95;
        if (Math.abs(this.externalForces.x) < 0.5) this.externalForces.x = 0;
        if (Math.abs(this.externalForces.y) < 0.5) this.externalForces.y = 0;
    }
    addPushForce = (mx, my) => {
        if (Math.abs(mx * 2) > Math.abs(this.externalForces.x)) this.externalForces.x = mx * 2;
        if (Math.abs(my * 0.5) > Math.abs(this.externalForces.y)) this.externalForces.y = my * 0.5;
    }
    animIn = (d = 0, cb = null, cbp = []) => {
        // this.title.animIn();
        // let startSpot = HubMain.getCategorySpot();
        // console.log( startSpot + ' << IS THIS NEGATIVE?' )
        // console.log('yes');
        let anim = new TimelineMax({ delay: d, onComplete: cb, onCompleteParams: cbp });
        for (let i = 0; i < this.AllBoxes.length; i++) {
            // let p = Math.max(i, 0);
            // console.log(p);
            // anim.add(this.AllBoxes[i].animIn(d + p * 0.1), 0);
            return anim;
        }
    }
}
