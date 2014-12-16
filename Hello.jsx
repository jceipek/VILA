/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';
import Scope from './lang/scope';

var testScope = new Scope();

testScope.setSymbolValue('a', S.makeInt(5, null));
testScope.setSymbolValue('b', S.makeInt(2, null));

export default React.createClass({
    displayName: 'HelloReact'
  , getInitialState: function() {
    return {text: ""};
  }
  , handleChange: function (e) {
    this.setState({text: e.target.value});
  }
  , render: function(){
    var parse;
    var result;
    var error = [];
    try {
      parse = Parser.parse(this.state.text);
    } catch (e) {
      error.push(e.message);
    }

    result = evaluateASTTree(parse, testScope);

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
      <div>
        <p onChange={this.handleChange}>
          <input type="text" placeholder="Expression Here" />
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
      </div>
      );
  }
});