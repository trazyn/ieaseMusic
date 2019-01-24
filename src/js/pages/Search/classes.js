
import perdido from 'perdido';
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

        '& main': {
            margin: '0 32px',
        },

        '& input': {
            height: 32,
            lineHeight: '32px',
            width: '100%',
            marginTop: 60,
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
            height: 35,
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
                height: 8,
                background: 'transparent',
                transition: '.2s',
            },
        },

        '& nav span:hover:after': {
            background: colors.pallet.primary,
        }
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
        ...perdido.utils.clearFix,
        height: 'calc(100vh - 32px - 93px - 32px)',
        overflow: 'hidden',
        overflowY: 'auto',
    },

    artist: {
        ...perdido.column('1/2', { gutter: '20px' }),
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
        transform: 'translateY(12px)',

        '& a': {
            color: '#fff',
        },

        '& aside': {
            display: 'flex',
            width: '100%',
            marginLeft: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        '& p': {
            fontSize: 13,
            margin: 0,

            '& + span': {
                fontSize: 12,
                color: 'gray',
            }
        },

        '& i': {
            fontSize: 20,
            cursor: 'pointer',
            transition: '.2s',

            '&:hover, &$liked': {
                color: colors.pallet.grape,
                textShadow: `0 0 24px ${colors.pallet.grape}`,
            },
        },

        '& figure > img': {
            transition: '.2s',
        },

        '&:hover figure > img': {
            transform: 'scale(1.2)',
        }
    },

    user: {
        ...perdido.column('1/5', { gutter: '20px' }),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        transform: 'translateY(12px)',

        '& figure': {
            borderRadius: 64,
            transition: '.2s',
        },

        '&:hover figure': {
            boxShadow: '0 0 24px 0 #fff',
        },
    },

    username: {
        fontSize: 12,
        padding: '4px 8px',
        marginTop: 12,
        background: '#000',
        textAlign: 'center',
    },

    liked: {},

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
            fontSize: 12,
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
