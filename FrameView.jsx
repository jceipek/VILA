/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
require("./styles/frame.scss");

export default React.createClass({
    displayName: 'FrameView'
  , handleClick: function () {
    this.props.onSelect(this.props.step);
  }
  , getClasses: function () {
    return 'frameContainer'+(this.props.selected?' frameContainer--selected':'');
  }
  , render: function () {
    return <div className={this.getClasses()} onClick={this.handleClick}>
    </div>;
  }
});