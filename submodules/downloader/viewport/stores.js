
import { observable, action, transaction } from 'mobx';
import storage from 'common/storage';
import { ipcRenderer, remote } from 'electron';

const KEY = 'downloaded';

class Stores {
    @observable tasks = new Map();
    @observable playlist = [];

    @action.bound
    load = async() => {
        try {
            var persistence = await storage.get(KEY);

            transaction(() => {
                Object.keys(persistence).map(
                    e => this.tasks.set(e, persistence[e])
                );
            });
        } catch (ex) {
            storage.remove(KEY);
            this.tasks.clear();
        }
    }

    save = () => {
        var persistence = {};
        var items = Array.from(this.tasks.entries());

        items.map(
            ([key, value]) => {
                if (value.progress === 1 || value.success === false) {
                    persistence[key] = value;
                }
            }
        );
        storage.set(KEY, persistence);
    }

    isPersistence = (task) => {
        return (this.tasks.get(task.id) || {}).success;
    }

    @action.bound
    updateTask = (task) => {
        // You can not repeat an inprogress task
        var exists = this.tasks.get(task.id);
        if (exists && task.waiting === true) {
            return;
        }
        this.tasks.set(task.id, task);
    }

    @action.bound
    batchTask = (tasks) => {
        transaction(() => {
            tasks.map(
                task => this.updateTask(task)
            );
        });
    }

    @action.bound
    doneTask = (task) => {
        this.updateTask(task);
        this.save();
    }

    @action.bound
    removeTasks = (items) => {
        items = Array.isArray(items) ? items : [items];

        items.forEach(
            e => {
                this.tasks.delete(e.id);
            }
        );
        this.save();
    }

    @action.bound
    getPlaylist = () => {
        return new Promise(
            (resolve, reject) => {
                var timer = setTimeout(
                    () => resolve(false),
                    5000
                );

                ipcRenderer.once('response-playlist', (e, data) => {
                    clearTimeout(timer);
                    data = JSON.parse(data);
                    this.playlist = data.songs;
                    resolve(true);
                });

                remote.getGlobal('mainWindow').webContents.send('request-playlist');
            }
        );
    }
};

export default new Stores();
