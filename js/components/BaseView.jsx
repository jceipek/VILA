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
, selectedStepId: function () {
  if (this.state.selectedStep !== null) {
    return this.state.selectedStep.id;
  } else {
    return null;
  }
}
, render: function() {
  return <div className='wrapper'>
          <StepsView steps={this.state.steps}
                     selectedStepId={this.selectedStepId()}
                     changeSelectionHandler={this.changeSelection}/>
          <FrameView key={this.state.selectedStep.id} step={this.state.selectedStep}/>
        </div>;
}});