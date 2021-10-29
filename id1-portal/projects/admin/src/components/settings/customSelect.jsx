import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import "../../../public/assets/css/newssettings.css";
import Select from "react-select";

export class customselect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options,
      optionResult: this.props.value[this.props.id],
      result: true,
    };
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.changeOptionResult = this.changeOptionResult.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickDown = this.onClickDown.bind(this);
    this.onClickUp = this.onClickUp.bind(this);
  }

  componentDidMount() {
    if (this.props.optionsupdatevalue === true) {
      this.props.optionsUpdate();
      this.setState({ optionResult: this.props.value[this.props.id] });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.optionsupdatevalue != prevProps.optionsupdatevalue) {
      this.props.optionsUpdate();
      this.setState({ optionResult: this.props.value[this.props.id] });
    }
  }

  changeOptionResult() {
    this.setState({ optionResult: this.props.value[this.props.id] });
  }

  handleChangeOption(optionSelected) {
    this.props.onchangeOption(optionSelected, this.props.id, this.props.result);
    this.setState({ optionResult: this.props.value[this.props.id] });
  }

  onClickDelete() {
    this.props.onClickDelete(this.props.id, this.props.result);
  }

  onClickUp() {
    this.props.onClickUp(this.props.id, this.props.result);
  }

  onClickDown() {
    this.props.onClickDown(this.props.id, this.props.result);
  }

  render() {
    const { translate } = this.props;
    const { options } = this.state;
    return (
      <div className="row mb-4 d-flex justify-content-between">
        <div
          className="col"
          style={{ display: "inline-block" }}
        >
          <div
            className="newsSettings"
            style={{ width: "100%", display: "inline-block" }}
          >
            <Select
              options={options}
              value={this.state.optionResult}
              onChange={this.handleChangeOption}
              placeholder={""}
            />
          </div>
        </div>

        <div className=" array-item-toolbox col-auto">
          <div
            className="btn-group  selectActionButtons"
            style={{ display: "inline-flex", justifyContent: "space-around" }}
          >
            <button
              type="button"
              id={this.props.id}
              onClick={this.onClickUp}
              className="btn btn-light border array-item-move-up"
              tabIndex="-1"
              style={{
                flex: "1 1 0%",
                paddingLeft: "6px",
                paddingRight: "6px",
                fontWeight: "bold"
              }}
            >
              <i className="glyphicon glyphicon-arrow-up"></i>
            </button>
            <button
              type="button"
              id={this.props.id}
              onClick={this.onClickDown}
              className="btn btn-light border array-item-move-down"
              tabIndex="-1"
              style={{
                flex: "1 1 0%",
                paddingLeft: "6px",
                paddingRight: "6px",
                fontWeight: "bold"
              }}
            >
              <i className="glyphicon glyphicon-arrow-down"></i>
            </button>
            <button
              id={this.props.id}
              type="button"
              onClick={this.onClickDelete}
              className="btn btn-danger array-item-remove"
              tabIndex="-1"
              style={{
                flex: "1 1 0%",
                paddingLeft: "6px",
                paddingRight: "6px",
                fontWeight: "bold"
              }}
            >
              <i className="glyphicon glyphicon-remove"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslate(customselect);
