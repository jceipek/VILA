/** @jsx React.DOM */
'use strict';
import 'react';
require('styles/button.scss');
require('styles/view.scss');
var Parser = require('lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from 'lang/symbolTypes';
import evaluateASTTree from 'lang/evaluator';
import Scope from 'lang/scope';
import MiniFrameView from 'components/MiniFrameView';
import D from 'dataManager';

export default React.createClass({
    displayName: 'StepsView'
  , render: function() {
    var visualizeStep = function (step,selectedStepIndex,index,changeSelectionCallback) {
      return <MiniFrameView key={index}
                            inputScope={step.inputScope}
                            index={step.stepIndex}
                            isSelected={selectedStepIndex === step.stepIndex}
                            selectionHandler={changeSelectionCallback.bind(null, step.stepIndex)}
                            code={step.code}/>
    }
    return <div className='view' style={{width: '10em'}}>
      {this.props.steps.map((step, i) => {
        return visualizeStep( step
                            , this.props.selectedStepIndex
                            , i
                            , this.props.changeSelectionHandler)})
        }
      <button className='actionButton' onClick={this.props.addNewStepHandler}>
        +
      </button>
    </div>;
  }
});