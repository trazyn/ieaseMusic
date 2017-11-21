import React, { Component } from 'react';
import ListHub from './ListHub';

export default class Collection extends Component {
    state = {}
    componentDidMount() {
        const app = document.getElementById('main-collection');
        new ListHub(app).init();
    }
    render() {
        return (
            <div id="main-collection">
                .
            </div>
        );
    };
};
