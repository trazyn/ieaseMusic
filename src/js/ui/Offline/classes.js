
import colors from 'utils/colors';

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
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            fontFamily: 'HelveticaNeue-UltraLight',

            '& h1': {
                fontSize: 40,
                fontWeight: '200',
                color: colors.pallet.dribbble
            },

            '& button': {
                marginTop: 20,
                padding: '8px 12px',
                border: 0,
                fontSize: 14,
                fontWeight: 'lighter',
                color: 'dimgray',
                background: 'white',
                letterSpacing: .5,
                textTransform: 'uppercase',
                borderBottom: 'thin solid dimgray',
                outline: 0,
            }
        },
    };
};
