
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';

import classes from './classes';
import FadeImage from 'ui/FadeImage';

@inject('me')
@observer
class QRCode extends Component {
    async pleaseLogin() {
        await this.props.me.qrcode();
        this.props.me.waitQRCodeScan(
            () => {
                this.props.history.replace(+this.props.match.params.fm ? '/fm' : '/');
            }
        );
    }

    tick() {
        clearInterval(this.timer);

        // 5 mins refresh QR Code
        this.timer = setInterval(
            () => {
                this.pleaseLogin();
            },
            5 * 60 * 1000
        );
    }

    refresh() {
        this.pleaseLogin();
        this.tick();
    }

    componentDidMount = () => this.refresh();
    componentWillUnmount = () => clearInterval(this.timer);

    render() {
        var { classes, me: { scaner } } = this.props;

        return (
            <div className={classes.container}>
                <Link
                    className={classes.back}
                    to={`/login/${+this.props.match.params.fm}`}
                >
                    <i className="ion-android-arrow-back" />
                    Login by Phone
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>

                <figure>
                    <div className={classes.wraped}>
                        {
                            scaner.qrcode
                                ? (
                                    <FadeImage
                                        className={classes.qrcode}
                                        src={scaner.qrcode}
                                    />
                                )
                                : (
                                    <img
                                        className={classes.qrcode}
                                        src="assets/qrcode-placeholder.png"
                                    />
                                )
                        }
                    </div>

                    <figcaption>
                        <p>Please use weChat to scan QR code to log in.</p>
                    </figcaption>

                    <a
                        href=""
                        onClick={e => {
                            e.preventDefault();
                            this.refresh();
                        }}
                    >
                        Refresh
                    </a>
                </figure>
            </div>
        );
    }
}

export default injectSheet(classes)(QRCode);
