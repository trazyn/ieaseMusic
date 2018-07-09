
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

class ProgressImage extends Component {
    static propTypes = {
        src: PropTypes.string,
        thumb: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
        fallback: PropTypes.string,
    };

    static defaultProps = {
        fallback: 'https://source.unsplash.com/random',
    };

    componentWillReceiveProps(nextProps) {
        var container = this.container;
        if (true
            && container
            && nextProps.src !== this.props.src) {
            // Immediate render the new image
            container.classList.remove(this.props.classes.loaded);
        }
    }

    handleError(e) {
        e.target.src = this.props.fallback;
    }

    handleLoad(e) {
        var ele = this.container;
        this.thumb.style.paddingBottom = '0%';

        // Fix bug, sometiems this dom has been destroyed
        if (ele) {
            setTimeout(() => {
                ele.classList.add(this.props.classes.loaded);
            }, 50);
        }
    }

    render() {
        var { classes, className, style, src, thumb, height, width } = this.props;

        if (!src) return false;

        if (!thumb) {
            // Get the thumb image src
            thumb = src.replace(/\?.*$/, '') + '?param=20y20';
        }

        return (
            <figure
                className={clazz(classes.container, className)}
                ref={
                    ele => (this.container = ele)
                }
                style={
                    Object.assign(
                        {
                            height,
                            width,
                        },
                        style
                    )
                }
            >
                <img
                    className={classes.main}
                    onError={e => this.handleError(e)}
                    onLoad={e => this.handleLoad(e)}
                    src={this.props.src}
                    style={{
                        height,
                        width,
                    }}
                />

                <div
                    className={classes.thumb}
                    ref={
                        ele => (this.thumb = ele)
                    }
                    style={{
                        // Use as placeholder, anti reflow
                        paddingBottom: (height / width) * 100 || 0,
                    }}
                >
                    <img
                        {...{
                            src: thumb,
                            style: {
                                height,
                                width,
                            },
                            onLoad(e) {
                                // Default show the gray background, When image has been loaded show the thumb
                                e.target.classList.add(classes.loaded);
                            },
                        }}
                    />
                </div>
            </figure>
        );
    }
}

export default injectSheet(classes)(ProgressImage);
