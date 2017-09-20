
import perdido from 'perdido';
import colors from 'utils/colors';

function getBackgrounds(theme) {
    var backgrounds = {};

    theme.map(e => {
        var rule = `&[data-type="${encodeURIComponent(e.type)}"]:before`;
        backgrounds[rule] = {
            'background-image': `url(${e.background})`,
        };
    });

    return backgrounds;
}

export default theme => ({
    container: {
        background: colors.randomGradient(),

        ...getBackgrounds(theme.playlistBackgrounds),

        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            height: '100vh',
            width: '100vw',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: '.2s',
        },

        '&:after': {
            background: 'rgba(0, 0, 0, .5)',
        }
    },

    inner: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 1,
    },

    navs: {
        height: 'calc(100vh - 100px)',
        padding: 0,
        margin: 0,
        width: 180,
        marginTop: 50,
        listStyle: 'none',
        color: '#fff',
        overflow: 'hidden',
        overflowY: 'auto',

        '& li': {
            position: 'relative',
            fontSize: 13,
            paddingRight: 30,
            textAlign: 'right',

            '&:after': {
                content: '""',
                position: 'absolute',
                left: -200,
                top: '50%',
                display: 'block',
                width: 200,
                height: 1,
                background: '#fff',
                opacity: 0,
                visibility: 'hidden',
                transition: '.4s ease-in-out',
                transform: 'translateY(-50%)',
            }
        },

        '& li:not($selected):hover:after': {
            left: -100,
            opacity: 1,
            visibility: 'visible',
        },

        '& a': {
            display: 'inline-block',
            padding: '4px 16px',
            minWidth: 40,
            letterSpacing: 2,
            color: '#fff',
        },
    },

    selected: {
        '& a': {
            background: '#000',
            letterSpacing: 0,
            boxShadow: '4px 8px 16px 0px rgba(255, 255, 255, .5)',
            whiteSpace: 'nowrap',
        }
    },

    list: {
        ...perdido.utils.clearFix,
        width: 'calc(100vw - 200px)',
        height: 'calc(100vh - 100px)',
        paddingLeft: 20,
        marginTop: 50,
        overflow: 'hidden',
        overflowY: 'auto',
    },

    item: {
        ...perdido.column('1/2', { gutter: '10px' }),
        display: 'flex',
        marginBottom: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',

        '& img': {
            width: 64,
            height: 64,
            marginRight: 14,
            border: 'thin solid #000',
            transition: '.2s',

            '&:hover': {
                boxShadow: ' 0 0 24px 0 rgba(0, 0, 0, .5)'
            }
        },

        '& p': {
            margin: 0,
            padding: 0,
            maxWidth: 170,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },

        '& p:nth-child(2)': {
            fontSize: 12,
            margin: '5px 0 1px',

            '& + span': {
                fontFamily: 'Roboto',
                fontSize: 12,
                textTransform: 'uppercase',
            }
        },

        '& aside a': {
            display: 'inline-block',
            color: '#fff',
            paddingBottom: 1,
            borderBottom: 'thin solid transparent',
            transition: '.2s',

            '&:hover': {
                borderBottomColor: '#fff',
            }
        }
    }
});
