import React from "react";
import { withTranslate } from "react-redux-multilingual";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import RubricButton from "../../../RubricButton/RubricButton.jsx";
import { formatDate } from "../../../../services/helpers.js";

import "./SliderItem.css";

const SliderItem = ({ data, localCode, locateForURL }) => {
    return (
        <div className="slider-item">
            <div className="slider-item-thumb">
                <Link to={`${locateForURL}/news/${data.id}`}>
                    <img src={data.main_picture}
                        alt={data.title}
                        title={data.title}
                    />
                </Link>
            </div>
            <div className="slider-item-content">
                <RubricButton rubric={data.rubric} className="slider-item-rubric" />
                <h3 className="slider-item-title">
                    <Link to={`${locateForURL}/news/${data.id}`}>
                        {data.title}
                    </Link>
                </h3>
                <div className="slider-item-date">
                    {formatDate(data.published_date, localCode)}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        locateForURL: `/${state.Intl.locale}`
    };
};

export default connect(mapStateToProps)(withTranslate(SliderItem));