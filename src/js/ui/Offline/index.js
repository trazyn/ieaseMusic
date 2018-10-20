
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

import classes from './classes';
class Offline extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    };
    state = {
        offline: false,
    };
    componentDidMount() {
        window.addEventListener('offline', () => {
            this.setState({
                offline: true,
            });
        });

        window.addEventListener('online', () => {
            this.setState({
                offline: false,
            });
        });
    }
    render() {
        var { classes, show } = this.props;
        if (!show) {
            return false;
        }
        if (!this.state.offline) {
            return (
                <div className={classes.container}>
                    <h1>Opps, seems like you are offline...</h1>
                </div>);
        }
    }
}

export default injectSheet(classes)(Offline);
