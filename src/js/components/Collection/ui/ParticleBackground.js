import { TweenLite } from 'gsap';
const PIXI = require('pixi.js');

export default class ParticleBackground extends PIXI.Container {
    constructor(maxp = 80, noBlendCanvasMode = false, stageWidth = window.innerWidth, stageHeight = window.innerHeight) {
        super();
        this.noBlendCanvasMode = noBlendCanvasMode;
        this.maxParticles = maxp;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.init();
    }
    init() {
        this.externalForces = { x: 0, y: 0 };
        this.particleBounds = new PIXI.Rectangle();
        this.alpha = 0;
        console.log(1);
    }
    initParticles(arr) {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            let n = Math.floor(Math.random() * arr.length);
            let p = new PIXI.Sprite(arr[n]);
            p.xPer = Math.random();
            p.yPer = Math.random();
            p.position.set(this.stageWidth * p.xPer, this.stageHeight * p.yPer);
            p.scale.set(0.1 + (Math.random() * 0.96));
            p.anchor.set(0.5);
            p.baseAlpha = 0.1 + Math.random() * 0.65;
            p.alpha = p.baseAlpha;
            p.blendMode = PIXI.BLEND_MODES.SCREEN;
            p.direction = Math.random() * Math.PI * 2;
            p.turningSpeed = Math.random() - 0.8;
            p.speed = (2 + Math.random() * 2) * 0.1;
            p.offset = Math.random() * 100;

            // p.visible = !(this.dontUpdate);
            this.addChild(p);
            this.particles.push(p);
        }

        // feeed in array of particles image assets
        // generate up to maxP
        TweenLite.to(this, 1, { alpha: 1 });
    }
    update() {
        if (this.particles) {
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                p.direction += p.turningSpeed * 0.01;
                p.position.x += Math.sin(p.direction) * (p.speed * p.scale.y) + (this.externalForces.x * p.scale.y);
                p.position.y += Math.cos(p.direction) * (p.speed * p.scale.y) + (this.externalForces.y * p.scale.y);

                p.rotation = -p.direction + Math.PI;

                let pb = this.particleBounds;

                if (p.position.x < pb.x) {
                    p.position.x += pb.width;
                } else if (p.position.x > pb.x + pb.width) {
                    p.position.x -= pb.width;
                }
                if (p.position.y < pb.y) {
                    p.position.y += pb.height;
                } else if (p.position.y > pb.y + pb.height) {
                    p.position.y -= pb.height;
                }
            }
            this.addDrag();
        }
    }
    addDrag() {
        this.externalForces.x = this.externalForces.x * 0.95;
        this.externalForces.y = this.externalForces.y * 0.95;
        if (Math.abs(this.externalForces.x) < 0.5) this.externalForces.x = 0;
        if (Math.abs(this.externalForces.y) < 0.5) this.externalForces.y = 0;
    }

    pushParticles(mx, my, ff = false) {
        if (Math.abs(mx * 2) > Math.abs(this.externalForces.x)) this.externalForces.x = mx * 2;
        if (Math.abs(my * 0.5) > Math.abs(this.externalForces.y)) this.externalForces.y = my * 0.5;
    }

    reflectForces(mu = 1) {
        this.externalForces.x = -this.externalForces.x * mu;
    }

    cullHalf() {
        if (this.particles) {
            for (let i = 0; i < this.particles.length; i++) {
                if (i % 2 === 0) this.particles[i].visible = (this.smallMode) ? Boolean(false) : Boolean(true);
            }
        }
    }
};
