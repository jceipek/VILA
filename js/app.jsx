/** @jsx React.DOM */
'use strict'
import 'react';
import BaseView from 'components/BaseView';
// XXX: This is an ugly hack to get normalize.
// TODO: Integrate it properly with webpack
require('../node_modules/normalize.css/normalize.css');
require('styles/main.scss');
require('styles/wrapper.scss');

React.render(
<BaseView />,
document.getElementById('content')
);