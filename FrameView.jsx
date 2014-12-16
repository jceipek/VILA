/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
require("./styles/frame.scss");

// var testScope = new Scope();

// testScope.setSymbolValue('a', S.makeInt(5, null));
// testScope.setSymbolValue('b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'FrameView'
  // , getInitialState: function() {
  //   return {text: ""};
  // }
  // , handleChange: function (e) {
  //   this.setState({text: e.target.value});
  // }
  , handleClick: function () {
    this.props.onSelect(this.props.index);
  }
  , getClasses: function () {
    return 'frameContainer'+(this.props.selected?' frameContainer--selected':'');
  }
  , render: function () {
    return <div className={this.getClasses()} onClick={this.handleClick}>
    </div>;
  }
});