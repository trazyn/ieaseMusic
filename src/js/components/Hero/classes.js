
import colors from 'utils/colors';

export default theme => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '40vw',
        height: '100vh',
        overflow: 'hidden',

        '& header': {
            justifyContent: 'space-between',
            padding: '24px',
            fontSize: 24,
            fontFamily: 'HelveticaNeue-UltraLight',
        },

        '& footer': {
            position: 'relative',
            padding: '12px 24px',
        },

        '& p': {
            padding: 0,
            margin: 0,
        },

        '& figure': {
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -1,

            '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, .3)'
            }
        },

        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            display: 'block',
            width: '100%',
            height: '20vh',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(216, 216, 216, .6))',
        },

        '& section p': {
            color: '#fff',
        },

        '& section span': {
            display: 'inline-block',
            padding: '12px 24px',
            marginBottom: 20,
            fontSize: 12,
            color: '#fff',
            background: '#000',
            textTransform: 'uppercase',
            cursor: 'pointer',
        }
    },

    liked: {
        color: colors.pallet.grape,
        textShadow: `0 0 24px ${colors.pallet.grape}`,
    },

    author: {
        marginTop: 2,
        fontSize: 11,
        maxWidth: 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        '& a': {
            display: 'inline-block',
            paddingBottom: 2,
            borderBottom: 'thin solid rgba(255, 255, 255, 0)',
            color: '#4a4a4a',
            transition: '.2s',

            '&:after': {
                content: '"/"',
                display: 'inline-block',
                margin: '0 5px',
            },

            '&:hover': {
                borderBottomColor: '#000',
            },
        },

        '& a:last-child:after': {
            content: 'none',
        }
    },

    highquality: {
        display: 'inline-block',
        padding: '6px 8px',
        marginLeft: 30,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#fff',
        background: colors.pallet.dribbble,
        boxShadow: `0 0 24px ${colors.pallet.dribbble}`,
        transform: 'translateY(-6px)',
        zoom: .8,
    },

    active: {
        '& span': {
            fontSize: '18px !important',
            color: `${colors.pallet.dribbble} !important`,
        }
    }
});
