
import React, { Component } from 'react';
import injectSheet from 'react-jss';

import classes from './classes';

class Indicator extends Component {
    render() {
        var classes = this.props.classes;

        return (
            <div className={classes.container}>
                <span />
                <span />
                <span />
                <span />
            </div>
        );
    }
}

export default injectSheet(classes)(Indicator);
