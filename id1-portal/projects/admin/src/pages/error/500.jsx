import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "../../../public/css/error.css";

class ServerError extends Component {

    render() {
        return (
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>:(</h1>
                    </div>
                    <p></p>
                    <p></p>
                    <p>500 Internal server error</p>
                                      
                    <a href="/">Home</a>
                </div>
            </div>
        )
    }
}

export default withTranslate(ServerError);