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
import StepsView from './StepsView';
import FrameView from './FrameView';
import D from './dataManager';
import Scope from './lang/scope';


export default React.createClass({
    displayName: 'BaseView'
  , getInitialState: function() {
    return {selectedStepIndex: (D.getStepCount(this.props.firstStep) - 1), lastStep: this.props.lastStep, firstStep: this.props.firstStep};
  }
  , changeSelection: function (newStepIndex) {
    this.setState({selectedStepIndex: newStepIndex});
  }
  , addNewStep: function(){
    var newStep = D.createNewFrameAfterStep(this.state.lastStep);
    this.setState({lastStep: newStep});
  }
  , handleFrameCodeChange: function (frame, newCodeValue) {
    D.setTransformationCodeForStep(frame, newCodeValue);
/*
    var parse;
    try {
      parse = Parser.parse(newCodeValue);
      var inputScope = D.getInputScopeForStep(frame);
      var result = evaluateASTTree(parse, inputScope);
      if (result.status === 'ASSIGNMENT') {
        
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
*/
    this.setState({firstStep:this.state.firstStep}); // XXX: I'm not happy with this solution -JC
  }
  , makeFakeStep: function(lastStep, step, stepIndex){
      if (lastStep === null){
        return {
          code: D.getTransformationCodeFromStep(step)
        , inputScope: D.getInputScopeForStep(step)
        , stepIndex: stepIndex
        };
      }
      var inputScope = D.getInputScopeForStep(lastStep);
      var lastCode = D.getTransformationCodeFromStep(lastStep);
      var lastInputScope = D.getInputScopeForStep(lastStep);
      var parse;
      try {
        parse = Parser.parse(lastCode);
        var result = evaluateASTTree(parse, lastInputScope);
        if (result.status === 'ASSIGNMENT') {
          inputScope = Scope.mapSymbolToValue(lastInputScope, lastStep, M.get(result.symbol, 'name'), result.value)
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
      return {
        code: D.getTransformationCodeFromStep(step)
      , inputScope: inputScope
      , stepIndex: stepIndex
      };
  }
  , getSteps: function(){
      var steps = [];
      var lastStep = null;
      var currStep = this.state.firstStep;
      while(currStep !== null){
        steps.push(this.makeFakeStep(lastStep, currStep, steps.length));
        lastStep = currStep;
        currStep = D.getStepAfter(currStep);
      }
      return steps;
  }
  , render: function() {
    var fakeSteps = this.getSteps();
    return <div className='wrapper'>
            <StepsView steps={fakeSteps}
                       selectedStepIndex={this.state.selectedStepIndex}
                       changeSelectionHandler={this.changeSelection}
                       addNewStepHandler={this.addNewStep}/>
            <FrameView inputScope={fakeSteps[this.state.selectedStepIndex].inputScope}
                       code={fakeSteps[this.state.selectedStepIndex].code}
                       codeChangedHandler={this.handleFrameCodeChange.bind(null, D.getNthStep(this.state.firstStep, this.state.selectedStepIndex))}/>
          </div>;
  }
});