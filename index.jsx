/** @jsx React.DOM */
'use strict'
var React = require('react')
var Hello = require('./Hello')

setInterval(function() {
  React.render(
    <Hello />,
    document.getElementById('content')
  );
}, 500);