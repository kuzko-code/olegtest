import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { getMenuSettings, putMenuSettings } from "../../services";
import "../../../public/assets/css/menusettings.css";
import uuidv4 from "uuid/v4";
import TreeMenu from "react-simple-tree-menu";
import { toast } from 'react-toastify';
import "react-simple-tree-menu/dist/main.css";
import { connect } from 'react-redux';
import CreateOptionForTitleNav from './optionForTitleNav.jsx';
import SectionHeader from '../header/SectionHeader.jsx';

var isEqual = require('lodash/fp/isEqual');

export class menuSettings extends Component {

  constructor(props) {
    super(props);
    var links = [{
          value: `/${this.props.language}/newslist`,
          title: props.translate('news')
        }];

    this.props.pluginsInfo.map(plugin => {
      plugin.publicPages.map(publicPage => {
        var name = this.props.translate(publicPage.translateName) ? this.props.translate(publicPage.translateName) : publicPage.name ? publicPage.name : null;

        if (name) links.push({
          value: `${process.env.PUBLIC_HOST}/${this.props.language}/plugins/${plugin.name}${publicPage.url.startsWith('/') ? publicPage.url : "/" + publicPage.url}`,
          title: name
        });
      });
    })
    this.state = {
      navData: [],
      initialNavData: [],
      selectedKey: null,
      loading: true,
      disabled: false,
      pluginsUrl: links
    };
  }

  componentDidMount = () => {
    getMenuSettings(this.props.language)
      .then(body => {
        this.setState({
          navData: body.data.settings_object,
          initialNavData: body.data.settings_object,
          loading: false
        })
      });
  }

  searchNodeByKey(tree, key, callback) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].key === key) {
        return callback(tree, tree[i], i);
      }

      if (tree[i].nodes.length) {
        const result = this.searchNodeByKey(tree[i].nodes, key, callback);
        if (result) return result;
      }
    }
  }

  getNodeByKey(tree, key) {
    return this.searchNodeByKey(tree, key, (arr, item, index) => item);
  }

  //Мутуючий!!!
  deleteNodeByKey(tree, key) {
    return this.searchNodeByKey(tree, key, (arr, item, index) =>
      arr.splice(index, 1)
    );
  }

  moveNode(tree, key, direction) {
    return this.searchNodeByKey(tree, key, (arr, item, index) => {
      const to = direction === "up" ? index - 1 : index + 1;
      if (to < 0 || to >= tree.length) {
        return;
      }

      return this.moveElementInArray(arr, index, to);
    });
  }

  moveElementInArray(arr, from, to) {
    return arr.splice(to, 0, arr.splice(from, 1)[0]);
  }

  createEmptyNode() {
    const { translate } = this.props;
    return {
      label: translate('menuItem'),
      url: "",
      key: uuidv4(),
      nodes: []
    };
  }

  changeNavData(callback) {
    const { navData, selectedKey } = this.state;

    const clonedArray = JSON.parse(JSON.stringify(navData));
    callback(clonedArray, selectedKey);

    this.setState({ navData: clonedArray });
  }

  onNodeSelected = ({ key }) => {
    this.setState({
      selectedKey: key.substring(key.lastIndexOf("/") + 1), disabled: key.split("/").length > 1
    });
  };

  onAddNode = () => {
    this.changeNavData(clonedArray => clonedArray.push(this.createEmptyNode()));
  };

  onAddSubNode = () => {
    this.changeNavData((clonedArray, key) => {
      const selectedItem = this.getNodeByKey(clonedArray, key);
      selectedItem.nodes.push(this.createEmptyNode());
    });
  };

  onPropertiesChange = (value) => {
    if (value)
      this.changeNavData((clonedArray, key) => {
        const selectedItem = this.getNodeByKey(clonedArray, key);
        selectedItem["label"] = value.title === " " ? value.title.trimStart() : value.title;
        selectedItem["url"] = value.value === " " ? value.value.trimStart() : value.value;
      });
  };

  onPropertyChange = (propertyName, value) => {
    this.changeNavData((clonedArray, key) => {
      const selectedItem = this.getNodeByKey(clonedArray, key);
      selectedItem[propertyName] = value[0] === " " ? value.trimStart() : value;
    });
  };

  onDeleteNode = () => {
    const { navData, selectedKey } = this.state;

    const clonedArray = JSON.parse(JSON.stringify(navData));
    this.deleteNodeByKey(clonedArray, selectedKey);

    this.setState({ navData: clonedArray, selectedKey: null });
  };

  onMoveNode = direction => {
    this.changeNavData((clonedArray, key) =>
      this.moveNode(clonedArray, key, direction)
    );
  };

  onSave = () => {
    const { translate, language } = this.props;
    let { navData, initialNavData } = this.state;

    navData.map(menuItem => {
      menuItem.label = menuItem.label.trim();
      menuItem.url = menuItem.url.trim();
    })
    putMenuSettings(JSON.stringify(navData), language).then((res) => {
      if (res.status != "ok") {
        toast.error(translate('errorOccurredWhileSavingTheSettings'));
        return;
      }
      this.setState({ initialNavData: navData })
      toast.success(translate('changesSavedSuccessfully'));
    })
  };


  render() {
    const { translate } = this.props;
    const { navData, selectedKey, loading, disabled, initialNavData, pluginsUrl } = this.state;

    if (loading) {
      return null;
    }

    var selectedNode = this.getNodeByKey(navData, selectedKey);

    const treeView = (
      <TreeMenu
        data={navData}
        onClickItem={this.onNodeSelected}
        hasSearch={false}
      />
    );
    const editForm = (
      <form>
        <div className="form-group">
          <label>{translate('title')}</label>
          <CreateOptionForTitleNav pluginsUrl={pluginsUrl} {...this.props} selectedNode={selectedNode} onPropertiesChange={this.onPropertiesChange} onPropertyChange={this.onPropertyChange} />
          {/* <input
            value={selectedNode ? selectedNode.label : ""}
            disabled={!selectedNode}
            onChange={e => this.onPropertyChange("label", e.target.value)}
            className="form-control border-radius-1 shadow-none"
            placeholder={translate('enterATitle')}
            required
          /> */}
        </div>
        <div className="form-group">
          <label>{translate('webUrl')}</label>
          <input
            value={selectedNode ? selectedNode.url : ""}
            disabled={!selectedNode}
            onChange={e => this.onPropertyChange("url", e.target.value)}
            className="form-control border-radius-1 shadow-none"
            placeholder={translate('enterWebUrl')}
          />
        </div>
      </form>
    );

    const buttons = (
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-mint-green"
          onClick={this.onAddNode}
        >
          {translate('addItem')}
        </button>
        <button
          type="button"
          className="btn btn-mint-green"
          disabled={!selectedKey || disabled}
          onClick={this.onAddSubNode}
        >
          {translate('addSubItem')}
        </button>
        <button
          type="button"
          className="btn btn-mint-green"
          disabled={!selectedKey}
          onClick={this.onDeleteNode}
        >
          {translate('delete')}
        </button>
        <button
          type="button"
          className="btn btn-mint-green"
          disabled={!selectedKey}
          onClick={e => this.onMoveNode("up")}
        >
          {translate('up')}
        </button>
        <button
          type="button"
          className="btn btn-mint-green"
          disabled={!selectedKey}
          onClick={e => this.onMoveNode("down")}
        >
          {translate('down')}
        </button>
        <button
          type="button"
          className="btn btn-mint-green"
          onClick={this.onSave}
          disabled={isEqual(navData, initialNavData)}
        >
          {translate('save')}
        </button>
      </div>
    );

    return (
      <div>
        <SectionHeader title={translate('navigation')} />
        <div className="container mt-4 left1px">
          <div className="row">
            <div className="col-sm">
              <div className="pageElementBox collapsed border-bottom">
                <div className="pageElementBoxTitle border-bottom-0">{translate('itemsList')}</div>
                <div className="pageElementBoxContent" style={{ display: "block" }}>
                  {treeView}
                </div>
              </div>
            </div>
            <div className="col-sm">
              <div className="pageElementBox collapsed border-bottom">
                <div className="pageElementBoxTitle border-bottom-0">{translate('itemsList')}</div>
                <div className="pageElementBoxContent" style={{ display: "block" }}>
                  {editForm}
                  {buttons}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    pluginsInfo: state.reducerPlugins
  };
};

export default connect(mapStateToProps)(withTranslate(menuSettings));