/** @jsx React.DOM */
'use strict';
import 'react';
require('./styles/button.scss');
require('./styles/view.scss');
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
import MiniFrameView from './MiniFrameView';
import D from './dataManager';

export default React.createClass({
    displayName: 'StepsView'
  , getInitialState: function() {
    return {selectedStep: this.props.lastStep, lastStep: this.props.lastStep, firstStep: this.props.firstStep};
  }
  , changeSelection: function (newStep) {
    this.setState({selectedStep: newStep});
    this.props.changeSelectionHandler(newStep);
  }
  , handleClick: function (e) {
    var newStep = D.createNewFrameAfterStep(this.state.lastStep);
    this.setState({lastStep: newStep});
  }
  , render: function() {
    var that = this;
    var selectedStep = this.state.selectedStep;
    var visualizeStep = function (step,selectedStep,index,changeSelectionCallback) {
      return <MiniFrameView key={index}
                            step={step}
                            selected={step === selectedStep}
                            onSelect={changeSelectionCallback}/>
    }
    var visualizeSteps = function (firstStep) {
      var curr = firstStep;
      var res = [];
      var index = 0;
      while (curr != null) {
        res.push(visualizeStep(curr, selectedStep, index, that.changeSelection));
        index++;
        curr = D.getStepAfter(curr);
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