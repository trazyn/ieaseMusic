
import colors from 'utils/colors';
import helper from 'utils/helper';

export default theme => {
    var animationName = helper.randomName();

    return {
        modal: {},

        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -40,

            '& h2': {
                fontFamily: 'HelveticaNeue-UltraLight',
                fontSize: 24,
                letterSpacing: 2,
            },

            '& p': {
                paddingBottom: 1,
                maxWidth: 400,
                marginTop: 0,
                marginBottom: 32,
                fontSize: 16,
                color: '#ddd',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            },

            '& button': {
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, .7)',
                textTransform: 'uppercase',
                fontSize: 14,
                border: 0,
                color: '#333',
                cursor: 'pointer',
            },
        },

        circle: {
            position: 'relative',
            overflow: 'hidden',

            '&:hover $mask': {
                opacity: .2,
            },

            '&:hover $play': {
                opacity: 1,
                transform: 'scale(1)',
            }
        },

        mask: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            borderRadius: '100%',
            background: '#000',
            opacity: 0,
            transition: 'opacity .5s',
            zIndex: 9,
        },

        cover: {
            height: 140,
            width: 140,
            borderRadius: 140,
            overflow: 'hidden'
        },

        play: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 40,
            height: 40,
            lineHeight: '40px',
            borderRadius: 40,
            marginLeft: -20,
            marginTop: -20,
            background: '#fff',
            color: '#000',
            opacity: 0,
            transform: 'scale(.75)',
            transition: '.5s',
            textAlign: 'center',
            zIndex: 9,
            cursor: 'pointer',
        },

        svg: {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'rotate(-90deg)',
        },

        outter: {
            fill: 'transparent',
            stroke: colors.pallet.twitter,
            strokeWidth: 4,
            // 2 * Math.PI * R
            strokeDasharray: 427,
            strokeDashoffset: 0,

            animationName,
            animationDuration: '8s',
            animationIterationCount: 1,
            animationTimingFunction: 'linear',
        },

        [`@keyframes ${animationName}`]: {
            '0%': {
                strokeDashoffset: 427,
            },

            '100%': {
                strokeDashoffset: 0,
            },
        },
    };
};
