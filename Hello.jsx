/** @jsx React.DOM */
'use strict';
import 'react';
var Parser = require('./lang/parser');
import 'es6-symbol/implement';

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
    var error;
    try {
      parse = Parser.parse(this.state.text);
    } catch (e) {
      error = e.message;
    }

    var stringifyTitle = function (p) {
      return p.type.toString() + " [" + p.pos.col + ", " + p.pos.line + "]";
    }

    var visualizeTree = function (p) {
      if (!p) return "";
      if (p.type === Symbol.for('S_ASSIGN')) {
        return <span>
              <h3>{stringifyTitle(p)}</h3>
              <ol>
                <li>{visualizeTree(p.symbol)}</li>
                <li>{visualizeTree(p.expr)}</li>
              </ol>
            </span>;
      }
      if (p.type === Symbol.for('E_ADD') ||
          p.type === Symbol.for('E_SUB') ||
          p.type === Symbol.for('E_MUL') ||
          p.type === Symbol.for('E_DIV')) {
        return <span>
            <h3>{stringifyTitle(p)}</h3>
            <ol>
              <li>{visualizeTree(p.valueA)}</li>
              <li>{visualizeTree(p.valueB)}</li>
            </ol>
          </span>;
      }
      if (p.type === Symbol.for('E_CALL')) {
        return <span>
          <h3>{stringifyTitle(p)}</h3>
            <ol>
              <li>{visualizeTree(p.symbol)}</li>
              {p.exprs.map((x,i) => { return <li key={i}>{visualizeTree(x)}</li>; })}
            </ol>
        </span>
      }
      if (p.type === Symbol.for('T_INT')) {
        return <span>
          <h3>{stringifyTitle(p)}</h3>
            <ol>
              <li>{"value: "+p.value}</li>
            </ol>
          </span>;
      }
      if (p.type === Symbol.for('T_FLOAT')) {
        return <span>
          <h3>{stringifyTitle(p)}</h3>
            <ol>
              <li>{"value: "+p.value}</li>
            </ol>
          </span>;
      }
      if (p.type === Symbol.for('T_BASE_INT')) {
        return <span>
          <h3>{stringifyTitle(p)}</h3>
            <ol>
              <li>{"value: "+p.value}</li>
              <li>{"base: "+p.base}</li>
            </ol>
          </span>;
      }
      if (p.type === Symbol.for('T_SYM')) {
        return <span>
          <h3>{stringifyTitle(p)}</h3>
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
          Error: {error}
        </p>
      </div>
      );
  }
});