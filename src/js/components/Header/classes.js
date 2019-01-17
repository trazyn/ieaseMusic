
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 99,

        '& section': {
            position: 'relative',
            background: 'rgba(0, 0, 0, .6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 38,
            padding: '0 16px',
            width: 'calc(100vw - 32px)',
            zIndex: 1,
        },

        '& i': {
            display: 'inline-block',
            width: 32,
            marginRight: 4,
            fontSize: 20,
            color: '#eee',
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

    transparent: {
        background: 'transparent !important',
    },

    backward: {
        height: 12,
        width: 12,
        borderRadius: 12,
        border: 'thin solid #ddd',
        marginLeft: 58,
        background: '#eee',
        boxSizing: 'border-box',
    },

    subscribed: {
        color: `${colors.pallet.sunflower} !important`
    },
});
