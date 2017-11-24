
export default class Utils {
    static scaleTextureToCover(mc, sw, sh, repos = 'none') {
        let pw = mc.texture.width;
        let ph = mc.texture.height;

        let prat = pw / ph;
        let wrat = sw / sh;

        let sc = (prat <= wrat) ? sw / pw : sh / ph;

        mc.setTransform(0, 0, sc, sc);

        if (repos !== 'none') Utils.positionTo(mc, sw, sh, repos);
    }
    static positionTo(mc, sw, sh, pos) {
        let rect = { width: mc.width, height: mc.height };
        switch (pos) {
            case 'center':
                mc.x = Math.round((sw - rect.width) * 0.5);
                mc.y = Math.round((sh - rect.height) * 0.5);
                break;
            case 'bottom':
                mc.x = Math.round((sw - rect.width) * 0.5);
                mc.y = (sh - rect.height);
                break;
            case 'bottom-left':
                mc.x = 0;
                mc.y = (sh - rect.height);
                break;
            case 'bottom-right':
                mc.x = Math.ceil(sw - rect.width);
                mc.y = (sh - rect.height);
                break;
            default:
        }
    }
    static hypot() {
        let y = 0;
        let len = arguments.length;
        for (var i = 0; i < len; i++) {
            if (arguments[i] === Infinity || arguments[i] === -Infinity) {
                return Infinity;
            }
            y += arguments[i] * arguments[i];
        }
        return Math.sqrt(y);
    }
};
