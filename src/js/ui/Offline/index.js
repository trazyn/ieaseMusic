
import React, { Component, PropTypes } from 'react';
import injectSheet from 'react-jss';

import classes from './classes';

class Offline extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    };

    render() {
        var { classes, show } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div className={classes.container}>
                <h1>Opps, seems like you are offline...</h1>

                <button onClick={e => window.location.reload()}>Reload</button>
            </div>
        );
    }
}

export default injectSheet(classes)(Offline);
