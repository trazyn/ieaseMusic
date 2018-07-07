
import helper from 'utils/helper';
import colors from 'utils/colors';

export default theme => {
    var animationLoader = helper.randomName();
    var animationInner = helper.randomName();

    return {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, .4)',
            opacity: 0,
            visibility: 'hidden',
            transition: '.2s',
        },

        show: {
            opacity: 1,
            visibility: 'visible',
            zIndex: 1000,
        },

        loader: {
            position: 'absolute',
            top: '54%',
            left: '50%',
            height: 30,
            width: 30,
            marginLeft: -19,
            marginTop: -19,
            border: '4px solid #000',
            animationName: animationLoader,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease',
        },

        inner: {
            verticalAlign: 'top',
            display: 'inline-block',
            width: '100%',
            backgroundColor: colors.randomColor(),
            animation: `${animationInner} 2s infinite ease-in;`,
        },

        [`@keyframes ${animationLoader}`]: {
            '0%': {
                transform: 'rotate(0deg) translateZ(0)',
            },

            '25%': {
                transform: 'rotate(180deg) translateZ(0)',
            },

            '50%': {
                transform: 'rotate(180deg) translateZ(0)',
            },

            '75%': {
                transform: 'rotate(360deg) translateZ(0)',
            },

            '100%': {
                transform: 'rotate(360deg) translateZ(0)',
            },
        },

        [`@keyframes ${animationInner}`]: {
            '0%': {
                height: '0%',
                transform: 'translateZ(0)',
            },

            '25%': {
                height: '0%',
                transform: 'translateZ(0)',
            },

            '50%': {
                height: '100%',
                transform: 'translateZ(0)',
            },

            '75%': {
                height: '100%',
                transform: 'translateZ(0)',
            },

            '100%': {
                height: '0%',
                transform: 'translateZ(0)',
            },
        },
    };
};
