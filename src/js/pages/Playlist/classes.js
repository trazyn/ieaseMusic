
import perdido from 'perdido';

import colors from 'utils/colors';
import preferences from 'stores/preferences';

function getBackgrounds(theme) {
    var backgrounds = {};

    theme.map(
        (e, index) => {
            var rule = `&[data-type="${encodeURIComponent(e.type)}"]:before`;
            var background = preferences.backgrounds[index].background || e.background;

            backgrounds[rule] = {
                'background-image': background ? `url(${background})` : 'none',
            };
        }
    );

    return backgrounds;
}

export default theme => ({
    container: {
        paddingTop: 40,
        background: colors.randomGradient(),

        ...getBackgrounds(theme.playlist.backgrounds),

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
        height: 'calc(100vh - 110px)',
        padding: 0,
        margin: 0,
        width: 180,
        paddingTop: 20,
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
            boxShadow: '0 0 24px 0 rgba(255, 255, 255, 1)',
            whiteSpace: 'nowrap',
        }
    },

    list: {
        ...perdido.utils.clearFix,
        width: 'calc(100vw - 200px)',
        height: 'calc(100vh - 110px)',
        paddingLeft: 20,
        paddingTop: 20,
        overflow: 'hidden',
        overflowY: 'auto',
    },

    item: {
        ...perdido.column('1/2', { gutter: '10px' }),
        display: 'flex',
        marginBottom: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',

        '& figure': {
            marginRight: 14,
            border: 'thin solid #000',
            transition: '.2s',

            '&:hover': {
                boxShadow: '0 0 24px 0 rgba(255, 255, 255, 1)'
            }
        },

        '&$playing figure': {
            boxShadow: `0 0 24px 0 ${colors.pallet.primary}`
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
    },

    playing: {},
    loadmore: {},
});
