
export default theme => ({
    container: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'calc(100vw - 260px)',
        height: 'calc(100vh - 52px)',
        background: '#fff',
        overflow: 'hidden',
        zIndex: 99,

        '& header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 66,
            paddingLeft: 24,
            paddingRight: 16,
            boxShadow: 'inset 0 0 0.7px 0 rgba(0, 0, 0, .5)',
        },

        '& header input': {
            height: 40,
            lineHeight: '40px',
            width: '100%',
            fontFamily: 'HelveticaNeue-UltraLight',
            fontSize: 24,
            border: 0,
            outline: 0,
        }
    },

    close: {
        height: 32,
        cursor: 'pointer',
    },

    list: {
        '& ul': {
            height: 'calc(100vh - 52px - 66px) !important',
        }
    }
});
