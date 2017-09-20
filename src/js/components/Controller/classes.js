
import helper from 'utils/helper';
import colors from 'utils/colors';

export default theme => {
    var progress = helper.randomName();

    return {
        container: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
            height: 50,
            background: '#fff',
            color: '#000',

            '& section': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            '& aside': {
                display: 'flex',
                paddingLeft: 20,
                paddingRight: 32,
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',

                '& p': {
                    margin: 0,
                    padding: 0,
                }
            }
        },

        bar: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '0%',
            height: 2,
            background: 'linear-gradient(to right,#62efab 5%,#f2ea7d 15%,#f2ea7d 25%,#ff8797 35%,#ff8797 45%,#e1a4f4 55%,#e1a4f4 65%,#82fff4 75%,#82fff4 85%,#62efab 95%)',
            backgroundSize: '200%',
            backgroundPosition: 0,
            transition: 'all 0.3s ease-out',
            animation: `${progress} 3s linear infinite`,
        },

        info: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },

        title: {
            fontSize: 12,
            color: '#081600',
        },

        author: {
            marginTop: 2,
            fontSize: 11,

            '& a': {
                display: 'inline-block',
                paddingBottom: 2,
                color: '#4a4a4a',
                borderBottom: 'thin solid rgba(255, 255, 255, 0)',
                transition: '.2s',

                '&:hover': {
                    borderBottomColor: '#000',
                },

                '&:after': {
                    content: '"/"',
                    display: 'inline-block',
                    margin: '0 5px',
                },
            },

            '& a:last-child:after': {
                content: 'none',
            }
        },

        cover: {
            height: 50,
            width: 50,
        },

        action: {
            '& i': {
                display: 'inline-block',
                height: 24,
                width: 24,
                lineHeight: '24px',
                marginRight: 16,
                fontSize: 16,
                color: '#4a4a4a',
                textAlign: 'center',
                cursor: 'pointer',
                transition: '.2s',
            },

            '& i:hover': {
                color: theme.hoverColor,
            },

            '& i$liked': {
                color: colors.pallet.grape,
            }
        },

        liked: { },

        mode: {
            color: '#4a4a4a',
        },

        controls: {
            display: 'inline-block',
            marginLeft: 16,
            color: '#000',
        },

        toggle: {
            '& i': {
                color: '#9b9b9b',
            }
        },

        [`@keyframes ${progress}`]: {
            '0%': {
                backgroundPosition: '0%',
            },
            '100%': {
                backgroundPosition: '100%',
            },
        }
    };
};
