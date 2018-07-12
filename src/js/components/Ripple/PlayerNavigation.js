
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import injectSheet from 'react-jss';

import classes from './classes';

class PlayerNavigation extends Component {
    state = {
        // true: prev, false: next
        direction: true,
    };

    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        this.container.classList.add(this.props.classes.animated);
    }

    animationDone() {
        this.shouldUpdate = false;
        this.container.classList.remove(this.props.classes.animated);
    }

    shouldComponentUpdate() {
        return !!this.shouldUpdate;
    }

    componentDidMount() {
        ipcRenderer.on('player-previous', () => {
            this.shouldUpdate = true;
            this.setState({
                direction: true,
            });
        });

        ipcRenderer.on('player-next', () => {
            this.shouldUpdate = true;
            this.setState({
                direction: false,
            });
        });
    }

    render() {
        var classes = this.props.classes;

        return (
            <div
                className={classes.container}
                onAnimationEnd={() => this.animationDone()}
                ref={
                    ele => (this.container = ele)
                }
            >
                {
                    this.state.direction
                        ? <i className="ion-ios-rewind" />
                        : <i className="ion-ios-fastforward" />
                }
            </div>
        );
    }
}

export default injectSheet(classes)(PlayerNavigation);
