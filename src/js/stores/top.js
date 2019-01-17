
import { observable, action } from 'mobx';
import axios from 'axios';

class Top {
    @observable loading = true;
    @observable list = [];

    @action async getList() {
        self.loading = true;

        var response = await axios.get('/api/top');

        self.list = response.data.list;
        self.loading = false;
    }
}

const self = new Top();
export default self;
