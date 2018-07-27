
import colors from 'utils/colors';

export default theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8vh',
        textAlign: 'center',

        '& header, & figure': {
            zIndex: 1,
        },

        '& figure': {
            display: 'flex',
            width: 200,
            flexDirection: 'column',
            marginTop: '5vh',
            justifyContent: 'center',
            alignItems: 'center',
        },

        '& h1': {
            fontFamily: 'HelveticaNeue-UltraLight',
            fontWeight: 'lighter',
            fontSize: 44,
            letterSpacing: 2,
            wordSpacing: 6,
            color: colors.pallet.dribbble,
        },

        '& p': {
            fontSize: 12,
            maxWidth: 300,
            lineHeight: '24px',
            color: '#000',
            wordSpacing: 2,
        },

        '& figure p': {
            color: '#666',
        },

        '& figure a': {
            paddingBottom: 3,
            color: colors.pallet.google,
            textTransform: 'uppercase',
            borderBottom: '2px solid #999',
        },

        '& a': {
            color: '#000',
        },

        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'block',
            height: '100vh',
            width: '100vw',
            background: 'rgba(255, 255, 255, .9)',
        },
    },

    back: {
        position: 'fixed',
        top: 0,
        right: 12,
        height: 40,
        lineHeight: '40px',
        fontSize: 12,
        textTransform: 'uppercase',
        zIndex: 9,
        transition: '.2s',

        '& i': {
            display: 'inline-block',
            marginRight: 8,
            fontSize: 20,
            transform: 'translateY(3px)',
        },

        '&:hover': {
            color: colors.pallet.primary,
        },
    },

    wraped: {
        position: 'relative',
        width: 128,
        height: 128,
    },

    qrcode: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
});
