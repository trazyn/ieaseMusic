
import React, { Component } from 'react';
import injectSheet from 'react-jss';

import classes from './classes';

class Switch extends Component {
    render() {
        var { classes, id, checked, onChange } = this.props;

        return (
            <span className={classes.container}>
                <input
                    checked={checked}
                    id={id}
                    type="checkbox"
                    onChange={onChange} />
                <span className={classes.fake} />
            </span>
        );
    }
}

export default injectSheet(classes)(Switch);
