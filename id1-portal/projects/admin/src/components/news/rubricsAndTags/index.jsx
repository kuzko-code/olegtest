import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import Rubrics from "./rubrics.jsx";
import Tags from "./tags.jsx";
import SectionHeader from '../../header/SectionHeader.jsx';
import "../../../../public/assets/css/newslist.css";

export class RubricsAndTags extends Component {

    render() {
        const { translate } = this.props;

        return (
            <div>
                <SectionHeader title={translate('rubricsAndTags')} />
                <div className="RubricsTags">
                    <div className="wrapper wrapperContent animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="rubric">
                                    <Rubrics />
                                </div>
                            </div>
                            <div className="col-lg-6 tag mt-4 mt-lg-0">
                                <div className="tag">
                                    <Tags />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
export default withTranslate(RubricsAndTags);
