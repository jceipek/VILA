/** @jsx React.DOM */
'use strict';
import 'react';
require("styles/miniFrame.scss");

export default React.createClass({
    displayName: 'MiniFrameView'
  , propTypes: {
      step: React.PropTypes.object.isRequired
    , isSelected: React.PropTypes.bool.isRequired
    , index: React.PropTypes.number.isRequired
    , selectionHandler: React.PropTypes.func.isRequired
  }
  , getClasses: function () {
    return 'miniFrameContainer'+(this.props.isSelected?' miniFrameContainer--selected':'');
  }
  , render: function () {
    return <div className={this.getClasses()}
                onClick={this.props.selectionHandler}>
                {this.props.step.code}
              <span className='miniFrameIndex'>{this.props.index}</span>
           </div>;
  }
});