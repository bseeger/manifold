import React, { Component, PropTypes } from 'react';
import { startLogin } from '../../../actions/shared/authentication';
import get from 'lodash/get';
import classNames from 'classnames';

export default class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    showForgot: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    authentication: React.PropTypes.shape({
      currentUser: React.PropTypes.object
    }),
    hideSignInUpOverlay: PropTypes.func
  };

  constructor() {
    super();
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.authenticationError = this.authenticationError.bind(this);
    this.state = { email: '', password: '' };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authentication.currentUser && !this.props.authentication.currentUser) {
      this.props.hideSignInUpOverlay();
    }
  }

  updatePassword(event) {
    this.setState(Object.assign({}, this.state, { password: event.target.value }));
  }

  updateEmail(event) {
    this.setState(Object.assign({}, this.state, { email: event.target.value }));
  }

  handleLogin(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const promise = dispatch(startLogin(this.state.email, this.state.password));
    console.log(promise, 'prom');
  }

  authenticationError() {
    const error = get(this.props.authentication, 'error.body');
    return error;
  }

  render() {

    const submitClass = classNames({
      'form-input': true,
      'form-error': this.authenticationError()
    });

    return (
      <div>
        <form method="post" onSubmit={this.handleLogin} >
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <input
                type="text"
                value={this.state.email}
                onChange={this.updateEmail}
                id="login-email"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label>Password</label>
              <input
                type="password"
                value={this.state.password}
                onChange={this.updatePassword}
                id="login-password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              { this.authenticationError() ?
                <span style={{ marginTop: 0 }} className="error">
                  {this.authenticationError()}
                </span>
              : null }
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Log in"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <a href="#" onClick={this.props.showForgot}>
            {'Forgot your password?'}
          </a>
          <a href="#" onClick={this.props.showCreate}>
            {'Need to sign up?'}
          </a>
        </p>

        <section className="login-external">
          <button className="button-secondary-dark">
            <i className="manicon manicon-facebook"></i>
            <span>Log in with Facebook</span>
          </button>
          <button className="button-secondary-dark">
            <i className="manicon manicon-twitter"></i>
            <span>Log in with Twitter</span>
          </button>
        </section>
      </div>
    );
  }
}