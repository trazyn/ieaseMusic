
export default theme => ({
    container: {

    },

    hero: {
        display: 'flex',
        height: 260,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    avatar: {
        display: 'block',
        height: 260,
        width: 260,
        boxShadow: '0 0 24px 0 #000',
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

    item: {
        position: 'relative',
        fontSize: 14,
        cursor: 'pointer',
        transition: '.4s',

        '& img': {
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

        '&:hover': {
            transform: 'translateY(-30px)',
        },

        '&:hover p': {
            visibility: 'visible',
            opacity: 1,
        },

        '&:hover $played': {
            width: '100%',
        },

        '$played': {
            visibility: 'hidden',
            opacity: 0,
            whiteSpace: 'nowrap',
        }
    },

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
