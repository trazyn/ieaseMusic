
import { observable, action } from 'mobx';
import storage from 'utils/storage';

class Downloader {
    @observable tasks = [];

    @action load() {
        self.tasks = storage.get('tasks');
    }
}

const self = new Downloader();
export default self;
