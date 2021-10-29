import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import  UserSettings  from "./userSettings.jsx";
import  GroupSettings  from "./groupSettings.jsx";
import { getGroups } from "../../../services/group-api-services.js"
import { connect } from 'react-redux';
import SectionHeader from '../../header/SectionHeader.jsx';

export class UsersAndGroups extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groupsList:[]
        };
    }

componentDidMount(){
    getGroups().then(resonses => {
        let groupsList=resonses.data;
        groupsList.map(group=>{
            group.label=group.name;
            group.value=group.id;
        })
        this.setState({ groupsList: groupsList});
    })
}

handleChangeGroupsList=(groupsList)=>{
    this.setState({groupsList:groupsList})
}

    render() {
        const{translate}=this.props;
    let {groupsList}= this.state;
        return (
            <div>
                <SectionHeader title={translate('usersAndGroups')} />
                <div className="UsersAndGroups">
                    <div className="wrapper wrapperContent animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="Users">
                                    <UserSettings handleChangeGroupsList={this.handleChangeGroupsList} groupsList={groupsList}/>
                                </div>
                            </div>
                            <div className="col-lg-5 tag mt-4 mt-lg-0">
                                <div className="Groups">
                                    <GroupSettings userRole={this.props.role} handleChangeGroupsList={this.handleChangeGroupsList} groupsList={groupsList}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.currentUser.role
    };
};
       
export default connect(mapStateToProps)(withTranslate(UsersAndGroups));
