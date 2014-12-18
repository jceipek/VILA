/** @jsx React.DOM */
'use strict';
import 'react';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
require("styles/miniScope.scss");

export default React.createClass({
    displayName: 'MiniScopeView'
  , propTypes: {
      scope: React.PropTypes.object.isRequired
  }
  , valueFromData: function (data) {
    return M.get(data, 'value');
  }
  , visualizeContents: function (contents) {
    var res = [];
    M.each(contents, function (x) {
      res.push(x);
    })
    return res.map((x,i) => {return <li key={i}>{M.get(x,0)} : {this.valueFromData(M.get(M.get(x,1),'value'))}</li>;});
  }
  , render: function () {
    return <ul className='miniScope'>{this.visualizeContents(M.get(this.props.scope, 'contents'))}</ul>;
  }
});