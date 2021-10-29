import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import RightPanelNews from './rightPanelNews.jsx';
import SocialNetwork from './socialNetwork.jsx';
import Banner from './banner.jsx';
import FacebookPage from '../../facebook/facebook-page.jsx';
import BlockLinks from './blockLinks.jsx';
import PopularTags from "../../news/popularTags.jsx";
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import PropTypes from 'prop-types';

import SubscribeNews from './subscribeNews.jsx';

export class RightPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: this.props.tag
    };
  }

  static propTypes = {
    tag: PropTypes.string,
    onChangeTag: PropTypes.func,
  }

  activateTags = (event) => {
    event.preventDefault;
    this.setState({ tag: event.target.attributes[0].value });
    this.props.onChangeTag(event.target.attributes[0].value);
  }

  getBanner = (banner) => {
    if (!banner) return null;
    switch (banner.type_title) {
      case 'socialNetworks':
        return <SocialNetwork key={banner.id} colorThemeWidget={this.props.colorThemeWidget} />;
      case 'latestNews':
      case 'popularNews':
        return banner.form_data &&
          banner.form_data.numberOfNews > 0 &&
          <RightPanelNews
            key={banner.id}
            colorThemeWidget={this.props.colorThemeWidget}
            title={banner.type_title}
            form_data={banner.form_data}
          />
      case 'linkEditor':
        return banner.form_data &&
          <Banner
            key={banner.id}
            colorThemeWidget={this.props.colorThemeWidget}
            form_data={banner.form_data}
          />
      case 'blockLinks':
        return banner.form_data &&
          <BlockLinks key={banner.id} form_data={banner.form_data} />;
      case 'popularTags':
        return <div key={banner.id} className="widget widget-tags color-theme">
          <PopularTags
            activeTag={this.state.tag}
            activateTags={this.activateTags}
          />
        </div>
      case 'mailing':
        return <SubscribeNews />
      case 'facebookPage':
        return banner.form_data &&
          <FacebookPage key={banner.id} form_data={banner.form_data} />
      default:
        if (this.props.reducerPluginsTabs) {
          const tabFromPlugins = this.props.reducerPluginsTabs[banner.type_title];
          if (tabFromPlugins && tabFromPlugins.pluginName && tabFromPlugins.viewOfTab) {
            try {
              const View = (require(`../../../plugins/${tabFromPlugins.pluginName}/${tabFromPlugins.viewOfTab}`).default) || (() => <></>);
              return View({ form_data: banner.form_data });
            }
            catch (e) {
              console.error("Error in plugin banner view: ", e);
              return null;
            }
          }
        }
        return null;
    }
  }


  render() {
    const { rightBannersPosition } = this.props;

    return (
      <div className="tab-content">
        <div className="animated active">
          {rightBannersPosition.map(this.getBanner)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    rightBannersPosition:
      state.reducerSettings.BannersPosition.locationOfRightBanners,
    reducerPlugins: state.reducerPlugins,
    reducerPluginsTabs: state.reducerPluginsTabs
  };
};
const urlPropsQueryConfig = {
  tag: { type: UrlQueryParamTypes.string }
};

export default connect(mapStateToProps)(withTranslate(addUrlProps({ urlPropsQueryConfig })(RightPanel)));
