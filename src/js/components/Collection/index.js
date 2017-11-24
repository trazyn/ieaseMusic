import React, { Component } from 'react';
import ListHub from './ListHub';

class Collection extends Component {
    componentDidMount() {
        this.detect = setInterval(() => {
            if (!this.props.loading) {
                if (typeof this.props.playlist[0] !== 'undefined') {
                    clearInterval(this.detect);
                    const ele = document.getElementById('main-collection');
                    this.pixiApp = new ListHub(ele, this.props.playlist);
                }
            }
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.detect);
    }
    render() {
        return (
            <div id="main-collection" />
        );
    };
};
export default Collection;
