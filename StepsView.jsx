/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
import FrameView from './FrameView';
import D from './dataManager';
require('./styles/view.scss');
require('./styles/button.scss');


D.setup();
// var testScope = new Scope();

// testScope.setSymbolValue('a', S.makeInt(5, null));
// testScope.setSymbolValue('b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'StepsView'
  , getInitialState: function() {
    var lastStep = D.getSteps();
    return {selectedStep: lastStep, lastStep: lastStep, firstStep: lastStep};
  }
  , changeSelection: function (newStep) {
    this.setState({selectedStep: newStep});
  }
  , handleClick: function (e) {
    this.state.lastStep.addNewStep();
    this.setState({lastStep: this.state.lastStep.nextStep});
  }
  , render: function() {
    // var jsMap = function (f, moriColl) {
    //   var res = [];
    //   var n = 0;
    //   M.each(moriColl, function (x) {res.push(f(x,n)); n+=1;});
    //   return res;
    // };
    var that = this;
    var selectedStep = this.state.selectedStep;
    var visualizeStep = function (s,index) {
      return <FrameView key={index}
                        step={s}
                        selected={s === selectedStep}
                        onSelect={that.changeSelection}/>
    }
    var visualizeSteps = function (firstStep) {
      var curr = firstStep;
      var res = [];
      var index = 0;
      while (curr != null) {
        res.push(visualizeStep(curr,index));
        index++;
        curr = curr.nextStep;
      }
      return res;
    };
    return <div className='view' style={{width: '10em'}}>
      {visualizeSteps(this.state.firstStep)}
      <button className='actionButton' onClick={this.handleClick}>
        +
      </button>
    </div>;
  }
});