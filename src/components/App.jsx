import React, { Component, Link } from 'react';
import {Route, Switch } from 'react-router-dom'
import Profile from './Profile.jsx';
import Signin from './Signin.jsx';
import {
  UserSession,
  AppConfig
} from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig: appConfig });

export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <Switch>
                <Route
                  path="/:username?"
                  render={
                    routerProps => <Profile
                    userSession={userSession}
                    handleSignOut={ this.handleSignOut }
                    {...routerProps}
                    />

                  }
                />
              </Switch>

          }
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
