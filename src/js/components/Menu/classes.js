
export default theme => ({
    container: {
        outline: 0,
    },

    body: {
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100vh',
        width: '40vw',
        paddingLeft: 78,
        fontFamily: 'HelveticaNeue-UltraLight',
        background: '#fff',
        boxShadow: '0 30px 80px 0 rgba(97, 45, 45, .25)',
        zIndex: 999,

        '& a': {
            color: '#000',
        }
    },

    overlay: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, .3)',
        zIndex: 999,
    },

    navs: {
        '& a': {
            position: 'relative',
            fontSize: 20,
            textIndent: 4,
            letterSpacing: 4,
            cursor: 'pointer',
        },

        '& a:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 1,
            width: 100,
            background: '#000',
            transform: 'translateX(-160px) translateY(-11px)',
            opacity: 0,
            transition: '.2s ease-out',
        },

        '& a:hover:after': {
            width: 160,
            opacity: 1,
            transform: 'translateX(-100px) translateY(-11px)',
        }
    },

    profile: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,

        '& img': {
            height: 64,
            width: 64,
            borderRadius: 64,
            marginRight: 20,
        },

        '& $username a': {
            display: 'inline-block',
            marginBottom: 4,
            fontSize: 24,
            letterSpacing: 1,
            textIndent: 0,
            maxWidth: 200,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },

        '& $logout': {
            fontSize: 14,
            letterSpacing: 2,
        }
    },

    info: {},

    username: {
        padding: 0,
        margin: 0,
    },

    logout: {
        display: 'inline-table',
        textIndent: 4,
        paddingBottom: 2,
        borderBottom: 'thin solid transparent',
        transition: '.4s',

        '&:hover': {
            borderBottomColor: '#000',
        }
    },

    social: {
        '& a': {
            display: 'inline-block',
            width: 48,
            height: 48,
            fontSize: 14,
            borderRadius: 48,
            marginRight: 20,
            lineHeight: '48px',
            textAlign: 'center',
            cursor: 'pointer',
            color: '#fff',
            letterSpacing: 0,
            transition: '.2s',
        },

        '& a:hover': {
            boxShadow: '0 1px 24px rgba(0, 0, 0, .24)',
        },

        '& $twitter': {
            background: '#55acee',
        },

        '& $github': {
            background: 'rgba(0, 0, 0, .7)',
        },
    },

    github: {},
    twitter: {},
});
