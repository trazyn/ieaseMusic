
export default theme => ({
    container: {
        '& ul': {
            padding: 0,
            margin: 0,
            whiteSpace: 'nowrap',
            overflowY: 'hidden',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
        },
    },

    item: {
        position: 'relative',
        display: 'flex',
        height: 'calc((100vh - 50px) / 2)',
        width: 'calc((100vh - 50px) / 2)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',

        '& p': {
            maxWidth: 210,
            lineHeight: '32px',
            fontSize: 24,
            whiteSpace: 'normal',
        },

        '& img:first-of-type': {
            width: '100%',
            height: '100%',
            transition: '.2s ease-in',
        },

        '&:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'block',
            height: '100%',
            width: '100%',
            background: 'rgba(0, 0, 0, .7)',
            visibility: 'visible',
            transition: '.2s',
        },

        '&:hover img:first-of-type': {
            transform: 'scale(1.1)',
        },

        '&:hover:after': {
            background: 'rgba(0, 0, 0, .3)',
        }
    },

    info: {
        position: 'absolute',
        color: '#fff',
        zIndex: 1,
    },

    line: {
        height: 4,
        width: 170,
        margin: '0 auto',
        marginTop: -10,
        marginBottom: 24,
        background: '#fff',
    }
});
