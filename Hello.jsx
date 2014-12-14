/** @jsx React.DOM */
'use strict';
var React = require('react');
var Parser = require('./lang/parser');

module.exports = React.createClass({
    displayName: 'HelloReact'
  , getInitialState: function() {
    return {text: ""};
  }
  , handleChange: function (e) {
    this.setState({text: e.target.value});
  }
  , render: function(){
    var parse;
    var error;
    try {
      parse = Parser.parse(this.state.text);
    } catch (e) {
      error = e.message;
    }
    return (
      <div>
        <p onChange={this.handleChange}>
          <input type="text" placeholder="Expression Here" />
        </p>
        <p>
          AST: {JSON.stringify(parse)}
        </p>
        <p>
          Error: {error}
        </p>
      </div>
      );
  }
})