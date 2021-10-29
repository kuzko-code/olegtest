import React, { Component } from 'react';
import classnames from 'classnames';
import '../../../public/assets/css/layout/mainpage.css';
import { withTranslate } from 'react-redux-multilingual';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import NewsInBlockView from './newsInBlockView/index.jsx';
import { connect } from 'react-redux';
import RightPanel from '../layouts/rightPanel/index.jsx';
import SliderNews from './slider.jsx';
import SliderLinks from './sliderLinks.jsx';
import LinkWrapper from './linkWraper.jsx';
import NewsViewRubric from './NewsViewRubric.jsx';
import Sticky from 'react-sticky-el';

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
          <div className="d-flex justify-content-center">
            <SliderLinks key={banner.id} data={banner.form_data.elements} />
          </div>
      case 'linkWrapper':
        return banner.form_data && <LinkWrapper key={banner.id} data={banner.form_data} />
      //Left
      case 'rubric':
        return banner.form_data && <NewsInBlockView
          key={banner.id}
          color={this.props.layout.colorTheme}
          form_data={banner.form_data}
          rubricTitle={banner.type_title}
          showLink={banner.form_data.showLinksToAllNews}
        />
      case 'blockViewRubric':
      case 'listViewRubric':
        return banner.form_data && <NewsViewRubric
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
    var colorThemeWidget = classnames({
      widget: true,
      'color-default': true,
      'color-theme': true,
    });


    return (
      <div className="indent" id="indent">
        <React.Fragment>
          {/* Top */}
          {bannersPosition.locationOfTopBanners.map(this.getBanner)}
          {/* Left */}
          <div className="row" id="Sidebar-sticky-row">
            <div className="col-lg-8 col-md-12 mt-4">
              {bannersPosition.locationOfLeftBanners.map(this.getBanner)}
            </div>
            <div className="col-lg-4 col-md-12 mt-4 mobile-right-sidebar sticky-block-wrapper">
              <Sticky
                topOffset={-50}
                stickyClassName={"sticky-block"}
                boundaryElement=".sticky-block-wrapper"
                hideOnBoundaryHit={false}
              >
                <div className="sidebar sidebar-right">
                  {/* Right */}
                  <RightPanel colorThemeWidget={colorThemeWidget} />
                </div>
              </Sticky>
            </div>
          </div>
          {/* Bottom */}
          {bannersPosition.locationOfBottomBanners.map(this.getBanner)}
        </React.Fragment>
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
