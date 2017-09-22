
import axios from 'axios';

import me from './me';
import menu from './menu';
import home from './home';
import user from './user';
import controller from './controller';
import player from './player';
import artist from './artist';
import top from './top';
import playlist from './playlist';
import fm from './fm';
import playing from './playing';

const stores = {
    me,
    menu,
    home,
    user,
    controller,
    player,
    artist,
    top,
    playlist,
    fm,
    playing,
};

axios.defaults.baseURL = 'http://localhost:8000';

export default stores;
