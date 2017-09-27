
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'absolute',
        left: 16,
        top: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'calc(100vw - 32px)',
        height: 32,
        lineHeight: '32px',
        zIndex: 99,

        '& i': {
            display: 'inline-block',
            height: 32,
            width: 32,
            marginRight: 4,
            fontSize: 20,
            textAlign: 'center',
            cursor: 'pointer',

            '&:hover': {
                color: `${theme.header.iconHoverColor} !important`,
                textShadow: `0 0 24px ${colors.pallet.primary}`,
            },
        },

        '& i:last-child': {
            marginRight: 0,
        }
    },

    subscribed: {
        color: colors.pallet.sunflower,
    },

    follow: {
        position: 'relative',
        width: 80,
        height: 24,
        padding: 0,
        marginRight: 24,
        lineHeight: '24px',
        border: 'none',
        borderRadius: 24,
        backgroundImage: 'linear-gradient(280deg, rgb(47, 42, 41) 0%, rgb(47, 42, 41) 100%)',
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
        outline: 0,
        transform: 'translateY(-4px)',
        overflow: 'hidden',
        cursor: 'pointer',

        '&:before': {
            position: 'absolute',
            content: '""',
            top: 0,
            left: 0,
            display: 'block',
            height: '100%',
            width: '100%',
            backgroundImage: 'linear-gradient(225deg, rgb(255, 103, 0) 0%, rgb(255, 45, 240) 100%)',
            opacity: 0,
            zIndex: -1,
            transition: '.4s',
        },

        '&$followed:before, &:hover:before': {
            opacity: 1,
        }
    },

    followed: {},
});
