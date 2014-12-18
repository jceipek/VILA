/** @jsx React.DOM */
'use strict';
import 'react';
import ScopeView from 'components/ScopeView';
import ASTView from 'components/ASTView';
import EvaluationResponseView from 'components/EvaluationResponseView';
require("styles/frame.scss");
require("styles/code.scss");

var Parser = require('lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import evaluateASTTree from 'lang/evaluator';
import StepActions from 'actions/StepActions';
import Scope from 'lang/scope';

export default React.createClass({
  displayName: 'FrameView'
, propTypes: {
  step: React.PropTypes.object.isRequired
}
, getInitialState: function() {
    return {code: this.props.step.code}
}
, codeChanged: function(e){
  StepActions.updateStep(this.props.step.id,e.target.value);
  this.setState({code: e.target.value});
}
, render: function(){
  var text = this.state.code;
  var inputScope = this.props.step.inputScope;
  var parse = null;
  var result;
  var error = [];
  try {
    parse = Parser.parse(text);
  } catch (e) {
    error.push(e.message);
    parse = null;
  }

  var outputScope = inputScope;
  if (parse !== null) {
    result = evaluateASTTree(parse, inputScope);
    if (result.status === 'ASSIGNMENT') {
      outputScope = Scope.mapSymbolToValue(inputScope, this.props.step, M.get(result.symbol, 'name'), result.value)
    }
  }

  var visualizeSimpleEvaluationResponse = function (res) {
    if (res.status === 'ERROR') {
      return <em> {res.message} </em>;
    }
    return <span>{visualizeTree(res.res)}</span>;
  };

  var visualizeEvaluationResponse = function (res) {
    if (res.status === 'ERROR') {
      return <em>
      {res.message}
      at
      [{res.pos.col},{res.pos.line}]
      involving
      {res.involvedValues.map((v,i) => {return <li key={i}><ASTView node={v} /></li>;})}
      </em>
    }
    if (res.status === 'ASSIGNMENT') {
      return <span>Set <ASTView node={res.symbol} /> to <ASTView node={res.value} /></span>;
    }
    return <span>{visualizeTree(res.res)}</span>;
  };

  var resultToDisplay = "";
  if (result) {
    resultToDisplay = (<EvaluationResponseView response={result} showDetails={true} />);
  }

  return (
    <div className='frameView'>
      <ScopeView scope={this.props.step.inputScope} />
      <p>
        <input className='code-box' type="text" placeholder="Expression Here" value={text} onChange={this.codeChanged}/>
      </p>
      <p>
        AST:
      </p>
      <ASTView node={parse} />
      <p>
        Lexing Errors:
        <ul>
          {error.map((x,i) => {return <li key={i}>{x}</li>})}
        </ul>
      </p>
      <p>
        Result:<br/>
        {resultToDisplay}
      </p>
      <ScopeView scope={outputScope} />
    </div>
    );
}});