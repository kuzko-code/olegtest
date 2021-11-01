import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import './RubricButton.css';
export class RubricButton extends Component {
    render() {
        const { rubric, translate, locateForURL, className } = this.props;
        return (
            <div className={className}>
                {rubric ?
                    <Link
                        className="rubric-button"
                        to={`${locateForURL}/newslist?rubric=${rubric.id}`}>
                        {rubric.title}
                    </Link> :
                    <Link
                        className="rubric-button"
                        to={`${locateForURL}/newslist?rubric=0`}>
                        {translate('withoutRubrics')}
                    </Link>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        locateForURL: `/${state.Intl.locale}`,
    };
};

export default connect(mapStateToProps)(withTranslate(RubricButton));