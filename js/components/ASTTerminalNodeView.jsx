/** @jsx React.DOM */
'use strict';
import 'react';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import Scope from 'lang/scope';
import S from 'lang/symbolTypes';
import D from 'dataManager';

// import EvaluationResponseView from './EvaluationResponseView';

export default React.createClass({
  displayName: 'ASTTerminalNodeView'
, render: function () {
    var visualizeSimpleEvaluationResponse = function (res) {
      if (res.status === 'ERROR') {
        return <em> {res.message} </em>;
      }
      return "";
    }
    var getTypeAndPos = function (p) {
      return M.get(p,'type').toString() + " [" + M.get(p,'pos').col + ", " + M.get(p,'pos').line + "]";
    }
    var stringifyTitle = function (p) {
      if (p.hasOwnProperty('_cachedResult')) {
        return <span>
          <strong>{getTypeAndPos(p)}</strong>
          <ul><li>{visualizeSimpleEvaluationResponse(p._cachedResult)}</li></ul>
        </span>;
      } else {
        return <strong>{getTypeAndPos(p)}</strong>;
      }
    }
    var visualizeSymbol = function (p) {
      return <span>
        {stringifyTitle(p)} <span>{"name: "+M.get(p,'name')}</span>
        </span>;
    }
    var visualizeBasicTerminal = function (p) {
      var precision = (p._didLosePrecision?" [lost precision!]":(p._couldLosePrecision?" [could lose precision with other data!]":""));
      return <span>
        {stringifyTitle(p)} <span>{"value: "+JSON.stringify(M.get(p,'value'))+precision}</span>
        </span>;
    }
    if (M.get(this.props.node,'type') === S.T_SYM) {
      return <span>{visualizeSymbol(this.props.node)}</span>;
    } else {
      return <span>{visualizeBasicTerminal(this.props.node)}</span>;
    }
}});