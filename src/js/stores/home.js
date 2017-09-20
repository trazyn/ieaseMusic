
import { observable, action } from 'mobx';
import axios from 'axios';

import me from './me';
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
            me.rocking(res.data.list[0]['songs']);
            // Play the recommend songs
            controller.setup(res.data.list[1]);
            controller.play();
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
