
export default theme => {
    return {
        modal: {},

        container: {
            width: '100vw',
            height: '100vh',
            background: 'rgba(255, 255, 255, .9)',

            '& main': {
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: -150,
                display: 'flex',
                height: '100vh',
                width: 300,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                paddingLeft: 20,
                paddingRight: 20,
            },

            '& summary': {
                paddingRight: 20,
                paddingLeft: 20,
                textAlign: 'center',
            },

            '& h2': {
                fontFamily: 'HelveticaNeue-UltraLight',
                fontSize: 24,
                letterSpacing: 2,
                color: 'black',
            },

            '& p': {
                paddingBottom: 1,
                maxWidth: 400,
                marginTop: 0,
                marginBottom: 32,
                fontSize: 16,
                color: '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            },

            '& section img': {
                width: 64,
                height: 64,
            }
        },

        qrcode: {
            marginBottom: 64,
            background: '#ddd',
            transform: 'translateY(12px)',

            '& img': {
                width: 128,
                height: 128,
            },

            '& figcaption': {
                height: 24,
                marginTop: -4,
                lineHeight: '24px',
                textAlign: 'center',
                background: 'white',
                color: '#333',
                textTransform: 'uppercase',
            }
        },

        close: {
            '& img': {
                width: 48,
                height: 48,
            }
        },
    };
};
