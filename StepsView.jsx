/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
import FrameView from './FrameView';
require('./styles/view.scss');

// var testScope = new Scope();

// testScope.setSymbolValue('a', S.makeInt(5, null));
// testScope.setSymbolValue('b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'StepsView'
  , getInitialState: function() {
    return {steps: [1,2,3,4]};
  }
  // , handleChange: function (e) {
  //   this.setState({text: e.target.value});
  // }
  , render: function() {
    var steps = this.state.steps;
    return <div className='view'>
      {steps.map((x,i) => {return <FrameView/>})}
    </div>;
  }
});