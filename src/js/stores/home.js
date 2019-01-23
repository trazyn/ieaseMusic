
import { observable, action } from 'mobx';
import axios from 'axios';
import { CronJob } from 'cron';

import helper from 'utils/helper';
import me from './me';
import preferences from './preferences';
import controller from './controller';

class Home {
    @observable loading = true;
    @observable list = [];

    constructor() {
        // eslint-disable-next-line
        new CronJob('00 05 06 * * *', () => {
            // Every 6:05 refresh daily playlist, #331
            self.load();
        }).start();
    }

    @action async load() {
        var res;

        if (me.hasLogin()) {
            res = await axios.get(`/api/home/${me.profile.userId}`);

            let favorite = res.data.list[0];
            let recommend = res.data.list[1];

            // Save the songs of red heart
            me.rocking(favorite);

            if (favorite.size) {
                controller.setup(favorite);
            } else if (recommend.size) {
                // Play the recommend songs
                controller.setup(recommend);
            } else {
                // Some user no favorite and recommend, set a fallback playlist
                controller.setup(res.data.list[2]);
            }
        } else {
            res = await axios.get(`/api/home`);
            controller.setup(res.data.list[0]);
        }

        if (preferences.autoPlay) {
            controller.play();
        } else {
            controller.song = controller.playlist.songs[0];
        }

        res.data.list.map(e => (e.pallet = false));

        self.list = res.data.list;

        // Get the color pallets
        self.list.map(async(e, index) => {
            if (!e.cover) return;

            var pallet = await helper.getPallet(e.cover.replace(/\?param=.*/, '') + '?param=20y20');
            e.pallet = pallet;

            // Force update list
            self.updateShadow(e, index);
        });

        return self.list;
    }

    @action async getList() {
        self.loading = true;

        await self.load();

        // Just call once for init player
        self.getList = Function;
        self.loading = false;
    }

    @action updateShadow(e, index) {
        self.list = [
            ...self.list.slice(0, index),
            e,
            ...self.list.slice(index + 1, self.list.length),
        ];
    }
}

const self = new Home();
export default self;
