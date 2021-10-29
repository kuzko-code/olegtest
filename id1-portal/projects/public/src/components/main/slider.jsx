import React, { Component } from "react";
import classnames from "classnames";
import "../../../public/assets/css/layout/mainpage.css";
import { withTranslate } from "react-redux-multilingual";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "font-awesome/css/font-awesome.min.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    getNewsByIds,
} from "../../services/index.js";
import { connect } from 'react-redux'
import * as actions from '../../redux/settings/actions.js';
import RubricButton from "../news/rubricButton.jsx";
import { formatDate } from "../../services/helpers.js";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div className={className} onClick={onClick} >
            <i>
                <FontAwesomeIcon className="color777" icon={['fas', 'angle-right']} />
            </i>
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        />
    );
}

const SliderItem = ({ data, localCode, locateForURL, key }) => {
    return (
        <div key={data.id + key} className="backround card w-100 h-100">
            <div className="w-100 post-overaly-style resized-img-container">
                <img src={data.main_picture} alt={data.title} title={data.title} />
            </div>

            <div className="textInSlider SliderItem card-img-overlay d-flex align-items-end">
                <div className="sliderNewsInfo">
                    <RubricButton rubric={data.rubric}></RubricButton>
                    <div className="sliderContent">
                        <div className="titleOfSliderElement weight">
                            <Link to={`${locateForURL}/news/${data.id}`}
                                className="linkSlider"
                            >

                                {data.title}
                            </Link>
                        </div>
                        <span className="sliderNewsDate">
                            {formatDate(data.published_date, localCode)}
                        </span>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
};

export class Sliders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider1: [],
            slider2: [],
            slider3: [],
            number: 0
        };
        this.loadingData = this.loadingData.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.loadingData();
    }

    loadingData() {
        let { slider1, slider2, slider3 } = this.state;
        const { language, bannerData } = this.props

        if (bannerData.length === 3) {
            Promise.all([
                getNewsByIds(bannerData[0], language),
                getNewsByIds(bannerData[1], language),
                getNewsByIds(bannerData[2], language)
            ]).then(resNews => {
                bannerData[0].map(obj => {
                    let news = resNews[0].data.filter(res => res.id == obj);
                    slider1.push(news[0]);
                });
                bannerData[1].map(obj => {
                    let news = resNews[1].data.filter(res => res.id == obj);
                    slider2.push(news[0]);
                });
                bannerData[2].map(obj => {
                    let news = resNews[2].data.filter(res => res.id == obj);
                    slider3.push(news[0]);
                });
                slider1 = slider1.filter(res => res !== undefined);

                this.setState({
                    slider1: slider1,
                    slider2: slider2,
                    slider3: slider3,
                    number: 0
                });
            });
        }
        else if (bannerData.length === 2) {
            Promise.all([
                getNewsByIds(bannerData[0], language),
                getNewsByIds(bannerData[1], language)
            ]).then(res2 => {

                bannerData[0].map(obj => {
                    let news = res2[0].data.filter(res => res.id == obj);
                    slider1.push(news[0]);
                });
                bannerData[1].map(obj => {
                    let news = res2[1].data.filter(res => res.id == obj);
                    slider2.push(news[0]);
                });
                this.setState({
                    slider1: slider1,
                    slider2: slider2,
                    number: 1
                });
            });
        }
        else if (bannerData.length === 1) {
            Promise.all([getNewsByIds(bannerData[0], language)]).then(
                res3 => {
                    bannerData[0].map(obj => {
                        let news = res3[0].data.filter(res => res.id == obj);
                        slider1.push(news[0]);
                    });
                    this.setState({
                        slider1: slider1,
                        number: 2,
                    });
                }
            );
        }
        else {
            this.setState({
                number: 3,
            });
        }
    }

    render() {

        const { locateForURL } = this.props;
        var { slider1, slider2, slider3, number } = this.state;
        slider1 = slider1.filter(temp => { if (temp) return temp; });
        slider2 = slider2.filter(temp => { if (temp) return temp; });
        slider3 = slider3.filter(temp => { if (temp) return temp; });

        var settings = {
            infinite: true,
            speed: 2000,
            // slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4500,
            // nextArrow: <SampleNextArrow />,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        // slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        // slidesToShow:2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 420,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        var colorThemeWidget = classnames({
            'widget': true,
            'color-default': true,
            'color-theme': true
        });

        return (
            <div className={`tab-content movable-widget NewsSlidersBanner ${colorThemeWidget}`} >
                <div className="animated active">
                    {number == 0 ? (
                        <>
                            <div className="row align-content-center big-slider">
                                <div className="col-md-8 col-sm pr-md-0">
                                    <Slider {...settings} className="slide-1 home-slider mr-md-2 h-100">
                                        {slider1.map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                                <div className="col-md-4 col-sm d-flex flex-column align-content-between justify-content-between pl-md-0 smallSlider">
                                    <Slider {...settings} className="slide-1 home-slider pb-md-0">
                                        {slider2.map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {slider3.map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                            <div className="row mobile-slider">
                                <div className="col">
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {[...slider1, ...slider2, ...slider3].map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </>
                    ) : number == 1 ? (
                        <>
                            <div className="row align-content-center big-slider">
                                <div className="col-md-6 col-sm pr-md-0 first-of-two-slides">
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {slider1.map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                                <div className="col-md-6 col-sm pl-md-0 second-of-two-slides">
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {slider2.map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                            <div className="row mobile-slider">
                                <div className="col">
                                    <Slider {...settings} className="slide-1 home-slider">
                                        {[...slider1, ...slider2].map((res, i) => (
                                            <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </>
                    ) : number == 2 ? (
                        <div className="row">
                            <div className="col">
                                <Slider {...settings} className="slide-1 home-slider">
                                    {slider1.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale,
        locateForURL: `/${state.Intl.locale}`
    };
};

export default connect(mapStateToProps, actions)(withTranslate(Sliders));