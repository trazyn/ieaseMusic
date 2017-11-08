
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';
import injectSheet from 'react-jss';
import clazz from 'classname';

import classes from './classes';
import FadeImage from 'ui/FadeImage';

@inject(stores => ({
    login: stores.me.login,
    logining: stores.me.logining,
}))
@observer
class Login extends Component {
    state = {
        showError: false,
    }

    async doLogin() {
        var phone = this.refs.phone.value;
        var password = this.refs.password.value;

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
            this.props.router.replace(+this.props.params.fm ? '/fm' : '/');
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
                <FadeImage
                    className={classes.background}
                    src="https://source.unsplash.com/random" />

                <Link
                    className={classes.back}
                    to="/">
                    <i className="ion-android-arrow-back" />
                    Discover music
                </Link>

                <header>
                    <h1>Sign in</h1>
                    <p>Hello there! Sign in and start playing with ieaseMusic &lt;3</p>
                </header>

                <section>
                    <input
                        placeholder="Your phone number"
                        ref="phone"
                        type="text" />
                    <input
                        onKeyPress={e => this.handleEnter(e)}
                        placeholder="Password"
                        ref="password"
                        type="password" />

                    <p
                        className={clazz(classes.error, {
                            [classes.show]: this.state.showError,
                        })}
                        ref="error">
                        Invalid username or password, Please try again.
                    </p>

                    <button
                        className={clazz({
                            [classes.logining]: logining,
                        })}
                        disabled={logining}
                        onClick={e => this.doLogin()}>
                        <span>
                            {logining ? 'Logining...' : 'Login'}
                        </span>
                    </button>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(Login);
