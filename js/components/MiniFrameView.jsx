/** @jsx React.DOM */
'use strict';
import 'react';
require("styles/miniFrame.scss");
import MiniScopeView from 'components/MiniScopeView';

export default React.createClass({
    displayName: 'MiniFrameView'
  , propTypes: {
      step: React.PropTypes.object.isRequired
    , isSelected: React.PropTypes.bool.isRequired
    , index: React.PropTypes.number.isRequired
    , selectionHandler: React.PropTypes.func.isRequired
  }
  , render: function () {
    var cx = React.addons.classSet;
    var classes = cx({
      'miniFrameContainer': true
    , 'miniFrameContainer--selected': this.props.isSelected
    , 'miniFrameContainer--error': this.props.step.status==='ERROR'
    , 'miniFrameContainer--empty': this.props.step.status==='EMPTY'
    , 'miniFrameContainer--assignment': this.props.step.status==='ASSIGNMENT'
    , 'miniFrameContainer--expression': this.props.step.status==='EXPRESSION'
    });
    return <div className={classes}
                onClick={this.props.selectionHandler}>
              <MiniScopeView scope={this.props.step.inputScope} />
              <span className='miniFrameCode'>{this.props.step.code}</span>
              <span className='miniFrameIndex'>{this.props.index}</span>
           </div>;
  }
});