/** @jsx React.DOM */
'use strict'
import 'react';
import BaseView from './BaseView';
// XXX: This is an ugly hack to get normalize.
// TODO: Integrate it properly with webpack
require('./node_modules/normalize.css/normalize.css');
require('./styles/main.scss');
require('./styles/wrapper.scss');

import D from './dataManager';
D.setup();

React.render(
<BaseView firstStep={D.getSteps()} lastStep={D.getLastStepInChain(D.getSteps())} />,
document.getElementById('content')
);