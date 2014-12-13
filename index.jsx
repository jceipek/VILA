/** @jsx React.DOM */
'use strict'
var React = require('react')
var Hello = require('./Hello')
var Tokenizer = require('./tokenize')

setInterval(function() {
  React.render(
    <Hello ast={Tokenizer.tokenize("10+(1+2)/3*7+6*2")} />,
    document.getElementById('content')
  );
}, 500);