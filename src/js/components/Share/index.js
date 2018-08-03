
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, ModalBody } from 'ui/Modal';
import { shell } from 'electron';
import injectSheet, { ThemeProvider } from 'react-jss';
import qrcode from 'qrcode-js';

import classes from './classes';
import theme from 'config/theme';

@inject('share', 'controller')
@observer
class Share extends Component {
    close() {
        this.props.share.toggle(false);
    }

    renderContent() {
        var { classes, controller: { song } } = this.props;
        var url = `https://music.163.com/#/song?id=${song.id}`;
        var text = `${song.name} - ${song.artists.map((e, index) => e.name).join()}`;

        return (
            <div className={classes.container}>
                <main>
                    <summary>
                        <h2>Share</h2>

                        <p>
                            {text}
                        </p>
                    </summary>

                    <section>
                        <a
                            href=""
                            onClick={
                                e => {
                                    e.preventDefault();
                                    shell.openExternal(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
                                    this.close();
                                }
                            }
                        >
                            <img
                                alt="Twitter"
                                className={classes.social}
                                src="assets/social-twitter.png"
                            />
                        </a>

                        <a
                            href=""
                            onClick={
                                e => {
                                    e.preventDefault();
                                    shell.openExternal(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                                    this.close();
                                }
                            }
                        >
                            <img
                                alt="Facebook"
                                className={classes.social}
                                src="assets/social-facebook.png"
                            />
                        </a>

                        <a
                            href=""
                            onClick={
                                e => {
                                    e.preventDefault();
                                    shell.openExternal(`https://plus.google.com/share?url=${encodeURIComponent(url)}`);
                                    this.close();
                                }
                            }
                        >
                            <img
                                alt="Google"
                                className={classes.social}
                                src="assets/social-google.png"
                            />
                        </a>
                    </section>

                    <figure className={classes.qrcode}>
                        <img
                            ref={ele => {
                                if (!ele) return;
                                var base64 = qrcode.toDataURL(url);
                                ele.src = base64;
                            }}
                        />

                        <figcaption>
                            WeChat
                        </figcaption>
                    </figure>

                    <a
                        href=""
                        className={classes.close}
                        onClick={
                            e => {
                                e.preventDefault();
                                this.close();
                            }
                        }
                    >
                        <img
                            alt="Close Menus"
                            className={classes.close}
                            src="assets/close.png"
                        />
                    </a>
                </main>
            </div>
        );
    }

    render() {
        var { classes, share, controller: { song } } = this.props;

        if (!song.id) {
            return false;
        }

        return (
            <Modal
                show={share.show}
            >
                <ModalBody
                    className={classes.modal}
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

export default injectSheet(classes)(Share);
