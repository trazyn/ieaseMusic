
import colors from 'utils/colors';

export default theme => {
    return {
        container: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100vw',
            height: 65,
            zIndex: 100,
            background: 'rgba(255,255,255,0.95)',
            color: '#000',

            '& section': {
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
            },

            '& aside': {
                display: 'flex',
                paddingLeft: 15,
                paddingRight: 15,
                flex: '1 0 20vw',
                justifyContent: 'space-between',
                alignItems: 'center',

                '& p': {
                    margin: 0,
                    padding: 0,
                }
            }
        },
        cover: {
            margin: '0 5px'
        },
        timeLabel: {
            fontSize: 11,
            color: '#4a4a4a',
        },
        processBar: {
            height: 4,
            margin: '8px auto',
            width: 'calc(100% - 10px)',
            display: 'block',
            '&>.rangeslider__handle': {
                width: '10px',
                height: '10px',
                userSelect: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.22)',
                outline: 'none',
                '&:after': {
                    width: 6,
                    height: 6,
                    top: 2,
                    left: 2,
                    backgroundColor: '#7cb342',
                    boxShadow: 'none'
                }
            },
        },
        bar: {
            width: 'calc(100% - 30px)',
            cursor: 'pointer',
            height: 10,
            position: 'relative',
            overflow: 'hidden',
            background: '#ddd',

            '&>$playing, &>$buffering': {
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: 10,
                zIndex: 100,
            },

            '& $playing': {
                width: '100%',
                background: 'linear-gradient(to right,#62efab 5%,#f2ea7d 15%,#f2ea7d 25%,#ff8797 35%,#ff8797 45%,#e1a4f4 55%,#e1a4f4 65%,#82fff4 75%,#82fff4 85%,#62efab 95%)',
                backgroundSize: '200%',
                backgroundPosition: 0,
                zIndex: 1,
                transform: 'translate3d(-100%, 0, 0)',
                transition: 'transform .2s ease-out',
            },

            '& $playing:after': {
                content: 'attr(data-time)',
                position: 'absolute',
                right: 0,
                bottom: 2,
                display: 'inline-block',
                padding: '10px 6px',
                fontFamily: 'Roboto',
                fontSize: 12,
                color: '#fff',
                background: '#000',
                whiteSpace: 'nowrap',
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
        centerBar: {
            flex: '1 0 36vw',
            '-webkit-app-region': 'no-drag',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        info: {
            width: 'calc(100% - 10px)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '5px',
            '&>div:first-child': {
                flex: '1 0 80%',
            },
            '&>div:first-child>p': {
                display: 'inline',
                padding: '0 3px',
            },
            '&>a': {
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
            '& a': {
                paddingBottom: 1,
                maxWidth: 400,
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
            maxWidth: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',

            '& a': {
                color: '#4a4a4a',

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
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
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
                color: theme.controller.hoverColor,
            },

            '& i$liked': {
                color: colors.pallet.grape,
                textShadow: `0 0 24px ${colors.pallet.grape}`,
            },
            '&>svg': {
                margin: '0 3px'
            },
            '& .loopMode': {
                '&>path': {
                    visibility: 'hidden'
                },
                '&>path.show': {
                    visibility: 'visible'
                }
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

        liked: {},

        mode: {
            color: '#4a4a4a',
        },

        controls: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 10px',
            color: '#000',
        },

        toggle: {
            '& i': {
                color: '#9b9b9b',
            }
        },
    };
};
