import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { StickySidebar } from '../../components/layouts/StickySidebar/StickySidebar.jsx';

import NewsInBlockView from '../../components/widget/NewsInBlockView/index.jsx';//"rubric"

import SliderNews from '../../components/widget/SliderNews/SliderNews.jsx';
import SliderLinks from '../../components/widget/SliderLinks/SliderLinks.jsx';
import LinkWrapper from '../../components/widget/LinkWrapper/LinkWrapper.jsx';//"linkWrapper"
import NewsViewRubric from '../../components/widget/NewsViewRubric/NewsViewRubric.jsx';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.min.css';

import '../../../public/slider-style.css';
import './MainPage.css';

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getBanner = (banner) => {
    if (!banner) return null;

    switch (banner.type_title) {
      case 'sliderNews':
        return banner.form_data && banner.form_data.length > 0 &&
          <SliderNews key={banner.id} bannerData={banner.form_data} />
      case 'sliderLinks':
        return banner.form_data && banner.form_data.elements &&
          banner.form_data.elements.length > 0 &&
            <SliderLinks key={banner.id} data={banner.form_data.elements} />

      case 'linkWrapper':
        return banner.form_data &&
          <LinkWrapper key={banner.id} data={banner.form_data} />
      // //Left
      case 'rubric':
        return banner.form_data &&
          <NewsInBlockView
            key={banner.id}
            form_data={banner.form_data}
            rubricTitle={banner.type_title}
            showLink={banner.form_data.showLinksToAllNews}
          />
      case 'blockViewRubric':
      case 'listViewRubric':
        return banner.form_data &&
          <NewsViewRubric
            key={banner.id}
            form_data={banner.form_data}
            rubricTitle={banner.type_title}
            showLink={banner.form_data.showLinksToAllNews}
          />
      default:
        if (this.props.reducerPluginsTabs) {
          const tabFromPlugins = this.props.reducerPluginsTabs[banner.type_title];
          if (tabFromPlugins && tabFromPlugins.pluginName && tabFromPlugins.viewOfTab) {
            try {
              const View = (require(`../../plugins/${tabFromPlugins.pluginName}/${tabFromPlugins.viewOfTab}`).default) || (() => <></>);
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
    const { bannersPosition } = this.props;

    return (
      <div className="main-page">
        {/* Top */}
        {bannersPosition.locationOfTopBanners.map(this.getBanner)}
        {/* Left */}
        <div className="row">
          <div className="col-lg-8 col-md-12 mt-2">
            {bannersPosition.locationOfLeftBanners.map(this.getBanner)}
          </div>
          <div className="col-lg-4 col-md-12 mt-2 sticky-block-wrapper">
            <StickySidebar boundaryElement=".sticky-block-wrapper" />
          </div>
        </div>
        {/* Bottom */}
        {bannersPosition.locationOfBottomBanners.map(this.getBanner)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.reducerSettings.Layout,
    language: state.Intl.locale,
    bannersPosition: state.reducerSettings.BannersPosition,
    reducerPlugins: state.reducerPlugins,
    reducerPluginsTabs: state.reducerPluginsTabs
  };
};

export default connect(
  mapStateToProps,
)(withTranslate(MainPage));
