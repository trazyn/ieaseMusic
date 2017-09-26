
export default theme => ({
    container: {
        padding: 32,
        background: '#fff',
        color: '#333',

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
});
