import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { getNavigation } from "../../../services/index.js";
import { getGroupById } from "../../../services/group-api-services.js";
import GroupGreenCheckbox from "../../common/greenCheckbox.jsx";

export class ModalGroupInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            groupName: '',
            navigation: new Map(),
            isDataLoaded: false,
        };
    }

    componentDidMount() {
        let navigation = new Map();
        let tempContentEl = [];
        let tempRes = [];
        Promise.all([getGroupById(this.state.id), getNavigation()]).then(resonses => {
            resonses[1].data.map(element => {
                if (element.content && element.content.length !== 0) {
                    if (element.content && element.content.length > 1) {
                        tempRes = resonses[0].data.permission.filter(groupPerm => groupPerm.permission === element.permission)[0]
                        element.enable = tempRes.enable
                        if (tempRes.content.map(child => child.enable).every(enable => enable === true)) {
                            element.isAllChildrenSelected = "1";//1 if all subLevel pages enabled
                        }
                        else if (tempRes.content.map(child => child.enable).every(enable => enable === false)) {
                            element.isAllChildrenSelected = "0";//0 if all subLevel pages disabled
                        }
                        else {
                            element.isAllChildrenSelected = "2";//2 if some subLevel pages enabled
                            element.enable = true;
                        }
                        navigation.set(element.permission, element)
                        element.content.map(contentEl => {
                            tempContentEl = tempRes.content.filter(cont => cont.permission === contentEl.permission);
                            if (tempContentEl[0]) {
                                contentEl.enable = tempContentEl[0].enable;
                                contentEl.parent = element.permission;
                                navigation.set(contentEl.permission, contentEl)
                            }
                        });
                    }
                    else if (element.content && element.content.length === 1) {
                        tempRes = resonses[0].data.permission.filter(groupPerm => groupPerm.permission === element.permission)[0]
                        element.enable = tempRes.enable;
                        if (tempRes.content.map(child => child.enable).every(enable => enable === true)) {
                            element.isAllChildrenSelected = "1";
                        }
                        else if (tempRes.content.map(child => child.enable).every(enable => enable === false)) {
                            element.isAllChildrenSelected = "0";
                        }
                        else {
                            element.isAllChildrenSelected = "2";
                        }
                        navigation.set(element.permission, element);
                        if (element.content[0]) {
                            element.content[0].enable = tempRes.content[0].enable;
                            element.content[0].parent = element.permission;
                            navigation.set(element.content[0].permission, element.content[0]);
                        }
                    }
                }
                else {
                    if (resonses[0].data.permission.filter(groupPerm => groupPerm.permission === element.permission)[0]) {
                        element.enable = resonses[0].data.permission.filter(groupPerm => groupPerm.permission === element.permission)[0].enable;
                        navigation.set(element.permission, element)
                    }
                }
            })
            this.setState({ groupName: resonses[0].data.name, navigation: navigation, isDataLoaded: true })
        })
    }


    render() {
        const { translate } = this.props;
        let { groupName, navigation } = this.state;
        let navigationKey = Array.from(navigation, ([key, value]) => key)
        return (
            <React.Fragment>
                <div className="ModalGroupInfo">
                    <div className="wrapper wrapperContent animated container">
                        <div className="row mx-0">
                            <div className="col-5 font-weight-bold">
                                {translate('websitePermissions')}
                            </div>
                            <div className="col-7 font-weight-bold">
                                {translate('websitePermissionsDescription')}
                            </div>
                        </div>
                        {navigationKey.map((key, index) => {
                            let result = navigation.get(key);
                            if (result.enable) {
                                if (result.parent) {
                                    return (<div key={result.label + index} className="row align-items-center mx-0">
                                        <div className="col-5 pl-5 align-self-start text-break">
                                            <GroupGreenCheckbox disabled={true} checked={result.enable} label={translate(result.label)} mapKey={key} handleChange={() => { }} />
                                        </div>
                                        <div className="col-7 text-break">
                                            {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                        </div>
                                    </div>)
                                }
                                else if (result.isAllChildrenSelected) {
                                    return (<div key={result.label + index} className="row align-items-center mx-0">
                                        <div className="col-5 align-self-start text-break">
                                            <GroupGreenCheckbox disabled={true} checked={result.enable} label={translate(result.label)} mapKey={key} isAllChildrenSelected={result.isAllChildrenSelected} handleChange={() => { }} />
                                        </div>
                                        <div className="col-7 text-break">
                                            {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                        </div>
                                    </div>)
                                }
                                else {
                                    return (<div key={result.label + index} className="row align-items-center mx-0">
                                        <div className="col-5 align-self-start text-break">
                                            <GroupGreenCheckbox disabled={true} checked={result.enable} label={translate(result.label)} mapKey={key} handleChange={() => { }} />
                                        </div>
                                        <div className="col-7 text-break">
                                            {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                        </div>
                                    </div>)
                                }
                            }
                        }
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(ModalGroupInfo));