
import React, { Component, PropTypes } from 'react';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

class Loader extends Component {
    static propTypes = {
        show: PropTypes.bool,
        text: PropTypes.string,
    };

    static defaultProps = {
        show: false,
        text: 'Please Wati...',
    };

    render() {
        var classes = this.props.classes;

        return (
            <div
                className={clazz(classes.container, {
                    [classes.show]: this.props.show,
                })}>
                <span>{this.props.text}</span>
            </div>
        );
    }
}

export default injectSheet(classes)(Loader);
