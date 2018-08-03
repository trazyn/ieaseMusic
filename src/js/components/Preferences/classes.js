
import colors from 'utils/colors';

export default theme => {
    return {
        modal: {
            height: 'calc(100vh - 140px)',
        },

        header: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 24,
            paddingBottom: 0,
            fontFamily: 'HelveticaNeue-UltraLight',
            fontSize: 24,
            fontWeight: '100',
            color: '#000',
            letterSpacing: 1,
            wordSpacing: 3,
            backgroundColor: 'white',
        },

        container: {
            background: '#fff',
            color: '#333',
            overflow: 'hidden',
            overflowY: 'auto',
            height: '100%',
            width: '80vw',

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

            '& h3 small': {
                display: 'block',
                margin: 0,
                marginTop: 2,
                fontSize: 12,
                fontFamily: 'Roboto',
                fontWeight: 'normal',
                color: 'gray',
            },

            '& section': {
                fontFamily: 'Roboto',
                fontSize: 14,
                padding: 32,
                paddingTop: 24,
            },

            '& label': {
                display: 'flex',
                margin: '24px 0',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
        },

        close: {
            height: 32,
            cursor: 'pointer',
        },

        field: {
            margin: '24px 0',
        },

        textInput: {
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

            '&focus': {
                borderBottomColor: colors.pallet.coral,
            },
        },

        connect: {
            position: 'relative',
            padding: '0 14px',
            height: 40,
            fontSize: 14,
            lineHeight: '40px',
            border: 'none',
            borderRadius: 1,
            background: colors.pallet.primary,
            fontFamily: 'Helvetica Neue',
            fontWeight: '300',
            color: '#fff',
            outline: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            letterSpacing: 1,
            transition: '.4s',

            '&:not(:disabled):hover': {
                boxShadow: '0 0 24px 0 rgba(0, 0, 0, .5)',
            },

            '&:disabled': {
                opacity: '.5',
            },

            '& i': {
                fontSize: 16,
                marginRight: 16,
            }
        },

        connected: {
            background: colors.pallet.mint,
        },

        downloads: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            '& input': {
                display: 'none',
            },

            '& button': {
                padding: '8px 12px',
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
        }
    };
};
