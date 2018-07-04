
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import clazz from 'classname';
import Transition from 'react-transition-group/CSSTransitionGroup';

import './classes.css';

function on(el, events, fn) {
    (el && events && fn)
        && events.split().forEach(e => el.addEventListener(e, fn, false));
}

function off(el, events, fn) {
    (el && events && fn)
        && events.split().forEach(e => el.removeEventListener(e, fn, false));
}

class TransitionPortal extends Component {
    ele;

    componentDidMount() {
        this.ele = document.createElement('div');
        document.body.appendChild(this.ele);
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        ReactDOM.render(
            <Transition {...this.props}>
                {
                    this.props.children
                }
            </Transition>,
            this.ele
        );
    }

    componentWillUnmount() {
        document.body.removeChild(this.ele);
    }

    render() {
        return null;
    }
}

class ModalBody extends Component {
    render() {
        return (
            <Transition
                transitionName="fade"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
            >
                <div className={clazz('Modal-body', this.props.className)}>
                    {this.props.children}
                </div>
            </Transition>
        );
    }
};

class ModalHeader extends Component {
    render() {
        return (
            <div className={clazz('Modal-header', this.props.className)}>
                {this.props.children}
            </div>
        );
    }
}

class Modal extends Component {
    static propTypes = {
        show: PropTypes.bool,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        onCancel: () => {}
    };

    renderOverlay() {
        if (!this.props.show) {
            return;
        }

        return (
            <div
                className="Modal-overlay"
                onClick={this.props.onCancel}
            />
        );
    }

    renderBody() {
        if (!this.props.show) {
            return;
        }

        return (
            <div className="Modal-content">
                {this.props.children}
            </div>
        );
    }

    handleEscKey(e) {
        if (e.keyCode === 27 && this.props.show) {
            this.props.onCancel();
        }
    }

    componentWillUnmount() {
        off(document, 'keydown', this.handleEscKey);
    }

    componentDidMount() {
        this.handleEscKey = this.handleEscKey.bind(this);
        on(document, 'keydown', this.handleEscKey);
    }

    render() {
        document.body.style.overflow = this.props.show ? 'hidden' : null;

        return (
            <div>
                <Transition
                    transitionName="Modal-overlay"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    {this.renderOverlay()}
                </Transition>

                <TransitionPortal
                    transitionName="Modal-body"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={140}
                >
                    {this.renderBody()}
                </TransitionPortal>
            </div>
        );
    }
};

export { Modal, ModalBody, ModalHeader };
