
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';

@inject(stores => ({
    login: stores.me.login,
    logining: stores.me.logining,
}))
@observer
class Legacy extends Component {
    state = {
        showError: false,
    }

    async doLogin() {
        var phone = this.phone.value;
        var password = this.password.value;

        // Test phone and password not empty
        if (!phone.trim() || !password.trim()) {
            this.setState({
                showError: true,
            });

            return;
        }

        this.setState({
            showError: false
        });

        if (await this.props.login(phone, password)) {
            // Login success
            this.props.history.replace(+this.props.match.params.fm ? '/fm' : '/');
            return;
        }

        // Login failed
        this.setState({
            showError: true,
        });
    }

    async handleEnter(e) {
        if (e.charCode !== 13) {
            return;
        }

        this.doLogin();
    }

    render() {
        var { classes, logining } = this.props;

        return (
            <div className={classes.container}>
                <Link
                    className={classes.back}
                    to="/"
                >
                    <i className="ion-android-arrow-back" />
                    Discover music
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>

                <section>
                    <input
                        ref={
                            ele => (this.phone = ele)
                        }
                        type="text"
                        placeholder="Your phone number"
                    />
                    <input
                        onKeyPress={e => this.handleEnter(e)}
                        placeholder="Password"
                        ref={
                            ele => (this.password = ele)
                        }
                        type="password" />

                    <p
                        className={
                            clazz(classes.error, {
                                [classes.show]: this.state.showError,
                            })
                        }
                    >
                        Invalid username or password, Please try again.
                    </p>
                </section>

                <footer>
                    <button
                        className={clazz({
                            [classes.logining]: logining,
                        })}
                        disabled={logining}
                        onClick={e => this.doLogin()}
                    >
                        <span>
                            {logining ? 'Logining...' : 'Login'}
                        </span>
                    </button>

                    <div className={classes.sns}>
                        <Link
                            to={`/login/qrcode/10/${+this.props.match.params.fm}`}
                            className={classes.link}
                        >
                            Login with WeChat
                        </Link>

                        <Link
                            to={`/login/qrcode/2/${+this.props.match.params.fm}`}
                            className={classes.link}
                        >
                            Login with Weibo
                        </Link>
                    </div>
                </footer>
            </div>
        );
    }
}

export default injectSheet(classes)(Legacy);
