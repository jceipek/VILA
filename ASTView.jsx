/** @jsx React.DOM */
'use strict';
import 'react';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import Scope from './lang/scope';
import S from './lang/symbolTypes';
import D from './dataManager';
import ASTTerminalNodeView from './ASTTerminalNodeView';

import EvaluationResponseView from './EvaluationResponseView';

export default React.createClass({
  displayName: 'ASTView'
, render: function () {
    var stringifyTitle = function (p) {
      if (p.hasOwnProperty('_cachedResult')) {
        return <span>
          <h3>{M.get(p,'type').toString() + " [" + M.get(p,'pos').col + ", " + M.get(p,'pos').line + "]"}</h3>
          <ul><li><EvaluationResponseView showDetails={true} response={p._cachedResult} /></li></ul>
        </span>;
      } else {
        return <h3>{M.get(p,'type').toString() + " [" + M.get(p,'pos').col + ", " + M.get(p,'pos').line + "]"}</h3>;
      }
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

      return <ASTTerminalNodeView node={p} />;
    }
    return <span>{visualizeTree(this.props.node)}</span>;
}});