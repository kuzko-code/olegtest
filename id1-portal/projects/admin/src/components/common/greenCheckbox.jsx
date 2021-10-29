import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

export class GroupGreenCheckbox extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
render() {
    const { translate } = this.props;
    return (
<FormControlLabel className="checkbox m-0 p-0"
control={
  <Checkbox
    checked={this.props.checked}
    onChange={this.props.handleChange(this.props.mapKey)}
    value="checked"
    disabled={this.props.disabled}
    style={(this.props.isAllChildrenSelected && parseInt(this.props.isAllChildrenSelected)===2) ? {color: '#6dead0'}:{color: '#1ab394'}}
  />
}
label={this.props.label}
/>
    )
}
}

const mapStateToProps = (state) => {
    return {
      language: state.Intl.locale
    };
  };
  
  export default connect(mapStateToProps)(withTranslate(GroupGreenCheckbox));