import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import * as actions from '../../redux/settings/actions.js';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class FixedRightSideButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  handleClick = () => {
    this.setState({ redirect: true })

  }

  render() {

    if (this.state.redirect) {

      this.setState({ redirect: false })
      return <Redirect to={this.props.url} />;

    }
    return (
      <Button
        onClick={this.handleClick}
        disableRipple={true}
        variant="contained"
        className="fixedRightSideButton"
        startIcon={<FontAwesomeIcon className="#fff" icon={['fas', this.props.icon]} />}
      >
        <p className="m-0">{this.props.label}</p>

      </Button>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    layout: state.reducerSettings.Layout
  };
};

export default connect(mapStateToProps, actions)(withTranslate(FixedRightSideButton));