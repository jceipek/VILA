/** @jsx React.DOM */
'use strict';
var React = require('react')
var Tokenizer = require('./tokenize')
module.exports = React.createClass({
    displayName: 'HelloReact'
  , getInitialState: function() {
    return {ast: []};
  }
  , handleChange: function (e) {
    this.setState({ast: e.target.value});
  }
  , render: function(){
    var tokens = Tokenizer.tokenize(this.state.ast);
    return (
      <div>
        <p onChange={this.handleChange}>
          <input type="text" placeholder="Expression Here" />
        </p>
        <p>
          Tokens:
        </p>
        <ol>
          {tokens.map(function(token) {
            if (token != null) {
              return <li key={token.pos}>{JSON.stringify(token)}</li>;
            }
          })}
        </ol>
      </div>
      );
  }
})