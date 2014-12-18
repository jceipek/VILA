/** @jsx React.DOM */
'use strict';

// Reflux
var Reflux = require('reflux');
import StepStore from 'stores/StepStore';

// React
import 'react';
import StepsView from 'components/StepsView';
import FrameView from 'components/FrameView';
require('styles/view.scss');
import StepActions from 'actions/StepActions';

var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import evaluateASTTree from 'lang/evaluator';
import Scope from 'lang/scope';
var Parser = require('lang/parser');

export default React.createClass({
    displayName: 'BaseView'
  , getInitialState: function() {
    // XXX: This could be more robust, but it works for now - JC
    var steps = StepStore.getInitialState();
    console.log(steps[steps.length-1].id);
    return { selectedStep: steps[steps.length-1]
           , steps: steps
           };
  }
  , onStepsChange: function(steps) {
    this.setState({
        steps: steps
    });
  }
  , componentDidMount: function() {
    this.unsubscribe = StepStore.listen(this.onStepsChange);
  }
  , componentWillUnmount: function() {
    this.unsubscribe();
  }
  , changeSelection: function (step) {
    this.setState({selectedStep: step});
  }
  , currStepId: function () {
      if (this.state.selectedStep !== null) {
        return this.state.selectedStep.id;
      } else {
        return null;
      }
  }
  , render: function() {
    return <div className='wrapper'>
            <StepsView steps={this.state.steps}
                       selectedStepId={this.currStepId()}
                       changeSelectionHandler={this.changeSelection}/>
            // <FrameView inputScope={fakeSteps[this.state.selectedStepIndex].inputScope}
            //            code={fakeSteps[this.state.selectedStepIndex].code}
            //            codeChangedHandler={this.handleFrameCodeChange.bind(null, D.getNthStep(this.state.firstStep, this.state.selectedStepIndex))}/>
          </div>;
  }
});