/** @jsx React.DOM */
'use strict';
import 'react';
var M = require("mori"); // Couldn't figure out how to convert to ECMAScript6
import Scope from './lang/scope';
import D from './dataManager';

export default React.createClass({
    displayName: 'ScopeView'
  , render: function () {
    return <div>
    {Scope.jsOfScope(this.props.scope)}
    </div>;
  }
});