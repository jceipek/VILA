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
    return {steps: M.vector(), selectedIndex: 0};
  }
  , changeSelection: function (newIndex) {
    this.setState({selectedIndex: newIndex});
  }
  , handleClick: function (e) {
    this.setState({steps: M.conj(this.state.steps, 'x')});
  }
  , render: function() {
    var steps = this.state.steps;
    var jsMap = function (f, moriColl) {
      var res = [];
      var n = 0;
      M.each(moriColl, function (x) {res.push(f(x,n)); n+=1;});
      return res;
    }
    return <div className='view' style={{width: '10em'}}>
      {jsMap((x,i) => {
        return <FrameView key={i} index={i} selected={i === this.state.selectedIndex} onSelect={this.changeSelection}/>},steps)
      }
      <button className='actionButton' onClick={this.handleClick}>
        +
      </button>
    </div>;
  }
});