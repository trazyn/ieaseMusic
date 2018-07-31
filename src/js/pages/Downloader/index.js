
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';
import delegate from 'delegate';

import classes from './classes';
import ProgressImage from 'ui/ProgressImage';
import colors from 'utils/colors';

@inject('controller')
@observer
class Downloader extends Component {
    state = {
        selected: 'all',
    }

    highlight() {
        var classes = this.props.classes;
        var selected = this.state.selected;
        var eles = this.navs.children;

        Array.from(eles).map(
            e => {
                var key = e.dataset.index;

                if (key !== selected) {
                    e.style.background = '';
                    e.classList.remove(classes.selected);
                    return;
                }

                e.style.background = colors.randomGradient();
                e.classList.add(classes.selected);
            }
        );
    }

    componentDidMount() {
        delegate(
            this.navs, 'a[data-index]', 'click',
            e => {
                e.preventDefault();
                this.setState({ selected: e.target.dataset.index });
            }
        );
    }

    render() {
        var { classes, list = [] } = this.props;

        return (
            <div className={classes.container}>
                <nav
                    ref={ele => {
                        if (!ele) return;

                        this.navs = ele;
                        this.highlight();
                    }}
                >
                    <a data-index="all">All</a>
                    <a data-index="inProgress">In Progress</a>
                    <a data-index="done">Done</a>
                </nav>

                <section>
                    {
                        list.map(
                            (e, index) => {
                                var title = `${e.name} - ${e.artists.map((e, index) => e.name).join()}`;

                                return (
                                    <div
                                        key={index}
                                        className={classes.item}
                                    >
                                        <ProgressImage
                                            {...{
                                                width: 120,
                                                src: e.background.replace(/\?.*/, ''),
                                            }}
                                        />

                                        <aside>
                                            <span className={classes.title}>
                                                {title}
                                            </span>

                                            <div className={classes.progress}>
                                                <div
                                                    className={classes.passed}
                                                    style={{
                                                        width: '13%',
                                                    }}
                                                />
                                            </div>
                                        </aside>
                                    </div>
                                );
                            }
                        )
                    }
                </section>

                <footer>
                    <button
                        onClick={
                            e => {
                                // TODO:
                            }
                        }
                    >
                        <i className="ion-android-open" />
                        Open Folder
                    </button>

                    <button
                        onClick={
                            e => {
                                // TODO:
                            }
                        }
                    >
                        <i className="ion-ios-close" />
                        Clear All
                    </button>
                </footer>
            </div>
        );
    }
}

export default injectSheet(classes)(Downloader);
