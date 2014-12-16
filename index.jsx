/** @jsx React.DOM */
'use strict'
import 'react';
import StepsView from './StepsView';
// XXX: This is an ugly hack to get normalize.
// TODO: Integrate it properly with webpack
require('./node_modules/normalize.css/normalize.css');
require('./styles/main.scss');

React.render(
<StepsView />,
document.getElementById('content')
);