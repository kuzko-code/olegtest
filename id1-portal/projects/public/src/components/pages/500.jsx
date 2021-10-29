import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "../../../public/assets/css/layout/notfound.css";
import "../../../public/style/error.css";

export class ServerError extends Component {

    render() {
        const { translate } = this.props;
        var pageIsTemporarilyUnavailable = "Internal server error";
        var mainPage = "Home";
        if (translate) {
            pageIsTemporarilyUnavailable = translate('pageIsTemporarilyUnavailable');
            mainPage = translate('mainPage');
        }
        return (
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>:(</h1>
                    </div>
                    <p>500</p>
                    <p>{pageIsTemporarilyUnavailable}</p>
                    <a href="/">{mainPage}</a>
                </div>
            </div>
        )
    }
}

export default withTranslate(ServerError);