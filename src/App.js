import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import SelectRoleForm from 'components/forms/SelectRoleForm';
import UserProfile from 'components/UserProfile';
import FileRepo from 'components/FileRepo';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import theme from 'theme/defaultTheme';
import Landing from 'components/landing';

import Join from 'pageContents/Join';
import scienceBgPath from 'theme/images/background-science.jpg';

const enhance = compose(injectState);

const forceSelectRole = (Component, loggedInUser) => {
  if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/select-role" />;
  }
  return (
    <div>
      <Header />
      <Component />
    </div>
  );
};

const render = ({ editing, setEditing, state, effects }) => {
  const { loggedInUser } = state;
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route path="/auth-redirect" exact={true} component={AuthRedirect} />
            <Route path="/redirected" exact={true} component={() => null} />
            <Route
              path="/files"
              exact={true}
              render={() => forceSelectRole(FileRepo, loggedInUser)}
            />
            <Route
              path="/user/:egoId"
              exact={true}
              render={() => forceSelectRole(UserProfile, loggedInUser)}
            />
            <Route path="/test" exact={true} component={SelectRoleForm} />
            <Route
              path="/select-role"
              exact={true}
              render={() => {
                if (loggedInUser) {
                  return <SelectRoleForm />;
                }
                return <Redirect to="/" />;
              }}
            />
            <Route
              path="/join"
              exact={true}
              render={() => (
                <div
                  className={css`
                    background-image: url(${scienceBgPath});
                    background-repeat: repeat;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                  `}
                >
                  <Header />
                  <div>
                    <Join />
                  </div>
                </div>
              )}
            />
            <Route
              exact
              path="/"
              render={() =>
                forceSelectRole(
                  withRouter(({ history }) => (
                    <Landing onJoinClick={() => history.push('/join')} />
                  )),
                  loggedInUser,
                )
              }
            />
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default provideLoggedInUser(enhance(render));
