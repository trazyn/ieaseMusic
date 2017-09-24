
export default theme => {
    return {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white',
            fontFamily: 'HelveticaNeue-UltraLight',
            fontSize: 24,
            opacity: 0,
            visibility: 'hidden',
            transition: '.2s',

            '& span': {
                marginTop: '8%',
                maxWidth: '60vw',
                textAlign: 'center',
                lineHeight: '32px',
                color: '#ea4c89',
            },

            '&:before': {
                content: 'url(assets/loading.gif)',
                position: 'absolute',
                top: '40%',
                left: '50%',
                display: 'block',
                transform: 'translateX(-50%)',
            },
        },

        show: {
            opacity: 1,
            visibility: 'visible',
            zIndex: 1000,
        },
    };
};
