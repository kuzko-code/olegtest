import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

export class NotFound extends Component {

    render(){
        const { translate } = this.props;
        return (
            <div>
                <p className="error-description">{translate('pageNotFound')}</p>
                <p className="error-proposition">{translate('pageNotFoundDescription')} &nbsp; <a href="/">{translate('pageNotFoundMainPageLink')}</a></p>
            </div>
        )
    }
}

export default withTranslate(NotFound);