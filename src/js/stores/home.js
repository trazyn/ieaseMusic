
import { observable, action } from 'mobx';
import axios from 'axios';

import me from './me';
import preferences from './preferences';
import controller from './controller';

class Home {
    @observable loading = true;
    @observable list = [];

    @action async getList() {
        self.loading = true;

        var res;

        if (me.hasLogin()) {
            res = await axios.get(`/home/${me.profile.userId}`);

            // Save the songs of red heart
            me.rocking(res.data.list[0]);
            // Play the recommend songs
            controller.setup(res.data.list[1]);

            if (preferences.autoPlay) {
                controller.play();
            } else {
                controller.song = controller.playlist.songs[0];
            }
        } else {
            res = await axios.get(`/home`);
        }

        self.loading = false;
        self.list = res.data.list;

        // Just call once for init player
        self.getList = Function;

        return self.list;
    }
}

const self = new Home();
export default self;
