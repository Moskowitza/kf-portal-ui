import React from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import Login from 'components/Login';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import ConsentForm from 'components/forms/ConsentForm';
import { withApi } from 'services/api';
import { startAnalyticsTiming, TRACKING_EVENTS } from 'services/analyticsTracking';

import Column from 'uikit/Column';
import Wizard from 'uikit/Wizard';

export const ButtonsDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px ${props => props.theme.greyScale4};
  margin-top: 20px;
  padding-top: 20px;
  min-height: 38px;
`;

const JoinContainer = styled(Column)`
  width: 830px;
  margin: auto;
  max-height: 90%;
`;

const JoinContent = compose(
  injectState,
  withRouter,
  withTheme,
  withApi,
  lifecycle({
    componentDidMount() {
      startAnalyticsTiming(TRACKING_EVENTS.labels.joinProcess);
    },
  }),
)(({ state: { loggedInUser }, effects: { setToast, closeToast }, history, theme, api }) => (
  <JoinContainer>
    <div className={`${theme.card} ${theme.column} `}>
      <h2 className={theme.h2}>
        <Trans>Join Kids First</Trans>
      </h2>
      <Wizard
        steps={[
          {
            title: 'Connect',
            render: ({ nextStep }) => (
              <div className={theme.column}>
                <h3 className={theme.h3}>
                  <Trans i18nKey="join.wizard.socialSelect">
                    Select a way to connect to the Kids First Data Resource Portal
                  </Trans>
                </h3>
                <p>
                  <Trans i18nKey="join.wizard.dataConfidentiality">
                    Your information will be kept confidential and secure and is not shared with any
                    of these providers.
                  </Trans>
                </p>
                <Login
                  shouldNotRedirect={true}
                  onFinish={user => {
                    if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
                      nextStep();
                    } else {
                      history.push('/dashboard');
                    }
                  }}
                />
              </div>
            ),
            renderButtons: () => <div />,
            canGoBack: true,
          },
          {
            title: 'Basic Info',
            render: ({ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <div className={theme.column}>
                <h3 className={theme.h3}>
                  <Trans i18nKey="join.wizard.basicInfoHeader">Tell us about yourself</Trans>
                </h3>
                <p>
                  <Trans i18nKey="join.wizard.basicInfoInstructions">
                    Please provide information about yourself to help us personalize your
                    experience.
                  </Trans>
                </p>
                <SelectRoleForm
                  onValidateFinish={errors => disableNextStep(!!Object.keys(errors).length)}
                  onValidChange={isValid => disableNextStep(!isValid)}
                  {...{ nextStep, nextDisabled, prevDisabled, api }}
                />
              </div>
            ),
            canGoBack: true,
          },
          {
            title: 'Consent',
            render: ({ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <ConsentForm
                {...{ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled, history }}
              />
            ),
            canGoBack: false,
          },
        ]}
      />
    </div>
  </JoinContainer>
));
export default JoinContent;
