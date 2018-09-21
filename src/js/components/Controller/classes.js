
import colors from 'utils/colors';

export default theme => {
    return {
        container: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
            height: 50,
            color: '#000',
            background: 'none',
            zIndex: 99,

            '& section': {
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, .5)',
                zIndex: 1,
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
            },
        },

        bar: {
            width: '100vw',
            cursor: 'pointer',
            transition: '.2s',

            '&:hover': {
                '&, & $playing, & $buffering': {
                    height: 16,
                },

                '& $playing:after': {
                    bottom: 16,
                    opacity: 1,
                    visibility: 'visible',
                }
            },

            '&, & $playing, & $buffering': {
                position: 'fixed',
                left: 0,
                bottom: 50,
                height: 2,
            },

            '& $playing': {
                width: '100%',
                background: 'linear-gradient(to right,#62efab 5%,#f2ea7d 15%,#f2ea7d 25%,#ff8797 35%,#ff8797 45%,#e1a4f4 55%,#e1a4f4 65%,#82fff4 75%,#82fff4 85%,#62efab 95%)',
                backgroundSize: '200%',
                backgroundPosition: 0,
                zIndex: 1,
                transform: 'translate3d(-100%, 0, 0)',
                transition: '.2s ease-out',
            },

            '& $playing:after': {
                content: 'attr(data-time)',
                position: 'absolute',
                right: 0,
                bottom: 2,
                display: 'inline-block',
                opacity: 0,
                visibility: 'hidden',
                padding: '10px 6px',
                fontFamily: 'Roboto',
                fontSize: 12,
                color: '#fff',
                background: '#000',
                whiteSpace: 'nowrap',
                transition: '.2s ease-out',
            },

            '& $buffering': {
                width: '100%',
                background: colors.randomGradient(),
                backgroundPosition: 0,
                opacity: .2,
                transform: 'translate3d(-100%, 0, 0)',
                transition: '.2s ease-out',
            },
        },

        playing: {},
        buffering: {},

        cover: {
            height: 32,
            width: 32,
            transition: '.2s',
        },

        info: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            '& a': {
                display: 'inline-block',
                paddingBottom: 2,
                borderBottom: 'thin solid rgba(255, 255, 255, 0)',
                transition: '.2s',

                '&:hover': {
                    borderBottomColor: '#000',
                },
            }
        },

        title: {
            marginBottom: '3px !important',

            '& a': {
                paddingBottom: 1,
                maxWidth: 200,
                fontSize: 13,
                color: '#081600',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }
        },

        author: {
            marginTop: 2,
            fontSize: 11,
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',

            '& a': {
                color: '#000',

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

        action: {
            '& i': {
                display: 'inline-block',
                height: 24,
                width: 24,
                lineHeight: '24px',
                marginRight: 16,
                fontSize: 16,
                color: '#000',
                textAlign: 'center',
                cursor: 'pointer',
                transition: '.2s',
            },

            '& i:hover': {
                color: theme.controller.hoverColor,
            },

            '& i$liked': {
                color: colors.pallet.grape,
                textShadow: `0 0 24px ${colors.pallet.grape}`,
            }
        },

        highquality: {
            display: 'inline-block',
            padding: '2px 6px',
            marginRight: 30,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: 'Roboto',
            fontSize: 12,
            color: colors.pallet.dribbble,
            border: `thin solid ${colors.pallet.dribbble}`,
            textShadow: `0 0 24px ${colors.pallet.dribbble}`,
            transform: 'translateY(-3px)',
            zoom: .8,
        },

        liked: { },

        mode: {
            color: '#000',
        },

        text: {
            display: 'inline-block',
            padding: '2px 4px',
            marginRight: 20,
            borderTop: 'thin solid #333',
            borderBottom: 'thin solid #333',
            fontSize: 11,
            color: 'inherit',
            textTransform: 'uppercase',
            transform: 'translateY(-2px)',
            cursor: 'pointer',
            transition: '.2s',

            '&:hover': {
                color: theme.controller.hoverColor,
                borderColor: theme.controller.hoverColor,
            }
        },

        controls: {
            display: 'inline-block',
            marginLeft: 16,
            color: '#000',
        },

        toggle: {
            '& i': {
                color: 'rgba(0, 0, 0, .5)',
            }
        },
    };
};
