
import colors from 'utils/colors';

export default theme => ({
    container: {
        height: '100vh',
        backgroundColor: '#f5f5f7',

        '& nav': {
            position: 'relative',
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

        '& section': {
            height: 'calc(100vh - 38px - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
        },

        '& aside': {
            position: 'relative',
            display: 'flex',
            width: 235,
            justifyContent: 'space-around',
            flexDirection: 'column',
            height: 48,
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
            width: 'calc(100vw - 24px)',
            height: 40,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: 'white',
            boxShadow: '0 6px 24px rgba(0, 0, 0, .1)',
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
            background: '#efefef',
            textTransform: 'uppercase',
            transition: '.2s',
        },

        '& button i': {
            marginRight: 4,
        },

        '& button:disabled': {
            color: '#999',
        },

        '& button:hover:not(:disabled)': {
            color: colors.pallet.google,
        },

        '& button:last-child:not(:disabled), & $checked': {
            color: '#fff',
            backgroundColor: colors.pallet.google,
        }
    },

    checked: {},

    item: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,

        '& i': {
            position: 'absolute',
            right: 24,
            top: '50%',
            fontSize: 18,
            color: '#333',
            transform: 'translateY(-50%)',
        },

        '& i.ion-ios-checkmark, & i.ion-ios-cloud-download': {
            color: colors.pallet.google,
        }
    },

    cover: {
        width: 32,
        height: 32,
        boxShadow: '0 0 24px rgba(0, 0, 0, .3)',
    },

    title: {
        margin: 0,
        color: '#333',
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

    close: {
        position: 'absolute',
        right: 6,
        top: '50%',
        width: 32,
        fontSize: 24,
        textAlign: 'center',
        transform: 'translateY(-45%)',
        cursor: 'pointer',
    },
});
