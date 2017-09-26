
import colors from 'utils/colors';

export default theme => {
    return {
        container: {
            padding: 32,
            background: '#fff',
            color: '#333',
            overflow: 'hidden',
            overflowY: 'auto',
            height: '100vh',

            '& header': {
                fontFamily: 'HelveticaNeue-UltraLight',
                fontSize: 24,
                fontWeight: '100',
                color: '#000',
                letterSpacing: 1,
                wordSpacing: 3,
            },

            '& h4': {
                margin: 0,
                fontWeight: 'normal',

                '& + p': {
                    margin: 0,
                    marginTop: 2,
                    fontSize: 12,
                    color: 'gray',
                }
            },

            '& h3': {
                marginTop: 32,
                fontFamily: 'HelveticaNeue-UltraLight',
                fontSize: 18,
                fontWeight: '100',
                color: '#000',
                letterSpacing: 1,
                wordSpacing: 3,
            },

            '& section': {
                fontFamily: 'Roboto',
                fontSize: 14,
                padding: 32,
            },

            '& label': {
                display: 'flex',
                margin: '24px 0',
                justifyContent: 'space-between',
                alignItems: 'center',
            }
        },

        close: {
            position: 'absolute',
            height: 32,
            top: 32,
            right: 32,
            cursor: 'pointer',
        },

        background: {
            margin: '24px 0',

            '& input': {
                display: 'block',
                height: 36,
                width: '100%',
                lineHeight: '36px',
                background: 'none',
                color: 'gray',
                fontSize: 13,
                textAlign: 'left',
                border: 0,
                borderBottom: '1px solid #ddd',
                outline: 0,
                transition: '.2s',
            },

            '& input:focus': {
                borderBottomColor: colors.pallet.coral,
            },
        }
    };
};
