
import perdido from 'perdido';
import colors from 'utils/colors';

export default theme => {
    return {
        container: {

        },

        unavailable: {
            display: 'flex',
            width: '100vw',
            height: 'calc(100vh - 50px)',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'black',

            '& p': {
                fontWeight: 100,
                fontSize: 24,
                color: colors.pallet.dribbble
            },

            '& a': {
                marginTop: 20,
                padding: '8px 12px',
                border: 0,
                fontSize: 14,
                fontWeight: 'lighter',
                color: 'white',
                background: 'transparent',
                letterSpacing: .5,
                textTransform: 'uppercase',
                borderBottom: 'thin solid white',
                outline: 0,
            }
        },

        covers: {
            ...perdido.utils.clearFix,
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',

            '&:after': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'block',
                height: '100vh',
                width: '100vw',
                background: 'rgba(0, 0, 0, .3)'
            },

            '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: 0,
                display: 'block',
                height: '40vh',
                width: '100vw',
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(216, 216, 216, 1))',
                zIndex: 1,
            }
        },

        cover: {
            ...perdido.column('1/3', { gutter: '0px' }),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',

            '& img': {
                height: '100vh',
            }
        },

        main: {
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            height: '100vh',
            width: '100vw',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',

            '& article': {
                display: 'flex',
                width: 'calc(100vw - 160px)',
                justifyContent: 'flex-start',
                marginTop: 70,
                alignItems: 'center',
            },

            '& figure': {
                marginRight: 24,
                boxShadow: '0 0 24px 0 rgba(0, 0, 0, .4)',
            },

            '& a': {
                display: 'inline-block',
                paddingBottom: 2,
                color: '#fff',
                borderBottom: 'thin solid transparent',
                transition: '.2s',

                '&:hover': {
                    borderBottomColor: '#fff',
                }
            },

            '& p': {
                padding: 0,
                color: '#fff',
                fontSize: 12,

                '& span': {
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: '#000',
                },

                '&$title': {
                    fontSize: 24,
                }
            },
        },

        title: {
            marginBottom: 24,

            '& span': {
                display: '-webkit-box !important',
                maxWidth: 300,
                lineHeight: '32px',
                whiteSpace: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '-webkit-line-clamp': 3,
                '-webkit-box-orient': 'vertical',
            }
        },

        album: {
            marginBottom: 12,
        },

        artists: {
            '& a:after': {
                content: '"/"',
                display: 'inline-block',
                margin: '0 5px',
            },
            '& a:last-child:after': {
                content: 'none',
            },
        },

        comments: {
            textTransform: 'uppercase',
            transform: 'translateY(-12px)',
            cursor: 'pointer',
        },

        bar: {
            position: 'relative',
            height: 30,
            marginBottom: -30,
            width: 'calc(100vw - 64px)',
            overflow: 'hidden',
            cursor: 'pointer',

            '& $playing, & $buffering': {
                position: 'absolute',
                top: 0,
                left: 0,
                height: 4,
            },

            '& $playing': {
                display: 'block',
                width: '100%',
                background: 'linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55)',
                backgroundSize: '24em .25em',
                boxShadow: '-4px 5px 24px 0px rgba(176, 14, 78, 1)',
                transition: 'all 0.2s ease-out',
                transform: 'translate3d(-100%, 0, 0)',
            },

            '& $buffering': {
                width: '100%',
                background: colors.randomGradient(),
                backgroundPosition: 0,
                opacity: .2,
                transform: 'translate3d(-100%, 0, 0)',
                transition: 'transform .2s ease-out',
            },
        },

        playing: {},
        buffering: {},

        controls: {
            '& i': {
                display: 'inline-block',
                height: 24,
                width: 24,
                marginRight: 32,
                fontSize: 20,
                color: '#000',
                transform: 'translateY(-12px)',
                cursor: 'pointer',
                transition: '.2s',

                '&:hover': {
                    color: colors.pallet.primary,
                    textShadow: `0 0 24px ${colors.pallet.dribbble}`,
                }
            },

            '& i$liked': {
                color: colors.pallet.grape,
                textShadow: `0 0 24px ${colors.pallet.grape}`,
            }
        },

        liked: {},
    };
};
