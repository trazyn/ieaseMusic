
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import clazz from 'classname';

import colors from 'utils/colors';
import classes from './classes';

class Loader extends Component {
    static propTypes = {
        show: PropTypes.bool,
    };

    static defaultProps = {
        show: false,
    };

    render() {
        var classes = this.props.classes;

        if (!this.props.show) {
            return false;
        }

        return (
            <div
                className={clazz(classes.container, {
                    [classes.show]: this.props.show,
                })}
            >
                {
                    /**
                    Square loader
                    https://codepen.io/tashfene/pen/raEqrJ?editors=1100
                     * */
                }
                <div
                    className={
                        clazz(classes.loader, classes.animationLoader)
                    }
                >
                    <span
                        onAnimationIteration={
                            e => {
                                e.target.style.backgroundColor = colors.randomColor();
                            }
                        }
                        className={
                            clazz(classes.inner, classes.animationInner)
                        }
                    />
                </div>
            </div>
        );
    }
}

export default injectSheet(classes)(Loader);
