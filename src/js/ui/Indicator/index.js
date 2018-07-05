
import React, { Component } from 'react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

class Indicator extends Component {
    render() {
        var { classes, className, style } = this.props;

        return (
            <div
                className={
                    clazz(classes.container, className)
                }
                style={style}
            >
                <span />
                <span />
                <span />
                <span />
            </div>
        );
    }
}

export default injectSheet(classes)(Indicator);
