import React, { Component } from "react";
import classnames from "classnames";
import { withTranslate } from "react-redux-multilingual";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
    getNewsByIds,
} from "../../../services/index.js";
import { connect } from 'react-redux'
import * as actions from '../../../redux/settings/actions.js';
import SliderItem from "./SliderItem/SliderItem.jsx";

import "./SliderNews.css";
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
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4500,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
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

        return (
            <div className="slider-news" >
                {number == 0 ? (
                    <>
                        <div className="row d-none d-md-flex align-content-center">
                            <div className="col-md-8 col-sm pr-md-0">
                                <Slider {...settings} className="slider-style mr-md-2 h-100 big-slider">
                                    {slider1.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                            <div className="col-md-4 col-sm d-flex flex-column align-content-between justify-content-between pl-md-0">
                                <Slider {...settings} className="slider-style pb-md-0 small-slider">
                                    {slider2.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                                <Slider {...settings} className="slider-style small-slider">
                                    {slider3.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                        </div>
                        <div className="row d-block d-md-none">
                            <div className="col">
                                <Slider {...settings} className="slider-style big-slider">
                                    {[...slider1, ...slider2, ...slider3].map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </>
                ) : number == 1 ? (
                    <>
                        <div className="row d-none d-md-flex align-content-center">
                            <div className="col-md-6 col-sm pr-md-0 first-of-two-slides">
                                <Slider {...settings} className="slider-style big-slider">
                                    {slider1.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                            <div className="col-md-6 col-sm pl-md-0 second-of-two-slides">
                                <Slider {...settings} className="slider-style big-slider">
                                    {slider2.map((res, i) => (
                                        <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                    ))}
                                </Slider>
                            </div>
                        </div>
                        <div className="row d-block d-md-none">
                            <div className="col">
                                <Slider {...settings} className="slider-style big-slider">
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
                            <Slider {...settings} className="slider-style big-slider">
                                {slider1.map((res, i) => (
                                    <SliderItem key={i} data={res} localCode={this.props.translate('localeCode')} locateForURL={locateForURL} />
                                ))}
                            </Slider>
                        </div>
                    </div>
                ) : null}
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