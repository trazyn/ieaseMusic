
export default theme => ({
    container: {
        height: '100vh',
        background: 'rgba(255, 255, 255, .3)',
    },

    hero: {
        display: 'flex',
        height: 260,
        justifyContent: 'flex-start',
        alignItems: 'center',

        '& figure': {
            boxShadow: '0 0 24px 0 #000',
        }
    },

    follow: {
        position: 'absolute',
        right: 24,
        top: 56,
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

    info: {
        paddingTop: 40,
    },

    username: {
        fontSize: 14,
        transform: 'translateX(-20px)',

        '& span': {
            display: 'inline-block',
            padding: '8px 32px',
            color: '#fff',
            background: '#000',
            textAlign: 'center',
            minWidth: 80,
        }
    },

    followers: {
        transform: 'translateX(-20px)',

        '& span': {
            display: 'inline-block',
            padding: '8px 0',
            fontSize: 12,
            textTransform: 'uppercase',
            color: '#000',
            borderBottom: '2px solid #000',
            textIndent: 30,
        }
    },

    signature: {
        marginTop: 34,
        fontSize: 14,
        transform: 'translate(-20px, 20px)',

        '& span': {
            display: '-webkit-box',
            padding: '16px 30px',
            maxWidth: 280,
            lineHeight: '32px',
            color: '#000',
            border: '2px solid #000',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',

        }
    },

    list: {
        marginTop: 20,
    },

    item: {
        position: 'relative',
        fontSize: 14,
        cursor: 'pointer',
        transition: '.4s',

        '& figure': {
            width: 120,
            height: 120,
            margin: '50px 30px',
            boxShadow: '0 0 24px 0 #333',
        },

        '& p': {
            padding: 0,
            margin: 0,
            transition: '1s',
        },

        '& $played': {
            width: '0%',
            overflow: 'hidden',
        },

        '& p span': {
            display: 'inline-block',
            padding: '4px 8px',
            background: '#000',
            color: '#fff',
        },

        '&$playing, &:hover': {
            transform: 'translateY(-30px)',
        },

        '&$playing p, &:hover p': {
            visibility: 'visible',
            opacity: 1,
        },

        '&$playing $played, &:hover $played': {
            width: '100%',
        },

        '$played': {
            visibility: 'hidden',
            opacity: 0,
            whiteSpace: 'nowrap',
        }
    },

    playing: {},

    meta: {
        position: 'absolute',
        top: 170,
        left: 30,
    },

    name: {
        '& span': {
            display: '-webkit-box !important',
            lineHeight: '18px',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
        }
    },

    played: {
        fontFamily: 'Roboto',
        fontSize: 12,
        textTransform: 'uppercase',
    },
});
