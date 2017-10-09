
import helper from 'utils/helper';

export default theme => {
    var animationName = helper.randomName();

    return {
        container: {
            position: 'fixed',
            right: '50%',
            top: '50%',
            width: 64,
            height: 64,
            lineHeight: '64px',
            borderRadius: 64,
            marginRight: -32,
            marginTop: -32,
            color: '#fff',
            fontSize: 24,
            textAlign: 'center',
            background: '#000',
            boxShadow: '0 30px 80px 0 rgba(97, 45, 45, .25)',
            zIndex: 999,
            opacity: 0,
            visibility: 'hidden',
        },

        animated: {
            animationName,
            animationDuration: '800ms',
            animationIterationCount: 1,
        },

        [`@keyframes ${animationName}`]: {
            '0%': {
                opacity: 0,
                transform: 'scale(.8)',
                visibility: 'hidden',
            },

            '40%': {
                opacity: 1,
                transform: 'scale(1)',
                visibility: 'visible',
            },

            '100%': {
                opacity: 0,
                transform: 'scale(1.2)',
                visibility: 'hidden',
            },
        },
    };
};
