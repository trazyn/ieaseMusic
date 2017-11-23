import Utils from '../Utils';
import { TweenLite } from 'gsap';
const PIXI = require('pixi.js');
export default class ParticleStream extends PIXI.Graphics {
    constructor(maxp = 30, w, h) {
        super();
        this.stageWidth = w;
        this.stageHeight = h;
        this.maxParticles = maxp;
        this.init();
    }
    init() {
        this.alphaMult = 1;
        this.threshold = 65;
        this.particles = [];

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles[i] = {};
            this.particles[i].x = -Math.random() * this.stageWidth;
            this.particles[i].baseY = Math.random() * this.stageHeight;
            this.particles[i].y = this.particles[i].baseY;
            this.particles[i].spd = Math.round(0.5 + Math.random() * 4);
            this.particles[i].mag = 10 + Math.random() * 20;
            this.particles[i].fx = Math.floor(Math.random() * 2);
            this.particles[i].intr = Math.round(Math.random() * 50) + 50;
        }
    }

    update(arr) {
        this.clear();
        for (let i = 0; i < this.maxParticles; i++) {
            let p = this.particles[i];
            p.x += p.spd;
            let dy = (p.fx === 0) ? Math.sin(p.x / p.intr) * p.mag : Math.cos(p.x / p.intr) * p.mag;
            p.y = p.baseY + dy;

            if (p.x > this.stageWidth + 100) {
                p.x = -100;
            }
            for (let k = 0; k < arr.length; k++) {
                let dist = Utils.hypot(p.x - arr[k].x, p.y - arr[k].y);
                let bt = this.threshold * 3;
                if (dist < bt) {
                    let alf = (1 - dist / bt) * 0.2 * this.alphaMult;
                    this.lineStyle(1, 0xffffff, alf);
                    this.moveTo(p.x, p.y);
                    this.lineTo(arr[k].x, arr[k].y);
                }
            }

            for (let j = (i + 1); j < this.maxParticles; j++) {
                let p2 = this.particles[j];
                if (p.x > 0 || p2.x > 0) {
                    let dist = Utils.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < this.threshold) {
                        let alf = (1 - dist / this.threshold) * 0.2 * this.alphaMult;
                        this.lineStyle(1, 0xffffff, alf);
                        this.moveTo(p.x, p.y);
                        this.lineTo(p2.x, p2.y);
                    }
                }
            }
            this.beginFill(0xffffff, 0.2 * this.alphaMult);
            this.drawCircle(p.x, p.y, 1);
            this.endFill();
        }
    }

    animOut() {
        return TweenLite.to(this, 0.4, { alphaMult: 0 });
    }
}
