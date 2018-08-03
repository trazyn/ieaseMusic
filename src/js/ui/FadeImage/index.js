
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

class FadeImage extends Component {
    static propTypes = {
        src: PropTypes.string,
        fallback: PropTypes.string,
    };

    static defaultProps = {
        fallback: 'https://source.unsplash.com/random',
    };

    componentWillReceiveProps(nextProps) {
        var ele = this.image;

        if (ele
            && this.props.src !== nextProps.src) {
            ele.classList.add(nextProps.classes.fadein);
        }
    }

    handleError(e) {
        e.target.src = this.props.fallback;
    }

    handleLoad(e) {
        e.target.classList.remove(this.props.classes.fadein);
    }

    render() {
        var classes = this.props.classes;

        if (!this.props.src) return false;

        return (
            <img
                ref={
                    ele => (this.image = ele)
                }
                src={this.props.src}
                className={clazz(classes.fade, classes.fadein, this.props.className)}
                onLoad={e => this.handleLoad(e)}
                onError={e => this.handleError(e)} />
        );
    }
}

export default injectSheet(classes)(FadeImage);
