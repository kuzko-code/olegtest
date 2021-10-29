import React from 'react';
import "../../public/css/bootstrap.min.css";
import "../../public/css/style.css";
import "../../public/css/font-glyphicons.css"
import Header from "./common/headers/header.jsx";
import Sidebar from "./common/siteBar/siteBar.jsx";
import { Helmet } from "react-helmet";
import {withTranslate} from 'react-redux-multilingual';

export default withTranslate(function (props) {
    return (
        <div id="wrapper" style={{ height: "100%" }}>
            <Helmet>
                <title>{props.translate('administrationPanel')}</title>
                <link rel="icon" href={props.reducerLogo} />
            </Helmet>
            <Sidebar />
            <div id="pageWrapper" className="gray-bg" style={{ width: "100%", height: "100%", overflowX: "hidden" }}>
                <Header />
                {props.children}
            </div>
        </div>
    )
})