/** @jsx React.DOM */
'use strict';
import 'react';
import ASTTerminalNodeView from './ASTTerminalNodeView'

var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6

export default React.createClass({
  displayName: 'ScopeView'
, render: function () {
  var visualizeContents = function (contents) {
    var res = [];
    M.each(contents, function (x) {
      res.push(x);
    })
    return res.map((x,i) => {return <li key={i}>{M.get(x,0)} : <ASTTerminalNodeView node={M.get(M.get(x,1),'value')}/></li>;});
  }
  return <div>
  <h3>SCOPE:</h3>
    [<ul>{visualizeContents(M.get(this.props.scope, 'contents'))}</ul>]
  </div>;
}});