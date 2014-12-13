/** @jsx React.DOM */
'use strict'
var React = require('react')
module.exports = React.createClass({
    displayName: 'HelloReact',
    render: function(){
        return (
        	<p>
        		Hello, <input type="text" placeholder="Your name here" />!
        		It is {this.props.date.toTimeString()}
        	</p>
        	);
    }
})