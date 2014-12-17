/** @jsx React.DOM */
'use strict';
import 'react';
require("styles/miniFrame.scss");
var Parser = require('lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from 'lang/symbolTypes';
import evaluateASTTree from 'lang/evaluator';
import Scope from 'lang/scope';
import D from 'dataManager';

export default React.createClass({
    displayName: 'MiniFrameView'
  , getClasses: function () {
    return 'miniFrameContainer'+(this.props.isSelected?' miniFrameContainer--selected':'');
  }
  , render: function () {
    return <div className={this.getClasses()} onClick={this.props.selectionHandler}>
    {this.props.code}
    <span className='miniFrameIndex'>{this.props.index}</span>
    </div>;
  }
});