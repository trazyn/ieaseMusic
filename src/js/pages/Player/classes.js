
import colors from 'utils/colors';

export default theme => ({
    container: {
        background: '#fff',
    },

    hero: {
        position: 'relative',
        display: 'flex',
        height: 260,
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: '.4s',
    },

    cover: {
        height: 260,
        width: 260,
    },

    summary: {
        position: 'absolute',
        right: 0,
        top: 30,
        textAlign: 'right',

        '& $title span, & $author span, & $subtitle span': {
            padding: '10px 20px',
            margin: 0,
            background: '#000',
            color: '#fff',
        },
    },

    title: {
        fontSize: 20,

        '& span': {
            display: '-webkit-box',
            maxWidth: 240,
            lineHeight: '30px',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
        }
    },

    author: {
        '& a': {
            display: 'inline-block',
            color: '#fff',
            paddingBottom: 2,
            borderBottom: 'thin solid rgba(255, 255, 255, 0)',
            transition: '.2s',

            '&:hover': {
                borderBottomColor: '#fff',
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

    subtitle: {
        fontSize: 12,
        textTransform: 'uppercase',
    },

    play: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: 44,
        width: 44,
        marginTop: -22,
        marginLeft: -22,
        lineHeight: '44px',
        borderRadius: 44,
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        cursor: 'pointer',
        transition: '.2s',

        '&:hover': {
            color: colors.randomColor()
        },
    },

    recommend: {
        position: 'absolute',
        left: 260,
        top: 0,
        height: 260,
        width: 260 / 3 * 3,
        boxSizing: 'border-box',
        zIndex: 99,

        '& img:first-of-type': {
            filter: 'grayscale(100%)',
            transition: '.3s ease-in-out',
        },

        '& a': {
            padding: 0,
            margin: 0,
            boxSizing: 'border-box',
            marginTop: -2,
        },

        '& a:hover img:first-of-type': {
            filter: 'grayscale(0)',
        },
    },

    body: {
        display: 'flex',
        height: 'calc(100vh - 260px - 50px)'
    },

    people: {
        display: 'flex',
        height: 'calc(100% - 48px)',
        width: 240,
        justifyContent: 'space-around',
        flexDirection: 'column',
        padding: '24px 0',
        paddingLeft: 20,

        '& img': {
            width: 36,
            height: 36,
            marginRight: 10,
            marginBottom: 4,
            borderRadius: 32,
        },

        '& h3': {
            marginTop: 0,
            marginBottom: 12,
            fontSize: 14,
            fontFamily: 'Roboto',
            fontWeight: 'lighter',
            color: '#4a4a4a',
            textTransform: 'uppercase',
            letterSpacing: 1,
            wordSpacing: 3,
        }
    },

    list: {
        flex: 1,
        fontFamily: 'Roboto',
        color: '#a2a2a2',

        '& header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 40,
            lineHeight: '40px',
            borderBottom: 'thin solid #a2a2a2',

            '& span': {
                width: 67.5,
                borderBottom: '2px solid #000',
                fontFamily: 'Roboto',
                textTransform: 'uppercase',
                letterSpacing: 1,
            },

            '& span:first-child': {
                width: 120,
                textAlign: 'right',
                transition: '.2s',
                cursor: 'pointer',

                '&:hover': {
                    color: colors.pallet.primary,
                }
            },

            '& span:last-child': {
                textAlign: 'left',
            },
        },

        '& ul': {
            height: 'calc(100vh - 260px - 50px - 40px)',
            padding: 0,
            margin: 0,
            listStyle: 'none',
            overflow: 'hidden',
            overflowY: 'auto',
        },

        '& li': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 32,
            lineHeight: '32px',
            cursor: 'pointer',
            transition: '.2s',

            '& i': {
                position: 'absolute',
                left: -32,
                top: 0,
                display: 'inline-block',
                height: 32,
                width: 32,
                color: '#fff',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #1cd8d2, #93edc7)',
                boxShadow: '0 0 24px 0 #48cfad',
            },

            '&:not($active):hover': {
                transform: 'translateX(32px)',
            },

            '&$active i': {
                left: 0,
                width: 60,
                background: 'linear-gradient(to left, #ff512f, #dd2476)',
                boxShadow: '0 0 24px 0 #ea4c89',
            }
        },
    },

    active: {},

    index: {
        display: 'inline-block',
        width: 60,
        textAlign: 'center',
    },

    time: {
        display: 'inline-block',
        width: 60,
        fontSize: 12,
    },

    name: {
        flex: .8,
        fontSize: 13,
        color: '#654b58',
        letterSpacing: .5,
        wordSpacing: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: 248,
    },

    nothing: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        fontFamily: 'HelveticaNeue-UltraLight',
        fontSize: 24,
        letterSpacing: 1,
        wordSpacing: 3,
        color: '#000',
    }
});
