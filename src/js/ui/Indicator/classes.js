
import helper from 'utils/helper';

export default theme => {
    var animationLine1 = helper.randomName();
    var animationLine2 = helper.randomName();
    var animationLine3 = helper.randomName();
    var animationLine4 = helper.randomName();

    return {
        container: {
            position: 'relative',
            width: 12,
            height: 12,
            display: 'inline-block',
            overflow: 'hidden',

            '& span': {
                position: 'absolute',
                background: 'rgb(92, 188, 125)',
                height: 12,
                left: 1,
                width: 2,
                borderRadius: '25%',
            },

            '& span:nth-child(1)': {
                left: 1,
                animationName: animationLine1,
                animationDuration: '2s',
                animationIterationCount: 'infinite',
            },

            '& span:nth-child(2)': {
                left: 4,
                animationName: animationLine2,
                animationDuration: '1.4s',
                animationIterationCount: 'infinite',
            },

            '& span:nth-child(3)': {
                left: 7,
                animationName: animationLine3,
                animationDuration: '1.8s',
                animationIterationCount: 'infinite',
            },

            '& span:nth-child(4)': {
                left: 10,
                animationName: animationLine4,
                animationDuration: '1s',
                animationIterationCount: 'infinite',
            }
        },

        [`@keyframes ${animationLine1}`]: {
            '0%': {
                transform: 'translateY(0) translateZ(0)',
            },

            '50%': {
                transform: 'translateY(10px) translateZ(0)',
            },

            '100%': {
                transform: 'translateY(0) translateZ(0)',
            },
        },

        [`@keyframes ${animationLine2}`]: {
            '0%': {
                transform: 'translateY(10px) translateZ(0)',
            },

            '50%': {
                transform: 'translateY(0) translateZ(0)',
            },

            '100%': {
                transform: 'translateY(10px) translateZ(0)',
            },
        },

        [`@keyframes ${animationLine3}`]: {
            '0%': {
                transform: 'translateY(10px) translateZ(0)',
            },

            '50%': {
                transform: 'translateY(0) translateZ(0)',
            },

            '100%': {
                transform: 'translateY(10px) translateZ(0)',
            },
        },

        [`@keyframes ${animationLine4}`]: {
            '0%': {
                transform: 'translateY(10px) translateZ(0)',
            },

            '50%': {
                transform: 'translateY(0) translateZ(0)',
            },

            '100%': {
                transform: 'translateY(10px) translateZ(0)',
            },
        },
    };
};
