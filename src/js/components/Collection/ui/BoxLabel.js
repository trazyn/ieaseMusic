const PIXI = require('pixi.js');

export default class BoxLabel extends PIXI.Container {
    constructor(label = '', width = '150', height = '150') {
        super();
        this.label = label;
        this.labelWidth = width;
        this.labelHight = height;
        this.init();
    }
    init() {
        this.render();
    }
    render() {
        this.renderLabel = new PIXI.Text(this.label,
            {
                fontFamily: 'PingFang SC, Lantinghei SC',
                fill: 0xffffff,
                fontSize: 12.5,
                align: 'left',
                leading: 2,
                wordWrap: true,
                // cacheAsBitmap: true,
                breakWords: true,
                wordWrapWidth: this.labelWidth - 20, // for better performance
                height: this.labelHight / 4,
                width: this.labelWidth
            });

        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, this.labelWidth, this.labelHight / 3);
        this.bg.alpha = 0.6;
        this.bg.y = (this.labelHight - this.labelHight / 3) / 4;
        this.renderLabel.y = (this.labelHight - this.labelHight / 4) / 4;
        this.renderLabel.x = 8;
        this.addChild(this.renderLabel);
        this.addChildAt(this.bg, 0);
    }
}
