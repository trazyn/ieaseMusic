
export default theme => ({
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: 'calc(40vw + 78px)',
        color: '#4a4a4a',
        background: '#fff',
        boxShadow: '0 30px 80px 0 rgba(97, 45, 45, .25)',
        zIndex: 999,
        outline: 0,

        '& section': {
            position: 'relative',
            zIndex: 1,
            outline: 0,
        },

        '& header': {
            padding: '40px 78px 20px',
        },

        '& input': {
            height: 40,
            lineHeight: '40px',
            width: '100%',
            fontFamily: 'HelveticaNeue-UltraLight',
            fontSize: 24,
            border: 0,
            outline: 0,
        },
    },

    overlay: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, .3)',
    },

    list: {
        listStyle: 'none',
        height: 'calc(100vh - 102px)',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        overflowY: 'auto',

        '& li': {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
        }
    },

    song: {
        position: 'relative',
        display: 'flex',
        width: 'calc(100% - 78px)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '24px 0',
        transition: '.4s',
        cursor: 'pointer',

        '& img': {
            height: 48,
            width: 48,
            margin: '0 24px',
            boxShadow: '0 0 24px 0 rgba(0, 0, 0, .3)',
        },

        '& p': {
            margin: 0,
            padding: 0,
        },

        '&$active $mask, &:hover $mask': {
            opacity: 1,
        }
    },

    actions: {
        display: 'flex',
        width: 78,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    active: {},

    title: {
        maxWidth: 200,
        color: '#081600',
        fontSize: 14,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    author: {
        maxWidth: 200,
        whiteSpace: 'nowrap',
        overflow: 'hidden',

        '& a': {
            display: 'inline-block',
            color: '#4a4a4a',
            paddingBottom: 2,
            borderBottom: 'thin solid rgba(255, 255, 255, 0)',
            transition: '.2s',

            '&:hover': {
                borderBottomColor: '#000',
            },

            '&:after': {
                content: '"/"',
                display: 'inline-block',
                margin: '0 5px',
            },
        },

        '& a:last-child:after': {
            content: 'none',
        }
    },

    playing: {
        padding: 0,

        '& img': {
            height: 96,
            width: 96,
            margin: 0,
            marginRight: 24,
        },
    },

    mask: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 96,
        opacity: 0,
        transition: '.4s',
        zIndex: -1,

        '&:before': {
            position: 'absolute',
            top: 0,
            left: 0,
            content: '""',
            display: 'block',
            height: '100%',
            width: '100%',
            background: 'linear-gradient(to left, transparent, rgba(255, 255, 255, 1))',
        },
    },

    nothing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 180px)',
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 36,
        color: '#000',
        letterSpacing: 1,
    },
});
