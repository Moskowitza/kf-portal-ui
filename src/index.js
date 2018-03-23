import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { getAppElement } from './services/globalDomNodes.js';

import './i18n';

ReactDOM.render(<App />, getAppElement());

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
