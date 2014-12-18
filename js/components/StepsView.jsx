/** @jsx React.DOM */
'use strict';
import 'react';
import MiniFrameView from 'components/MiniFrameView';
require('styles/button.scss');
require('styles/view.scss');

import StepActions from 'actions/StepActions';

export default React.createClass({
  displayName: 'StepsView'
, propTypes: {
    steps: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  , selectedStepId: React.PropTypes.number // can be null
  , changeSelectionHandler: React.PropTypes.func.isRequired
}
, addNewStepAtEnd: function(){ // TODO: Make this add a step at other places based on UI input
  var id = null;
  var stepCount = this.props.steps.length;
  if (stepCount > 0) {
    id = this.props.steps[stepCount-1].id;
  }
  StepActions.addStep(id);
}
, render: function() {
  var onSelection = this.props.changeSelectionHandler;
  return <div className='view' style={{width: '10em'}}>
    {this.props.steps.map((step, i) =>
      {return <MiniFrameView key={step.id}
                             step={step}
                             index={i}
                             isSelected={step.id===this.props.selectedStepId}
                             selectionHandler={onSelection.bind(null, step)}/>;})
    }
    <button className='actionButton' onClick={this.addNewStepAtEnd}>
      +
    </button>
  </div>;
}});