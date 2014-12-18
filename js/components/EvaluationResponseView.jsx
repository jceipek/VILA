/** @jsx React.DOM */
'use strict';
import 'react';
import ASTTerminalNodeView from 'components/ASTTerminalNodeView'

export default React.createClass({
  displayName: 'EvaluationResponseView'
, render: function () {
    var visualizeSimpleEvaluationResponse = function (res) {
      if (res.status === 'ERROR') {
        return <em> {res.message} </em>;
      }
      return <ASTTerminalNodeView node={res.res}/>;
    }
    var visualizeEvaluationResponse = function (res) {
      if (res.status === 'ERROR') {
        return <span>
          <em>{res.message}</em>
          at
          <span>[{res.pos.col},{res.pos.line}]</span>
          involving
          <ul>{res.involvedValues.map((v,i) => {return <li key={i}><ASTTerminalNodeView node={v}/></li>;})}</ul>
        </span>;
      } else
      if (res.status === 'ASSIGNMENT') {
      return <span>
                <span>Set </span>
                <ASTTerminalNodeView node={res.symbol}/>
                <span> to </span>
                <ASTTerminalNodeView node={res.value}/>
              </span>;
      } else {
        return <span><ASTTerminalNodeView node={res.res}/></span>;
      }
    }
    var res;
    if (this.props.showDetails) {
      res = visualizeEvaluationResponse(this.props.response);
    } else {
      res = visualizeSimpleEvaluationResponse(this.props.response);
    }
    return <span>{res}</span>;
}});