
import colors from 'utils/colors';
import helper from 'utils/helper';

export default theme => {
    var animationName = helper.randomName();

    return {
        container: {
            position: 'relative',
            height: '100vh',
            width: '100vw',

            '& summary': {
                position: 'relative',
                padding: '24px',
                paddingTop: 64,
                fontSize: 24,
                zIndex: 9,
            },

            '& main': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                overflow: 'hidden'
            },
        },

        liked: {
            color: colors.pallet.grape,
            textShadow: `0 0 24px ${colors.pallet.grape}`,
        },

        highquality: {
            display: 'table',
            padding: '6px 12px',
            marginTop: 24,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: 'Roboto',
            fontSize: 12,
            color: '#fff',
            background: colors.pallet.dribbble,
            boxShadow: `0 0 24px ${colors.pallet.dribbble}`,
            zoom: .8,
        },

        circle: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 260,
            height: 260,
            marginLeft: -130,
            marginTop: -130,
            borderRadius: 260,
            overflow: 'hidden',
            boxShadow: '0 0 24px 0 rgba(0, 0, 0, .4)',
            zIndex: 9,

            '& figure': {
                animationName,
                animationDuration: `${360 * .2}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
            }
        },

        pause: {
            animationPlayState: 'paused',
        },

        [`@keyframes ${animationName}`]: {
            '0%': {
                transform: 'rotate(0deg)',
            },

            '100%': {
                transform: 'rotate(360deg)',
            },
        },
    };
};
