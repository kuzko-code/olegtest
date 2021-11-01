import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import shortid from 'shortid';
import Slider from "react-slick";
import { CustomLink } from '../../ReExportComponents.js';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import "./SliderLinks.css"

const SliderItem = ({ file, title, url, parentClasses, index }) => {
    return (
        <div className={parentClasses} key={index}>
            {
                !title && url ?
                    <CustomLink url={url}>
                        <img src={file} alt={title || url} />
                    </CustomLink> :
                    <img src={file} alt={title || 'ImgLink'} />
            }
            {
                title && (url ?
                    <CustomLink url={url} className="title">
                        <span>{title}</span>
                    </CustomLink> :
                    <span className="title">
                        <span>{title}</span>
                    </span>)
            }
        </div>
    );
}

const SliderLinks = (props) => {
    const links = props.data;
    const matches = useMediaQuery('(max-width:768px)');
    const sliderSettings = {
        infinite: true,
        speed: 2000,
        slidesToShow: links.length > 4 ? 5 : links.length,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: links.length > 4 ? 5 : links.length,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: links.length > 2 ? 3 : links.length,
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

    const width = matches ? `calc(33.3% * ${links.length > 2 ? 3 : links.length})` : `calc(20% * ${links.length > 4 ? 5 : links.length})`;
    return (
        <div className="d-flex justify-content-center my-2">
            <div style={{ width }} className="slider-links-wrapper">
                {
                    links.length > 0 &&
                    <Slider {...sliderSettings} className="slider-style slider-links">
                        {links.map((item, i) => (
                            <SliderItem
                                key={shortid.generate()}
                                file={item.file}
                                url={item.url}
                                title={item.title}
                                index={i}
                                parentClasses="slider-links-item"
                            />
                        ))}
                    </Slider>
                }
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(SliderLinks));