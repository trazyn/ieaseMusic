
export default theme => ({
    container: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
        cursor: 'pointer',

        '& input': {
            display: 'none',

            '&:checked + $fake:before': {
                background: 'rgba(157, 166, 216, 1)',
            },

            '&:checked + $fake:after': {
                left: 'auto',
                right: 0,
                background: '#3f51b5',
            }
        },

        '& input:disabled + $fake:before': {
            background: 'rgba(0, 0, 0, .12)',
        },

        '& input:disabled + $fake:after': {
            left: 'auto',
            right: 0,
            background: '#bdbdbd',
        }
    },

    fake: {
        position: 'relative',
        display: 'inline-block',
        width: 35,
        height: 20,

        '&:before, &:after': {
            content: '""',
        },

        '&:before': {
            display: 'block',
            width: 35,
            height: 14,
            marginTop: 3,
            background: 'rgba(0, 0, 0, .26)',
            borderRadius: 14,
            transition: '.5s ease-in-out',
        },

        '&:after': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: 20,
            height: 20,
            borderRadius: 20,
            background: '#fff',
            boxSizing: 'border-box',
            boxShadow: '0 3px 4px 0 rgba(0, 0, 0, .5)',
            transition: '.2s',
        }
    },
});
