
import { observable, action } from 'mobx';
import axios from 'axios';

import me from './me';
import preferences from './preferences';
import controller from './controller';

class Home {
    @observable loading = true;
    @observable list = [];

    @action async load() {
        var res;

        if (me.hasLogin()) {
            res = await axios.get(`/api/home/${me.profile.userId}`);

            // Save the songs of red heart
            me.rocking(res.data.list[0]);
            // Play the recommend songs
            controller.setup(res.data.list[1]);
        } else {
            res = await axios.get(`/api/home`);
            controller.setup(res.data.list[0]);
        }

        if (preferences.autoPlay) {
            controller.play();
        } else {
            controller.song = controller.playlist.songs[0];
        }

        self.list = res.data.list;

        return self.list;
    }

    @action async getList() {
        self.loading = true;

        await self.load();

        // Just call once for init player
        self.getList = Function;
        self.loading = false;
    }
}

const self = new Home();
export default self;
