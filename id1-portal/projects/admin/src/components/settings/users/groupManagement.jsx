import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { getNavigation } from "../../../services/index.js";
import { updateGroups, getGroupById } from "../../../services/group-api-services.js";
import GroupGreenCheckbox from "../../common/greenCheckbox.jsx";
import SectionHeader from '../../header/SectionHeader.jsx';

export class GroupManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            groupName: '',
            checked: false,
            navigation: new Map(),
            redirect: false,
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

    handleChangeCheckBox = mapKey => event => {
        let { navigation } = this.state;
        let navEl = navigation.get(mapKey);
        if (navEl.parent) {
            let parent = navigation.get(navEl.parent);
            navEl.enable = !navEl.enable;

            if (parent.content.map(child => child.enable).every(enable => enable === true)) {
                parent.isAllChildrenSelected = "1";
                parent.enable = true
                navigation.set(navEl.parent, parent)
            }
            else if (parent.content.map(child => child.enable).every(enable => enable === false)) {
                parent.isAllChildrenSelected = "0";
                parent.enable = false
                navigation.set(navEl.parent, parent)

            }
            else {
                parent.isAllChildrenSelected = "2";
                parent.enable = true;
                navigation.set(navEl.parent, parent)
            }
        }
        else if (navEl.isAllChildrenSelected) {
            let tempChild = [];
            if (parseInt(navEl.isAllChildrenSelected) === 1) {
                navEl.isAllChildrenSelected = "0";
                navEl.enable = false;
                navEl.content.map(child => {
                    if (navigation.has(child.permission)) {
                        tempChild = navigation.get(child.permission);
                        tempChild.enable = false;
                        navigation.set(child.permission, tempChild)
                    }
                })
            }
            else if (parseInt(navEl.isAllChildrenSelected) === 0) {
                navEl.isAllChildrenSelected = "1";

                navEl.enable = true;
                navEl.content.map(child => {
                    if (navigation.has(child.permission)) {
                        tempChild = navigation.get(child.permission);
                        tempChild.enable = true;
                        navigation.set(child.permission, tempChild)
                    }
                })
            }
            else if (parseInt(navEl.isAllChildrenSelected) === 2) {
                navEl.isAllChildrenSelected = "1";

                navEl.enable = true;
                navEl.content.map(child => {
                    if (navigation.has(child.permission)) {
                        tempChild = navigation.get(child.permission);
                        tempChild.enable = true;
                        navigation.set(child.permission, tempChild)
                    }
                })
            }
        }
        else {
            navEl.enable = !navEl.enable;
        }
        navigation.set(mapKey, navEl)
        this.setState({ navigation: navigation });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { translate } = this.props;
        let groupPermission = JSON.stringify({
            id: parseInt(this.state.id),
            name: this.state.groupName,
            permission: Array.from(this.state.navigation).filter(element => element[1].enable === true).map(element => element[0])
        })
        updateGroups(groupPermission).then(res => {
            if (res.status === "ok") {
                toast.success(translate('groupSuccessfullyUpdated'));
                this.setState({ redirect: true });
            }
            else {
                toast.error(translate('errorOccurredWhileUpdatingTheGroup'));
            }
        })
    }

    render() {
        const { translate } = this.props;
        let { groupName, navigation, checked, redirect } = this.state;
        let navigationKey = Array.from(navigation, ([key, value]) => key)
        if (redirect) {
            this.setState({ redirect: false });
            return <Redirect push to={`/usersAndGroups_settings`} />;
        }
        return (
            <React.Fragment>

                <div className="GroupManagement">
                    <SectionHeader title={translate('groupRightsConfiguring')} description={
                        <div className="d-flex">
                            <h6 className="font-weight">{translate('usersAndGroups')}&nbsp;&nbsp;/&nbsp;&nbsp;</h6><h6 className="font-weight-bold">{groupName}</h6>
                        </div>
                    } />

                    <form onSubmit={this.handleSubmit}>
                        <div className="wrapper wrapperContent animated fadeInRight col-lg-10 col-xl-8">
                            <div className="pageElementBoxContent mb-4">
                                <div className="row">
                                    <div className="col-5 font-weight-bold">
                                        {translate('websitePermissions')}
                                    </div>
                                    <div className="col-7 font-weight-bold">
                                        {translate('websitePermissionsDescription')}
                                    </div>
                                </div>
                                {navigationKey.map((key, index) => {
                                    let result = navigation.get(key);
                                    if (result.parent) {
                                        return (<div key={result.label + index} className="row align-items-center">
                                            <div className="col-5 pl-5 align-self-start text-break">
                                                <GroupGreenCheckbox checked={result.enable} label={translate(result.label)} mapKey={key} handleChange={this.handleChangeCheckBox} />
                                            </div>
                                            <div className="col-7 text-break">
                                                {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                            </div>
                                        </div>)
                                    }
                                    else if (result.isAllChildrenSelected) {
                                        return (<div key={result.label + index} className="row align-items-center">
                                            <div className="col-5 align-self-start text-break">
                                                <GroupGreenCheckbox checked={result.enable} label={translate(result.label)} mapKey={key} isAllChildrenSelected={result.isAllChildrenSelected} handleChange={this.handleChangeCheckBox} />
                                            </div>
                                            <div className="col-7 text-break">
                                                {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                            </div>
                                        </div>)
                                    }
                                    else {
                                        return (<div key={result.label + index} className="row align-items-center">
                                            <div className="col-5 align-self-start text-break">
                                                <GroupGreenCheckbox checked={result.enable} label={translate(result.label)} mapKey={key} handleChange={this.handleChangeCheckBox} />
                                            </div>
                                            <div className="col-7 text-break">
                                                {result.translateDescription && translate(result.translateDescription) !== undefined ? translate(result.translateDescription) : result.description ? result.description : null}
                                            </div>
                                        </div>)
                                    }
                                }
                                )}
                            </div>
                            <div>
                                <span className=" group-button" >
                                    <Link to={`/usersAndGroups_settings`}> <button type="button" className="btn btn-light border button-right">{translate('cancel')}</button></Link>
                                    <button
                                        type="submit"
                                        className="btn btn-mint-green"
                                        disabled={!this.state.isDataLoaded}
                                    >
                                        {translate('saveChanges')}
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
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

export default connect(mapStateToProps)(withTranslate(GroupManagement));