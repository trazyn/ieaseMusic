
import React, { Component } from 'react';
import injectSheet from 'react-jss';

import classes from './classes';

class Switch extends Component {
    render() {
        var { classes, id, defaultChecked, onChange } = this.props;

        return (
            <span className={classes.container}>
                <input
                    defaultChecked={defaultChecked}
                    id={id}
                    type="checkbox"
                    onChange={onChange} />
                <span className={classes.fake} />
            </span>
        );
    }
}

export default injectSheet(classes)(Switch);
