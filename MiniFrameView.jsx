/** @jsx React.DOM */
'use strict';
import 'react';
require("./styles/miniFrame.scss");
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
import D from './dataManager';

export default React.createClass({
    displayName: 'MiniFrameView'
  , handleClick: function () {
    this.props.onSelect(this.props.step);
  }
  , getClasses: function () {
    return 'miniFrameContainer'+(this.props.selected?' miniFrameContainer--selected':'');
  }
  , render: function () {
    return <div className={this.getClasses()} onClick={this.handleClick}>
    {D.getTransfomationCodeFromStep(this.props.step)}
    </div>;
  }
});