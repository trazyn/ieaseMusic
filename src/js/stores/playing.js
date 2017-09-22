
import { observable, action } from 'mobx';

class Playing {
    @observable show = false;

    @action toggle(show = !self.show) {
        self.show = show;
    }
}

const self = new Playing();
export default self;
