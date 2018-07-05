
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
    },

    navs: {
        paddingLeft: 50,
        paddingTop: 80,
        fontWeight: '300',
        color: 'white',

        '& a': {
            color: 'inherit !important',
        },

        '& nav a:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 20,
            width: 0,
            background: colors.pallet.dribbble,
            transform: 'translateY(10px)',
            opacity: 0,
            transition: '.2s ease-out',
            zIndex: -1,
        },

        '& nav a:hover:after, & nav $playing:after': {
            opacity: 1,
            width: '110%',
        },

        '& nav p': {
            margin: 0,
            marginBottom: 24,
        },
    },

    playing: {},

    profile: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',

        '& img': {
            height: 64,
            width: 64,
            borderRadius: 64,
            marginRight: 20,
        },
    },

    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'HelveticaNeue',
        fontWeight: 'lighter',
        transform: 'translateY(-3px)',

        '& p': {
            display: 'inline-block',
            padding: 0,
            margin: 0,
            fontSize: 24,
            letterSpacing: 1,
            textIndent: 0,
            maxWidth: 200,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },

        '& span': {
            fontSize: 14,
            letterSpacing: 2,
            color: '#eee',
        },
    },

    menu: {
        marginTop: 100,

        '& a': {
            position: 'relative',
            fontSize: 20,
            textIndent: 4,
            letterSpacing: 2,
            cursor: 'pointer',
        }
    },

    placeholder: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 360,
        height: '100vh',
        backgroundImage: 'linear-gradient(110deg, rgb(255, 103, 0) 0%, rgb(255, 45, 240) 100%)',
    },

    list: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 360,
        paddingLeft: 16,
        height: 'calc(100vh - 50px)',
        overflow: 'hidden',
        overflowY: 'auto',
    },

    item: {
        position: 'relative',
        height: 120,
        padding: 0,
        margin: 0,
        backgroundImage: 'linear-gradient(110deg, rgb(255, 103, 0) 0%, rgb(255, 45, 240) 100%)',
        fontFamily: 'Roboto',
        fontWeight: 'lighter',
        color: 'white',
        overflow: 'hidden',

        '& figcaption': {
            position: 'absolute',
            top: '50%',
            left: 100,
            marginTop: -25,
            display: 'flex',
            flexDirection: 'row',
            zIndex: 2,
        },

        '& summary': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '7px 0',
            paddingLeft: 20,
        },

        '& summary p': {
            margin: 0,
            fontSize: 14,
            maxWidth: 180,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },

        '& summary small': {
            fontSize: 12,
            color: '#eee',
        },

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            background: 'rgba(255, 255, 255, .5)',
            zIndex: 1
        },
    },

    background: {
        transition: '.2s',
        transform: 'translateY(-50%) scale(1)',
    },

    album: {
        transform: 'translateY(-8px)',
    },

    cover: {
        boxShadow: `0 0 24px ${colors.randomColor()}`,
    },

    favorite: {
        '&::after': {
            background: 'rgba(0, 0, 0, .3)',
        },
    },

    recommend: {
        '&::after': {
            content: 'none',
        },
    },

    large: {
        height: 160,

        '& summary p': {
            color: '#000'
        },

        '& summary small': {
            color: '#333'
        },
    },

    clearfix: {
        position: 'relative',
        display: 'block',

        '&:hover $hovered': {
            opacity: 1,
            transform: 'scale(1)',
        },

        '&:hover [class^=Component-status-]': {
            opacity: 0,
            transform: 'scale(.8)',
        },

        '&:hover $background': {
            transform: 'translateY(-50%) scale(1.1)',
        },

        '&:hover $album$background': {
            transform: 'translateY(-8px) scale(1.1)',
        },
    },

    status: {
        position: 'absolute',
        top: '50%',
        left: -16,
        marginTop: -16,
        display: 'flex',
        height: 32,
        width: 32,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        zIndex: 2,
        transition: '.2s',
    },

    hovered: {
        position: 'absolute',
        top: '50%',
        left: -16,
        marginTop: -16,
        display: 'flex',
        height: 32,
        width: 32,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(92, 188, 125)',
        color: 'white',
        zIndex: 3,
        opacity: 0,
        transform: 'scale(.8)',
        transition: '.5s',
    },
});
