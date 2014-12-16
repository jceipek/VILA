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
require('./styles/button.scss');

// var testScope = new Scope();

// testScope.setSymbolValue('a', S.makeInt(5, null));
// testScope.setSymbolValue('b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'StepsView'
  , getInitialState: function() {
    return {steps: [1,2,3]};
  }
  // , handleChange: function (e) {
  //   this.setState({text: e.target.value});
  // }
  , render: function() {
    var steps = this.state.steps;
    return <div className='view' style={{width: '10em'}}>
      {steps.map((x,i) => {return <FrameView/>})}
      <button className='actionButton'>
        +
      </button>
    </div>;
  }
});