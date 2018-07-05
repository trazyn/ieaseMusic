
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

    lyrics: {
        position: 'relative',
        width: '60vw',
        textAlign: 'center',
        fontWeight: 'lighter',
        fontSize: 16,
        lineHeight: '36px',
        wordSpacing: '1px',

        '& figure': {
            filter: 'blur(40px)',
        },

        '& section': {
            position: 'absolute',
            width: '60vw',
            height: '100vh',
            top: 0,
            overflow: 'hidden',
            overflowY: 'auto',

            '&:before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: '40vw',
                display: 'block',
                height: '100vh',
                width: '60vw',
                background: 'rgba(0, 0, 0, .3)',
            }
        },

        '& [playing] span': {
            display: 'inline-block',
            paddingBottom: 4,
            fontSize: 24,
            color: colors.pallet.mint,
            borderBottom: `thin solid ${colors.pallet.mint}`,
        },

        '& figure > img': {
            height: '100vh',
        }
    },

    placeholder: {
        paddingTop: '20vh',
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 32,
        letterSpacing: 1,
        wordSpacing: 3,
        textAlign: 'center',
        color: '#fff',
    },
});
