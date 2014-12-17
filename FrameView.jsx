/** @jsx React.DOM */
'use strict';
import 'react';
require("./styles/frame.scss");
require("./styles/code.scss");
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';
import D from './dataManager';
import ScopeView from './ScopeView';

// var testScope = Scope.makeScope();

// testScope = Scope.mapSymbolToValue(testScope, null, 'a', S.makeInt(5, null));
// testScope = Scope.mapSymbolToValue(testScope, null, 'b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'FrameView'
  , getInitialState: function() {
    return {step: this.props.step};
  }
  , handleChange: function (e) {
    e.preventDefault();
    this.props.frameChangeHandler(this.props.step, e.target.value);
  }
  , render: function(){
    var text = D.getTransfomationCodeFromStep(this.props.step);
    var inputScope = D.getInputScopeForStep(this.props.step);
    var parse;
    var result;
    var error = [];
    try {
      parse = Parser.parse(text);
    } catch (e) {
      error.push(e.message);
    }

    result = evaluateASTTree(parse, inputScope);

    var visualizeSimpleEvaluationResponse = function (res) {
      if (res.status === 'ERROR') {
        return <em> {res.message} </em>;
      }
      return <span>{visualizeTree(res.res)}</span>;
    };

    var stringifyTitle = function (p) {
      if (p.hasOwnProperty('_cachedResult')) {
        return <span>
          <h3>{M.get(p,'type').toString() + " [" + M.get(p,'pos').col + ", " + M.get(p,'pos').line + "]"}</h3>
          <ul><li>{visualizeSimpleEvaluationResponse(p._cachedResult)}</li></ul>
        </span>;
      } else {
        return <h3>{M.get(p,'type').toString() + " [" + M.get(p,'pos').col + ", " + M.get(p,'pos').line + "]"}</h3>;
      }
    }

    var visualizeSymbol = function (p) {
      return <span>
        {stringifyTitle(p)}
          <ol>
            <li>{"name: "+M.get(p,'name')}</li>
          </ol>
        </span>;
    }

    var visualizeBasicTerminal = function (p) {
      var precision = (p._didLosePrecision?" [lost precision!]":(p._couldLosePrecision?" [could lose precision with other data!]":""));
      return <span>
        {stringifyTitle(p)}
          <ol>
            <li>{"value: "+JSON.stringify(M.get(p,'value'))+precision}</li>
          </ol>
        </span>;
    }

    var visualizeTree = function (p) {
      if (!p) return "";
      if (M.get(p,'type') === S.S_ASSIGN) {
        return <span>
              {stringifyTitle(p)}
              <ol>
                <li>{visualizeTree(M.get(p,'symbol'))}</li>
                <li>{visualizeTree(M.get(p,'expr'))}</li>
              </ol>
            </span>;
      }
      if (S.isBinaryOperator(M.get(p,'type'))) {
        return <span>
            {stringifyTitle(p)}
            <ol>
              <li>{visualizeTree(M.get(p,'valueA'))}</li>
              <li>{visualizeTree(M.get(p,'valueB'))}</li>
            </ol>
          </span>;
      }
      if (M.get(p,'type') === S.E_CALL) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{visualizeTree(M.get(p,'symbol'))}</li>
              {p.exprs.map((x,i) => { return <li key={i}>{visualizeTree(x)}</li>; })}
            </ol>
        </span>
      }
      if (M.get(p,'type') === S.E_NEG) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{visualizeTree(M.get(p,'value'))}</li>
            </ol>
        </span>
      }
      if (M.get(p,'type') === S.T_INT ||
          M.get(p,'type') === S.T_BOOL ||
          M.get(p,'type') === S.T_FLOAT ||
          M.get(p,'type') === S.T_BASE_INT) {
          return visualizeBasicTerminal(p);
      }
      if (M.get(p,'type') === S.T_SYM) {
        return visualizeSymbol(p);
      }

    };

    var visualizeEvaluationResponse = function (res) {
      if (res.status === 'ERROR') {
        return <em>
        {res.message}
        at
        [{res.pos.col},{res.pos.line}]
        involving
        {res.involvedValues.map((v,i) => {return <li key={i}>{visualizeTree(v)}</li>;})}
        </em>
      }
      if (res.status === 'ASSIGNMENT') {
        return <span>Set {visualizeTree(res.symbol)} to {visualizeTree(res.value)}</span>;
      }
      return <span>{visualizeTree(res.res)}</span>;
    };

    return (
      <div className='frameView'>
        <ScopeView scope={D.getInputScopeForStep(this.props.step)} />
        <p>
          <input className='code-box' type="text" placeholder="Expression Here" value={text} onChange={this.handleChange}/>
        </p>
        <p>
          AST:
        </p>
        {visualizeTree(parse)}
        <p>
          Lexing Errors:
          <ul>
            {error.map((x,i) => {return <li key={i}>{x}</li>})}
          </ul>
        </p>
        <p>
          Result:<br/>
          {result?visualizeEvaluationResponse(result):""}
        </p>
        <ScopeView scope={D.getOutputScopeForStep(this.props.step)} />
      </div>
      );
  }
});