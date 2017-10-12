
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, .7)',
        zIndex: 99,

        '& input': {
            height: 32,
            lineHeight: '32px',
            width: '100%',
            marginTop: 40,
            marginBottom: 30,
            border: 0,
            fontSize: 32,
            color: '#fff',
            fontWeight: 'lighter',
            background: 'none',
            letterSpacing: 1,
            outline: 0,

            '&::placeholder': {
                color: '#fff',
            },
        },

        '& nav': {
            height: 32,
            borderBottom: '1px solid #fff',
            fontSize: 14,
            fontFamily: 'Roboto',
            fontWeight: 'lighter',
            letterSpacing: .5,
            color: '#fff',
        },

        '& nav span': {
            display: 'inline-block',
            position: 'relative',
            padding: '8px 12px',
            cursor: 'pointer',

            '&:after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -1,
                width: '100%',
                height: 3,
                background: 'transparent',
                transition: '.2s',
            },
        },

        '& nav span:hover:after': {
            background: colors.pallet.primary,
        }
    },

    inner: {
        margin: '0 32px',
    },

    selected: {
        '&:after': {
            background: `${colors.pallet.mint} !important`,
        },
    },

    placeholder: {
        paddingTop: '20vh',
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 32,
        letterSpacing: 1,
        wordSpacing: 3,
        textAlign: 'center',
        color: '#fff',
    },

    list: {
        height: 'calc(100vh - 32px - 70px - 32px)',
        overflow: 'hidden',
        overflowY: 'auto',
    },

    row: {
        display: 'flex',
        margin: '10px 0',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        cursor: 'pointer',
        transition: '.2s',

        '& aside': {
            display: 'flex',
            width: '100%',
            marginLeft: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'uppercase',

            '& i': {
                color: colors.pallet.sunflower,
                paddingLeft: '2px',
            },

            '& > span:nth-child(1)': {
                width: 300,
            },

            '& > div': {
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
            },
        },

        '&:hover': {
            color: colors.pallet.primary,
        },

        '& $played, & $tracks': {
            padding: '4px 8px',
            background: '#000',
        },
    },

    star: {
        transform: 'translateY(4px)',
    },
    played: {},
    tracks: {},
});
