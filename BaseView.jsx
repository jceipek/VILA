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


export default React.createClass({
    displayName: 'BaseView'
  , getInitialState: function() {
    return {selectedStep: this.props.lastStep, lastStep: this.props.lastStep, firstStep: this.props.firstStep};
  }
  , changeSelection: function (newStep) {
    this.setState({selectedStep: newStep});
  }
  , handleFrameCodeChange: function (frame, newCodeValue) {
    D.setTransfomationCodeForStep(frame, newCodeValue);
    this.setState({firstStep:this.state.firstStep}); // XXX: I'm not happy with this solution -JC
  }
  , handleClick: function (e) {
    var newStep = D.createNewFrameAfterStep(this.state.lastStep);
    this.setState({lastStep: newStep});
  }
  , render: function() {
    return <div className='wrapper'>
            <StepsView firstStep={this.props.firstStep}
                       lastStep={this.props.lastStep}
                       changeSelectionHandler={this.changeSelection}/>
            <FrameView step={this.state.selectedStep}
                       frameChangeHandler={this.handleFrameCodeChange}/>
          </div>;
  }
});