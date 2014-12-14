/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
import S from './lang/symbolTypes';
import evaluateASTTree from './lang/evaluator';

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

    try {
      result = evaluateASTTree(parse);
    } catch (e) {
      error.push(e.message);
    }

    var stringifyTitle = function (p) {
      if (p.hasOwnProperty('_cachedResult')) {
        return <span>
          <h3>{p.type.toString() + " [" + p.pos.col + ", " + p.pos.line + "]"}</h3>
          <ul><li>{visualizeTree(p._cachedResult)}</li></ul>
        </span>;
      } else {
        return <h3>{p.type.toString() + " [" + p.pos.col + ", " + p.pos.line + "]"}</h3>;
      }
    }

    var visualizeTree = function (p) {
      if (!p) return "";
      if (p.type === S.S_ASSIGN) {
        return <span>
              {stringifyTitle(p)}
              <ol>
                <li>{visualizeTree(p.symbol)}</li>
                <li>{visualizeTree(p.expr)}</li>
              </ol>
            </span>;
      }
      if (p.type === S.E_ADD ||
          p.type === S.E_SUB ||
          p.type === S.E_MUL ||
          p.type === S.E_DIV) {
        return <span>
            {stringifyTitle(p)}
            <ol>
              <li>{visualizeTree(p.valueA)}</li>
              <li>{visualizeTree(p.valueB)}</li>
            </ol>
          </span>;
      }
      if (p.type === S.E_CALL) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{visualizeTree(p.symbol)}</li>
              {p.exprs.map((x,i) => { return <li key={i}>{visualizeTree(x)}</li>; })}
            </ol>
        </span>
      }
      if (p.type === S.T_INT) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{"value: "+p.value}</li>
            </ol>
          </span>;
      }
      if (p.type === S.T_FLOAT) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{"value: "+JSON.stringify(p.value)}</li>
            </ol>
          </span>;
      }
      if (p.type === S.T_BASE_INT) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{"strValue: "+p.strValue}</li>
              <li>{"base: "+p.base}</li>
            </ol>
          </span>;
      }
      if (p.type === S.T_SYM) {
        return <span>
          {stringifyTitle(p)}
            <ol>
              <li>{"name: "+p.name}</li>
            </ol>
          </span>;
      }
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
          Errors:
          <ul>
            {error.map((x,i) => {return <li key={i}>{x}</li>})}
          </ul>
        </p>
        <p>
          Result:
          {visualizeTree(result)}
        </p>
      </div>
      );
  }
});