
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

import classes from './classes';

class Search extends Component {
    static propsTypes = {
        show: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
    };

    render() {
        var { classes, show, close, filter, children } = this.props;

        if (!show) {
            return false;
        }

        return (
            <div className={classes.container}>
                <header>
                    <input
                        autoFocus={true}
                        type="text"
                        onInput={e => filter(e.target.value)}
                        placeholder="Search..." />
                    <img
                        alt="Close"
                        className={classes.close}
                        onClick={close}
                        src="assets/close.png" />
                </header>

                <div className={classes.list}>
                    {children}
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Search);
