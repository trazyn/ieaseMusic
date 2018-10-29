
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '40vw',
        height: '100vh',
        overflow: 'hidden',

        '& aside': {
            padding: '24px',
            paddingTop: 60,
            fontSize: 24,
        },

        '& summary': {
            flexDirection: 'column',
            position: 'relative',
            padding: '24px',
            paddingTop: 64,
            fontSize: 24,
            zIndex: 9,
        },

        '& nav': {
            position: 'absolute',
            top: '45vh',
            left: 0,
        },

        '& nav i': {
            color: '#fff',
            fontSize: 20,
            width: 32,
            textAlign: 'center',
            cursor: 'pointer',
        },

        '& footer': {
            position: 'relative',
            padding: '12px 24px',
        },

        '& article': {
            padding: 0,
            margin: 0,
        },

        '& figure': {
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -1,

            '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, .3)'
            }
        },

        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            display: 'block',
            width: '100%',
            height: '20vh',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(216, 216, 216, .9))',
        },

        '& nav article': {
            color: '#fff',
        },

        '& nav a': {
            display: 'inline-block',
            padding: '12px 24px',
            fontSize: 12,
            color: '#fff',
            background: '#000',
            textTransform: 'uppercase',
            transition: '.2s',
            cursor: 'pointer',
        },

        '& nav a:hover': {
            color: colors.pallet.dribbble,
        },
    },

    share: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 38,
        width: 38,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        transition: '.2s',
        zIndex: 99,

        '&:hover': {
            backgroundColor: 'black',
            color: colors.pallet.dribbble,
        }
    },

    author: {
        marginTop: 2,
        fontSize: 11,
        maxWidth: 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        '& a': {
            display: 'inline-block',
            paddingBottom: 2,
            borderBottom: 'thin solid rgba(255, 255, 255, 0)',
            color: '#4a4a4a',
            transition: '.2s',

            '&:after': {
                content: '"/"',
                display: 'inline-block',
                margin: '0 5px',
            },

            '&:hover': {
                borderBottomColor: '#000',
            },
        },

        '& a:last-child:after': {
            content: 'none',
        }
    },

    liked: {
        color: colors.pallet.grape,
        textShadow: `0 0 24px ${colors.pallet.grape}`,
    },

    badge: {
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
});
