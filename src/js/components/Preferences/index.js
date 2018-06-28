
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, ModalBody } from 'ui/Modal';
import injectSheet, { ThemeProvider } from 'react-jss';
import theme from 'app/theme';

import classes from './classes';
import Options from './Options';

@inject(['preferences'])
@observer
class Preferences extends Component {
    close() {
        this.props.preferences.show = false;
    }

    render() {
        var { classes, preferences } = this.props;

        return (
            <Modal
                show={preferences.show}
                onCancel={() => this.close()}
            >
                <ModalBody
                    className={classes.modal}
                >
                    <ThemeProvider theme={theme}>
                        <Options
                            {...{
                                preferences,
                                close: () => this.close()
                            }}
                        />
                    </ThemeProvider>,
                </ModalBody>
            </Modal>
        );
    }
}

export default injectSheet(classes)(Preferences);
