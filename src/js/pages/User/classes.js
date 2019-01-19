
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, .3)',

        '& main': {
            paddingLeft: 40,
        }

    },

    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        background: 'rgba(0, 0, 0, .3)',
    },

    avatar: {
        position: 'absolute',
        left: 0,
        bottom: -200,
        visibility: 'hidden',
        opacity: 0,
        transition: '.5s ease-out',
        transitionDelay: '.8s',
        zIndex: -1,
    },

    expose: {
        visibility: 'visible',
        opacity: 1,
        transform: 'scale(1.1)',
    },

    hero: {
        position: 'relative',
        display: 'flex',
        height: 260,
        width: 460,
        marginTop: 100,
        background: colors.pallet.dribbble,
        textIndent: 40,
        fontWeight: 200,

        '& h3': {
            position: 'relative',
            padding: 0,
            margin: 0,
            maxWidth: 200,
            paddingTop: 30,
            color: 'yellow',
            fontWeight: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',

        },

        '& h3::before': {
            position: 'absolute',
            top: 14,
            left: 0,
            content: '"Name"',
            textTransform: 'uppercase',
            color: 'white',
            fontSize: 11,
            letterSpacing: 1,
        },

        '& p': {
            position: 'relative',
            padding: 0,
            margin: 0,
            marginTop: 20,
            fontSize: 24,
        },

        '& p::after': {
            content: 'attr(data-label)',
            marginLeft: 10,
            textTransform: 'uppercase',
            color: 'white',
            fontSize: 10,
            letterSpacing: 1,
        },
    },

    follow: {
        position: 'absolute',
        right: 100,
        top: 6,
        width: 80,
        padding: '5.5px 16px',
        border: 'none',
        borderRadius: 24,
        backgroundImage: 'linear-gradient(280deg, rgb(47, 42, 41) 0%, rgb(47, 42, 41) 100%)',
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
        outline: 0,
        transform: 'translateY(0)',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 1,

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

    signature: {
        marginTop: 14,
        fontSize: 14,
        transform: 'translate(0, 20px)',
        textIndent: 0,
        paddingLeft: 40,

        '& span': {
            display: '-webkit-box',
            maxWidth: 150,
            lineHeight: '20px',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',

        }
    },

    list: {
        position: 'absolute',
        right: 0,
        top: 100,
        width: 280,
        paddingLeft: 0,
        height: 'calc(100vh - 150px)',
        overflow: 'hidden',
        overflowY: 'auto',

        '&::before': {
            content: '"Playlist"',
            position: 'fixed',
            top: 84,
            textTransform: 'uppercase',
            fontWeight: 200,
            letterSpacing: 1,
            background: 'black',
        },
    },

    item: {
        position: 'relative',
        display: 'block',
        padding: 0,
        margin: 0,
        fontFamily: 'Roboto',
        fontWeight: 'lighter',
        color: 'white',
        overflow: 'hidden',
        transition: 'transform .1s',
        transform: 'scale(.8) translateX(-36px)',

        '& h2': {
            position: 'relative',
            display: 'inline-block',
            fontWeight: 200,
        },

        '& h2 span': {
            display: 'block',
            maxWidth: 280,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },

        '& h2::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: '-50%',
            height: '100%',
            width: 0,
            background: 'yellow',
            zIndex: 1,
            opacity: 0,
            visibility: 'hidden',
            transitionDelay: '.2s',
            transition: '.2s ease-out',
        },

        '& p': {
            marginTop: -8,
        },

        '&:hover, &$playing': {
            transform: 'scale(1) translateX(0)',
        },

        '&:hover h2::after, &$playing h2::after': {
            width: '100%',
            opacity: .7,
            visibility: 'visible',
        },
    },

    playing: {
        '& h2::after': {
            background: colors.pallet.dribbble,
        },
    },
});
