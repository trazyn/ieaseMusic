
import { observable, action, autorun } from 'mobx';
import storage from 'common/storage';
import { ipcRenderer } from 'electron';

const KEY = 'downloaded';

class Stores {
    @observable tasks = [];
    @observable mapping = {};
    @observable playlist = [];

    constructor() {
        autorun(
            () => {
                var mapping = this.mapping;
                var tasks = [];

                tasks = Object.keys(mapping).map(
                    (e, index) => {
                        return mapping[e];
                    }
                );

                tasks.sort((a, b) => a.date < b.date);
                this.tasks = tasks;
            },
            { delay: 500 }
        );
    }

    @action.bound
    load = async() => {
        try {
            var mapping = await storage.get(KEY);
            this.mapping = mapping;
        } catch (ex) {
            storage.remove(KEY);
            this.mapping = {};
        }
    }

    @action.bound
    updateTask = (task) => {
        this.mapping[task.id] = task;
    }

    @action.bound
    doneTask = (task) => {
        var mapping = {};

        this.updateTask(task);

        this.tasks.map(
            e => {
                if (e.progress === 1) {
                    mapping[e.id] = e;
                }
            }
        );

        // Immediate modify the object without delay, then save to storage
        mapping[task.id] = task;
        storage.set(KEY, mapping);
    }

    @action.bound
    removeTasks = (items) => {
        items = Array.isArray(items) ? items : [items];

        items.forEach(
            e => {
                delete this.mapping[e.id];
            }
        );
        storage.set(KEY, this.mapping);
    }

    @action.bound
    failTask = (task) => {
        this.mapping[task.id] = task;
        storage.set(KEY, this.mapping);
    }

    @action.bound
    getPlaylist = () => {
        ipcRenderer.removeListener('request-playlist');

        return new Promise(
            (resolve, reject) => {
                var timer = setTimeout(
                    () => resolve(false),
                    1000
                );

                ipcRenderer.once('response-playlist', e => {
                    this.playlist = e.args;
                    clearTimeout(timer);
                    resolve(true);
                });

                ipcRenderer.send('request-playlist');
            }
        );
    }
};

export default new Stores();
