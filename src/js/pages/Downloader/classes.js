
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
            transition: '.2s',
        },

        '& nav > a:hover': {
            backgroundColor: colors.pallet.google,
            color: 'white',
        },

        '& footer': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100vw',
            height: 40,
            paddingLeft: 12,
            backgroundColor: 'white',
            boxShadow: '0 6px 24px rgba(0, 0, 0, .1)',
        },

        '& button': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
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
            color: colors.pallet.google
        },

        '& button i': {
            marginRight: 4,
        },
    },

    selected: {
        color: 'white',
    },

    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
    },

    title: {
        maxWidth: 300,
        color: '#666',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    progress: {
        position: 'relative',
        height: 4,
        backgroundColor: '#ddd',
    },

    passed: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 4,
        backgroundColor: colors.pallet.google
    },
});
