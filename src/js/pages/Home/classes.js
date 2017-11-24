
// import colors from 'utils/colors';

export default theme => ({
    container: {
        width: '100vw',
        height: '100vh',
        // background: colors.randomGradient(),

        '& main': {
            background: 'linear-gradient(to top, transparent, rgba(255, 255, 255, 1))',
            height: '100vh',
        },

        '@global .scroll-horizontal': {
            width: 'calc(100% - 32px) !important',
            overflow: 'initial !important',
        }
    },

    svg: {
        width: '100%',
        height: 200,
    },

    welcome: {
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 54,
        fontWeight: 'lighter',
        fill: 'url(#mask)',
        letterSpacing: 4.5,
        textShadow: `
            1px 1px 0 rgba(227, 218, 219, 1),
            3px 3px 0 rgba(227, 218, 219, 0.9),
            5px 5px 0 rgba(227, 218, 219, 0.8),
            7px 7px 0 rgba(227, 218, 219, 0.7),
            9px 9px 0 rgba(227, 218, 219, 0.6),
            11px 11px 0 rgba(227, 218, 219, 0.5),
            13px 13px 0 rgba(227, 218, 219, 0.4),
            15px 15px 0 rgba(227, 218, 219, 0.3),
            17px 17px 0 rgba(227, 218, 219, 0.2),
            19px 19px 0 rgba(227, 218, 219, 0.1),
            21px 21px 0 rgba(227, 218, 219, 0.08),
            22px 22px 0 rgba(227, 218, 219, 0.07)
        `
    },

    description: {
        fontFamily: 'HelveticaNeue-UltraLight',
        fontWeight: 'lighter',
        fontSize: 14,
        fill: 'url(#mask)',
        letterSpacing: 1,
        wordSpacing: 3,
        textShadow: `
            1px 1px 0 rgba(227, 218, 219, 1),
            3px 3px 0 rgba(227, 218, 219, 0.9),
            5px 5px 0 rgba(227, 218, 219, 0.8),
            7px 7px 0 rgba(227, 218, 219, 0.7),
            9px 9px 0 rgba(227, 218, 219, 0.6),
            11px 11px 0 rgba(227, 218, 219, 0.5),
            13px 13px 0 rgba(227, 218, 219, 0.4),
            15px 15px 0 rgba(227, 218, 219, 0.3),
            17px 17px 0 rgba(227, 218, 219, 0.2),
            19px 19px 0 rgba(227, 218, 219, 0.1),
            21px 21px 0 rgba(227, 218, 219, 0.08),
            22px 22px 0 rgba(227, 218, 219, 0.07)
        `
    },

    item: {
        position: 'relative',
        display: 'inline-block',
        minWidth: 130,
        textAlign: 'right',
        cursor: 'pointer',

        '& img': {
            width: 100,
            height: 100,
            borderRadius: 100,
            pointerEvents: 'none',
            transition: '.4s',
        },

        '& $playing, &:hover': {
            '& img': {
                boxShadow: '0 20px 30px 4px rgba(97, 45, 45, .5)',
                transform: 'translateY(-24px)'
            },

            '& $info': {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(-8px)',
            },

            '& $mask': {
                transform: 'translateY(-24px)',
            },

            '& $mask:before, & $mask:after': {
                opacity: 1,
            }
        },
    },

    playing: {},

    liked: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 200,
        height: 100,
        color: '#fff',
        transform: 'translateX(30px)',

        '&$playing': {
            '& $cover': {
                boxShadow: '0 20px 30px 4px rgba(97, 45, 45, .5)',
            },

            '& $cover:before': {
                opacity: 1,
            }
        },
    },

    mask: {
        position: 'relative',
        float: 'right',
        height: 100,
        width: 100,
        color: '#fff',
        lineHeight: '100px',
        textAlign: 'center',
        fontSize: 32,
        borderRadius: 100,
        backgroundImage: 'linear-gradient(225deg, rgb(255, 103, 0) 0%, rgb(255, 45, 240) 100%)',
        overflow: 'hidden',
        zIndex: 1,
        transition: '.4s',

        '& img': {
            opacity: 0,
        },
    },

    cover: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundImage: 'linear-gradient(280deg, rgb(47, 42, 41) 0%, rgb(47, 42, 41) 100%)',
        overflow: 'hidden',
        transition: '.4s',

        '&:before': {
            position: 'absolute',
            top: 0,
            left: 0,
            content: '""',
            display: 'block',
            height: '100%',
            width: '100%',
            backgroundImage: 'linear-gradient(225deg, rgb(255, 103, 0) 0%, rgb(255, 45, 240) 100%)',
            opacity: 0,
            transition: '.4s',
        },

        '&:hover': {
            boxShadow: '0 20px 30px 4px rgba(97, 45, 45, .5)',
        },

        '&:hover:before': {
            opacity: 1,
        },

        '& > div': {
            padding: '0 8px',
            zIndex: 9,
        },
    },

    meta: {
        flex: .8,
        textAlign: 'left',
        transform: 'translateX(-10px)',

        '& $subtitle': {
            margin: 0,
            fontSize: 13,
            fontWeight: 'bold',
            background: 'none',
            color: '#000',
        },
    },

    info: {
        position: 'absolute',
        top: 100,
        right: 0,
        textAlign: 'right',
        color: '#fff',
        opacity: 0,
        transition: '1s',
        transform: 'translateY(-16px)',
    },

    subtitle: {
        display: 'inline-block',
        padding: '4px 8px',
        fontFamily: 'Roboto',
        fontWeight: 'lighter',
        fontSize: 11,
        background: '#000',
    },

    title: {
        display: '-webkit-box',
        padding: '6px 8px',
        background: '#000',
        lineHeight: '16px',
        whiteSpace: 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: '.4s',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
    },
});
