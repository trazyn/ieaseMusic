
import colors from 'utils/colors';

export default theme => {
    return {
        container: {
            display: 'flex',
            width: '80vw',
            paddingTop: 16,
            paddingBottom: 24,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            background: 'white',

            '& h2': {
                fontFamily: 'HelveticaNeue-UltraLight',
                fontSize: 24,
                letterSpacing: 2,
                color: 'black',
            },

            '& p': {
                paddingBottom: 1,
                maxWidth: '80%',
                marginTop: 0,
                marginBottom: 32,
                fontSize: 14,
                color: '#333',
            },
        },

        action: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',

            '& button': {
                padding: '8px 12px',
                minWidth: 70,
                textTransform: 'uppercase',
                border: 0,
                borderRadius: 1,
                background: 'none',
                color: 'rgb(117, 117, 117)',
                cursor: 'pointer',
                outline: 0,
                transition: '.2s',
            },

            '& button:hover': {
                background: 'rgba(0, 0, 0, .1)',
            }
        },

        ok: {
            marginRight: 20,

            '&:hover': {
                color: colors.pallet.google,
            }
        },

        cancel: {
            '&:hover': {
                color: colors.pallet.grape,
            }
        }
    };
};
