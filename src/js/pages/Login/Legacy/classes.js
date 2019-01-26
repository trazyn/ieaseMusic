
import colors from 'utils/colors';

export default theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8vh',
        textAlign: 'center',

        '& header, & section': {
            zIndex: 1,
        },

        '& section': {
            marginTop: '5vh',
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

            '&$error': {
                color: colors.pallet.grape
            },
        },

        '& input': {
            display: 'block',
            width: 270,
            height: 36,
            marginBottom: 32,
            lineHeight: '36px',
            background: 'none',
            color: '#000',
            fontSize: 14,
            textAlign: 'center',
            border: 0,
            borderBottom: '1px solid #ddd',
            outline: 0,
            transition: '.2s',
        },

        '& input:focus': {
            borderBottomColor: colors.pallet.coral,
        },

        '& button': {
            position: 'relative',
            width: 120,
            height: 40,
            fontSize: 14,
            lineHeight: '40px',
            border: 'none',
            borderRadius: 1,
            background: colors.pallet.google,
            fontWeight: '300',
            color: '#fff',
            outline: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            letterSpacing: 1,
            transition: '.4s',

            '&:before': {
                position: 'absolute',
                content: '""',
                top: 0,
                left: 0,
                display: 'block',
                height: '100%',
                width: '100%',
                backgroundImage: colors.randomGradient(),
                opacity: 0,
                transition: '.4s',
            },

            '&:hover, &$logining': {
                boxShadow: '0 0 24px 0 rgba(0, 0, 0, .5)',
            },

            '&:hover:before': {
                opacity: 1,
            },

            '& span': {
                position: 'relative',
                zIndex: 1,
            }
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

        '& footer': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        }
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

    error: {
        visibility: 'hidden',
        opacity: 0,
        transition: '.2s',
    },

    show: {
        visibility: 'visible',
        opacity: 1,
    },

    logining: {
        opacity: .5,
    },

    sns: {
        display: 'flex',
        flexDirection: 'row',
    },

    link: {
        margin: '0 10px',
        display: 'block',
        paddingBottom: 4,
        marginTop: 20,
        color: 'black',
        zIndex: 1,
        borderBottom: '2px solid #ddd',
    }
});
