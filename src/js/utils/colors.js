
const pallet = {
    primary: '#6496f0',
    sunflower: '#ffce54',
    grape: '#e0245e',
    coral: '#ff6470',
    mint: '#48cfad',
    dribbble: '#ea4c89',
    twitter: '#55acee',
    google: '#5090fb',
};

const gradients = [
    'linear-gradient(to right, #0099f7, #f11712)',
    'linear-gradient(to bottom, #834d9b, #d04ed6)',
    'linear-gradient(to left, #4da0b0, #d39d38)',
    'linear-gradient(to left, #5614b0, #dbd65c)',
    'linear-gradient(to right, #114357, #f29492)',
    'linear-gradient(to right, #fd746c, #ff9068)',
    'linear-gradient(to left, #6a3093, #a044ff)',
    'linear-gradient(to left, #b24592, #f15f79)',
    'linear-gradient(to top, #403a3e, #be5869)',
    'linear-gradient(to right, #c2e59c, #64b3f4)',
    'linear-gradient(to right, #00c9ff, #92fe9d)',
    'linear-gradient(to right, #e53935, #e35d5b)',
    'linear-gradient(to right, #fc00ff, #00dbde)',
    'linear-gradient(to right, #7b4397, #dc2430)',
];

export default {
    pallet,

    randomGradient() {
        return gradients[Math.floor(Math.random() * gradients.length)];
    },

    randomColor() {
        var colors = [];

        Object.keys(pallet).map(
            e => colors.push(pallet[e])
        );

        gradients.map(
            e => {
                var matched = e.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);

                if (matched) {
                    colors = [
                        ...matched,
                        ...colors,
                    ];
                }
            }
        );

        return colors[Math.floor(Math.random() * colors.length)];
    }
};
