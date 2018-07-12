
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import injectSheet from 'react-jss';

import classes from './classes';
import { PLAYER_LOOP, PLAYER_SHUFFLE, PLAYER_REPEAT } from 'stores/controller';

@inject(stores => ({
    mode: stores.controller.mode,
}))
@observer
class PlayerMode extends Component {
    componentWillUpdate() {
        this.animationDone();
    }

    componentDidUpdate() {
        this.container.classList.add(this.props.classes.animated);
    }

    animationDone() {
        this.container.classList.remove(this.props.classes.animated);
    }

    renderIndicator(mode) {
        switch (mode) {
            case PLAYER_SHUFFLE:
                return <i className="ion-ios-shuffle-strong" />;

            case PLAYER_REPEAT:
                return <i className="ion-ios-infinite" />;

            case PLAYER_LOOP:
                return <i className="ion-ios-loop-strong" />;
        }
    }

    render() {
        var { classes, mode } = this.props;

        return (
            <div
                className={classes.container}
                onAnimationEnd={() => this.animationDone()}
                ref={
                    ele => (this.container = ele)
                }
            >
                {
                    this.renderIndicator(mode)
                }
            </div>
        );
    }
}

export default injectSheet(classes)(PlayerMode);
