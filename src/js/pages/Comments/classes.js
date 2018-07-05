
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        zIndex: 99,

        '& h3': {
            paddingBottom: 4,
            fontFamily: 'HelveticaNeue-UltraLight',
            fontSize: 24,
            fontWeight: 'lighter',
            borderBottom: 'thin solid white',
            letterSpacing: 1,
            wordSpacing: 2,
        },
    },

    list: {
        width: '60vw',
        height: '100vh',
        padding: '16px 24px',
        color: '#777',
        overflow: 'hidden',
        overflowY: 'auto',

        '& h3': {
            display: 'inline-block',
            color: 'dimgray',
            borderBottomColor: 'dimgray',
        }
    },

    comment: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: 24,

        '& aside': {
            flex: 1,
        },

        '& figure': {
            marginRight: 24,
            borderRadius: 48,
        },

        '& p': {
            marginTop: 0,
        },
    },

    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        color: 'rgba(0, 0, 0, .3)',

        '& span': {
            marginRight: 10,
        },

        '$thumbsup': {
            cursor: 'pointer',
            transition: '.3s',

            '&:hover, &:hover i': {
                color: colors.pallet.primary,
            }
        },
    },

    thumbsup: {},

    nestest: {
        padding: 0,
        margin: 0,
        marginTop: 14,
        listStyle: 'none',

        '& a': {
            display: 'inline-block',
            padding: '1px 2px',
            color: '#2d82ca',
            whiteSpace: 'nowrap',
            borderBottom: 'thin solid transparent',
            transition: '.2s',

            '&:hover': {
                borderBottomColor: '#2d82ca',
            }
        },

        '& li': {
            background: 'rgba(0, 0, 0, 0.03)',
            padding: '4px 12px',
            fontSize: 12,
            lineHeight: '20px',
        }
    },

    loadmore: {},

    liked: {
        color: colors.pallet.grape,
        textShadow: `0 0 24px ${colors.pallet.grape}`,
    },
});
