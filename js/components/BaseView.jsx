/** @jsx React.DOM */
'use strict';
import 'react';
require('styles/button.scss');
require('styles/view.scss');
var Parser = require('lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import evaluateASTTree from 'lang/evaluator';
import Scope from 'lang/scope';
import StepsView from 'components/StepsView';
import FrameView from 'components/FrameView';
import D from 'dataManager';
import Scope from 'lang/scope';
import StepActions from 'actions/StepActions';
import StepStore from 'stores/StepStore';

export default React.createClass({
    displayName: 'BaseView'
  , getInitialState: function() {
    return {data: []};
    // return { selectedStepIndex: (D.getStepCount(this.props.firstStep) - 1)
    //        , lastStep: this.props.lastStep
    //        , firstStep: this.props.firstStep};
  }
  , onStatusChange: function(status) {
    this.setState({
        data: status
    });
    }
  , componentDidMount: function() {
    StepActions.getSteps();
    this.unsubscribe = StepStore.listen(this.onStatusChange);
    }
  , componentWillUnmount: function() {
    this.unsubscribe();
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
      inputScope = D.newScopeFromScopeAndFrame(inputScope, lastStep);
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
    return <span style={{color: 'red'}} onClick={StepActions.addStep}>{JSON.stringify(this.state.data)}</span>
    // var fakeSteps = this.getSteps();
    // return <div className='wrapper'>
    //         <StepsView steps={fakeSteps}
    //                    selectedStepIndex={this.state.selectedStepIndex}
    //                    changeSelectionHandler={this.changeSelection}
    //                    addNewStepHandler={this.addNewStep}/>
    //         <FrameView inputScope={fakeSteps[this.state.selectedStepIndex].inputScope}
    //                    code={fakeSteps[this.state.selectedStepIndex].code}
    //                    codeChangedHandler={this.handleFrameCodeChange.bind(null, D.getNthStep(this.state.firstStep, this.state.selectedStepIndex))}/>
    //       </div>;
  }
});