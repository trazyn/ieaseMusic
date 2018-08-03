
import React, { Component } from 'react';
import { Modal, ModalBody } from 'ui/Modal';
import injectSheet, { ThemeProvider } from 'react-jss';
import PropTypes from 'prop-types';

import classes from './classes';
import theme from 'config/theme';

class Confirm extends Component {
    static propTypes = {
        showConfirm: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string,
    };

    static defaultProps = {
        title: 'Are You Sure?',
        show: false
    };

    state = {
        show: false
    };

    // Promise resolve and reject
    ok;
    cancel

    show() {
        this.setState({ show: true });

        return new Promise(
            (resolve, reject) => {
                var close = (returned) => {
                    this.setState({ show: false });
                    resolve(returned);
                };

                this.ok = () => close(true);
                this.cancel = () => close(false);
            }
        );
    }

    componentDidMount() {
        this.props.showConfirm(
            () => this.show()
        );
    }

    renderContent() {
        var { classes, title, message } = this.props;

        return (
            <div className={classes.container}>
                <h2>
                    {title}
                </h2>

                {
                    message
                        ? (<p>{message}</p>)
                        : false
                }

                <footer className={classes.action}>
                    <button
                        className={classes.ok}
                        onClick={e => this.ok()}
                    >
                        I'm Sure
                    </button>

                    <button
                        className={classes.cancel}
                        onClick={e => this.cancel()}
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        );
    }

    render() {
        return (
            <Modal
                show={this.state.show}
            >
                <ModalBody
                    className={this.props.classes.modal}
                >

                    <ThemeProvider theme={theme}>
                        {
                            this.renderContent()
                        }
                    </ThemeProvider>
                </ModalBody>
            </Modal>
        );
    }
}

export default injectSheet(classes)(Confirm);
