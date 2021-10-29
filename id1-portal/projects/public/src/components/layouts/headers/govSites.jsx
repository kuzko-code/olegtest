import React, { useState } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../../redux/settings/actions.js';
import classNames from "classnames";
import { withTranslate } from 'react-redux-multilingual';
import CustomLink from '../../util/CustomLink.jsx'

const GovSites = (props) => {
    const [showModal, setShowModal] = useState(false);

    const links = props.sites;
    const { translate } = props;

    let overlay = "d-none";

    let modal = classNames("sites-modal", {
        "d-none": !showModal,
        "row": showModal,
        'modal-color': true,
    });

    if (showModal) {
        overlay = "sites-overlay";
    }

    const getLists = (colum) => {
        let linksResult = [];
        for (let i = 0; i < links.length; i += 1) {
            if (i % 2 === colum) {
                linksResult.push
                    (<li key={i}>
                        <CustomLink url={links[i].url} className="site-title">{links[i].title}</CustomLink>
                    </li>)
            }
        }
        return linksResult;
    };

    return (
        <div>
            {links && links.length > 0 ? (
                <div>
                    <div className={overlay} onClick={() => setShowModal(false)}></div>
                    <div className="row" onClick={() => setShowModal(!showModal)}>
                        <div className="sites-logo"></div>
                        <div className="d-flex flex-column ml-2 justify-content-between">
                            <span className="gov-title">
                                gov.ua
                            </span>
                            <span className="gov-description">
                                {
                                    translate('govSites')
                                }
                            </span>
                        </div>
                    </div>
                    <div className={modal}>
                        <span onClick={() => setShowModal(false)}>&times;</span>
                        <ul>
                            {
                                getLists(0)
                            }
                        </ul>
                        <ul className="second-list">
                            {
                                getLists(1)
                            }
                        </ul>
                        <ul className="mobile">
                            {
                                links.map((item, i) => (
                                    <li key={i}>
                                        <CustomLink url={item.url} className="site-title">{item.title}</CustomLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        layout: state.reducerSettings.Layout
    };
};

export default connect(mapStateToProps, actions)(withTranslate(GovSites));