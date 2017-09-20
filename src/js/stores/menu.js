
import { observable, action } from 'mobx';

class Menu {
    @observable show = false;

    @action toggle(show = !self.show) {
        self.show = show;
    }
}

const self = new Menu();
export default self;
