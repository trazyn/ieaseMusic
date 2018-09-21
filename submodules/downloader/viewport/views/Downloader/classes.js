
import colors from 'utils/colors';

export default theme => ({
    container: {
        height: '100vh',
        backgroundColor: '#f5f5f7',

        '& nav': {
            display: 'flex',
            height: 38,
            paddingLeft: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            color: 'black',
            backgroundColor: 'white',
            fontFamily: 'Roboto',
            fontSize: 14,
            fontWeight: '500',
            boxShadow: '0 -6px 24px rgba(0, 0, 0, .1)',
        },

        '& nav > a': {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        '& section': {
            height: 'calc(100vh - 38px - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
        },

        '& section aside': {
            position: 'relative',
            display: 'flex',
            width: 235,
            justifyContent: 'space-around',
            flexDirection: 'column',
            height: 64,
            paddingLeft: 24,
        },

        '& small': {
            color: '#666',
        },

        '& small, $title': {
            maxWidth: 140,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },

        '& footer': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100vw',
            height: 40,
            backgroundColor: 'white',
            boxShadow: '0 6px 24px rgba(0, 0, 0, .1)',
        },

        '& footer aside': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
        },

        '& button': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 12,
            color: '#333',
            padding: '4px 12px',
            margin: 0,
            border: 0,
            background: 'none',
            textTransform: 'uppercase',
            transition: '.2s',
        },

        '& button:hover': {
            color: colors.pallet.google,
        },

        '& button i': {
            marginRight: 4,
        },
    },

    selected: {
        color: 'white',
        backgroundColor: colors.pallet.google,
    },

    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingRight: 12,
        paddingBottom: 0,
    },

    cover: {
        width: 64,
        height: 64,
        boxShadow: '0 0 24px rgba(0, 0, 0, .3)',
    },

    title: {
        margin: 0,
        color: '#333',
    },

    progress: {
        position: 'relative',
        height: 4,
        marginBottom: 10,
        backgroundColor: '#ddd',
    },

    passed: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 4,
        backgroundColor: colors.pallet.google,
        boxShadow: `-5px 3px 24px 4px ${colors.pallet.google}`,
    },

    hovers: {
        position: 'absolute',
        bottom: 0,
        right: -13,
        height: 64,
        width: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto',
        cursor: 'pointer',

        '& a': {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.pallet.grape,
            color: '#fff',
            fontSize: 20,
            transform: 'translateX(100%)',
            transition: '.3s',
            zIndex: 1,
        },

        '&:hover a': {
            transform: 'translateX(0)',
        }
    },

    actions: {
        position: 'absolute',
        bottom: 0,
        right: -13,
        height: 64,
        width: 100,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto',

        '& button': {
            cursor: 'pointer',
        },

        '& button:first-child': {
            color: colors.pallet.google,
        },

        '& button:last-child': {
            color: colors.pallet.grape,
        },

        '& button:hover': {
            color: 'inherit',
        },
    },

    nothing: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 32,
        letterSpacing: 1,
        wordSpacing: 3,
        color: '#333',
    },
});
