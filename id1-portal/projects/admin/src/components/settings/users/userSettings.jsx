import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table'
import "../../../../public/assets/css/newslist.css"
//services
import { getUsers, postUser, putUser, delUser } from "../../../services/user-api-services.js";
import { toast } from 'react-toastify';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { REGULAR_EXPRESSIONS } from "../../../../config/index.jsx";
import { connect } from 'react-redux';
import Select from 'react-select';
import { components } from 'react-select';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import classnames from 'classnames';
var isEqual = require('lodash/fp/isEqual');

const DropdownIndicator = (
    props
) => {
    return (
        <components.DropdownIndicator {...props}>
            <ArrowDropDownIcon />
        </components.DropdownIndicator>
    );
};

const _rolePriorities = [
    {
        id: 1,
        role: "root_admin",
        name: "rootAdmin"
    },
    {
        id: 2,
        role: "global_admin",
        name: "globalAdmin"
    },
    {
        id: 3,
        role: "group_admin",
        name: "groupAdmin"
    },
    {
        id: 4,
        role: "content_admin",
        name: "contentAdmin"
    }

]

export class UserSettings extends Component {
    constructor(props) {
        super(props);
        var internalrole = this.props.currentUser.internalrole;
        var found = _rolePriorities.find(function (element) {
            return element.role === internalrole;
        });
        var allowedGroups = _rolePriorities.filter(function (element) {
            return element.id > found.id || (element.id === 2 && found.id === 2);
        });

        var lookupGroups = {};
        allowedGroups.map(res => {
            lookupGroups = Object.assign(lookupGroups, { [res.role]: props.translate(res.name) });
        });

        this.state = {
            columns: [
                { title: 'id', field: 'id', type: 'numeric', hidden: "true", defaultSort: "desc" },
                {
                    title: props.translate('user'), field: 'username',
                    validate: rowData => rowData.username !== '' && rowData.username !== undefined
                },
                {
                    title: props.translate('login'), field: 'email', editable: "onAdd",
                    validate: rowData => rowData.email !== '' && rowData.email !== undefined
                },
                {
                    title: props.translate('groups'),
                    emptyValue: [],
                    field: 'groups',
                    cellStyle: rowData => ({ width: "200px" }),
                    render: rowData => rowData.groups.map((group, index, groups) => index !== (groups.length - 1) ? group.label + ", " : group.label),
                    editComponent: rowData => <Select
                        isMulti
                        isClearable={false}
                        onChange={selectedOption => {
                            rowData.onRowDataChange({
                                ...rowData.rowData,
                                groups: selectedOption === null ? [] : selectedOption
                            })
                        }}
                        value={rowData.rowData.groups}
                        options={this.props.groupsList}
                        placeholder={''}
                        className={
                            classnames({
                            'groupSelect': true,
                            'ga-e': !["root_admin", "global_admin"].includes(this.props.currentUser.internalrole) && (!rowData.rowData.hasOwnProperty("groups") || rowData.rowData.groups === null || rowData.rowData.groups.length===0)
                        })}
                        classNamePrefix="userGroups"
                        placeholder={this.props.translate('selectGroups')}
                        noOptionsMessage={() => this.props.translate('noOptionsMessage')}
                        components={{ DropdownIndicator }}
                    />,
                    validate: rowData => ["root_admin", "global_admin"].includes(this.props.currentUser.internalrole) ? { isValid: true } : rowData.hasOwnProperty("groups") && rowData.groups !== null && rowData.groups.length > 0 ? { isValid: true } : { isValid: false },

                },
                {
                    title: props.translate('role'),
                    field: 'role',
                    lookup: lookupGroups,
                    editable: this.props.currentUser.internalrole === "group_admin" ? 'onAdd' : "always",
                    validate: rowData => rowData.role !== '' && rowData.role !== undefined
                }
            ],
            data: [],
            groupsForCreate: [],
        }
    }

    componentDidMount() {
        const { translate, currentUser } = this.props;
        let data = [];
        getUsers().then(resonses => {
            resonses.data.map(user => {
                data.push({ id: user.id, username: user.username, email: user.email, role: user.role, groups: user.groups.map(group => { group.label = group.name; group.value = group.id; return group }) })
            })

            this.setState({ data: data });
        })
        let searchInput = document.getElementsByClassName("MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd")[0]
        searchInput.oninput = function () {
            if (searchInput.value[0] === " ") { searchInput.value = searchInput.value.trimStart() }
        }
    }

    isUserValidated = (User) => {
        const { translate } = this.props;
        var textError = "";
        if (!User.hasOwnProperty("username") || !User.hasOwnProperty("email") || !User.hasOwnProperty("role")) {
            textError = translate('fillInAllFields');
        } else {
            if (User.username === "") {
                textError = translate('userFieldIsRequired');
            }

            if (User.email.search(REGULAR_EXPRESSIONS.EMAIL) === -1) {
                textError = translate('enterAnExistingEmail');
            }
            if (User.role === "") {
                textError = translate('roleFieldIsRequired');
            }
        }

        if (textError != "") {
            toast.error(textError);
            return false;
        }
        return true;
    }

    render() {
        const { translate, language } = this.props;
        let { data } = this.state;
        let groupsList = this.props.groupsList;
        return (
            <div className="container left1px MTableTitleBold">
                <MaterialTable

                    title={translate('usersList')}
                    columns={this.state.columns}
                    data={data}
                    icons={{ Add: () => <AddIcon />, Edit: () => <EditIcon style={{ color: "#009a66" }} />, Delete: () => <DeleteIcon style={{ color: "#ff0000" }} /> }}

                    onChangeRowsPerPage={pageSize => {
                        localStorage.usersPageSize = pageSize;
                    }}

                    editable={{
                        isEditable: rowData => rowData.id != this.props.currentUser.userId,
                        isDeletable: rowData => rowData.id != this.props.currentUser.userId,
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                newData.username = newData.username.trim();
                                newData.email = newData.email.trim();
                                let tempData = Object.assign({ "language": language }, newData);
                                let isGroupError=false;
                                if (!["root_admin", "global_admin"].includes(this.props.currentUser.internalrole)) {
                                    if (!newData.hasOwnProperty("groups") || newData.groups === null || newData.groups.length===0) {
                                        toast.error(translate('emptyGroupsError'))
                                        isGroupError=true
                                        reject();
                                    }
                                }
                                else{
                                    isGroupError=false
                                }
                                if(!isGroupError){
                                if (!this.isUserValidated(newData)) {
                                    reject();
                                }
                                else {
                                    let tempGroups = [];
                                    if (newData.hasOwnProperty("groups") && newData.groups !== null && newData.groups.length > 0) {
                                        tempData.groups = newData.groups.filter(group => group.value).map(group => parseInt(group.value));
                                        tempGroups = newData.groups.filter(group => group.value);
                                    }
                                    else {
                                        delete tempData.groups
                                    }
                                    postUser(JSON.stringify(tempData)).then(res => {
                                        if (res.status != "ok") {
                                            var text = translate('errorOccurredWhileAddingTheUser');
                                            if (res.error_message.includes(`unique constraint "u_email"`)) {
                                                text = translate('userWithSuchLoginAlreadyExists');
                                            }
                                            toast.error(text);
                                            reject();
                                        } else {
                                            tempData.id = res.data.id;
                                            tempData.groups = tempGroups;
                                            let materialData = data.slice();
                                            materialData.unshift(tempData);
                                            this.setState({ data: materialData });
                                            toast.success(translate('userSuccessfullyAdded'));
                                        }
                                    }).then(() => resolve()).catch();
                                }}
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                newData.username = newData.username.trim();
                                newData.email = newData.email.trim();
                                let isGroupError=false;
                                if (!["root_admin", "global_admin"].includes(this.props.currentUser.internalrole)) {
                                    if (!newData.hasOwnProperty("groups") || newData.groups === null || newData.groups.length===0) {
                                        toast.error(translate('emptyGroupsError'))
                                        isGroupError=true
                                        reject();
                                    }
                                }
                                else{
                                    isGroupError=false
                                }
                                if(!isGroupError){
                                if (!this.isUserValidated(newData)) {
                                    reject();
                                }
                                else {

                                    newData.isActive = true;
                                    let apiData = Object.assign({}, newData);
                                    if (newData.hasOwnProperty("groups") && newData.groups !== null && newData.groups.length > 0) {
                                        apiData.groups = newData.groups.filter(group => group.value).map(group => parseInt(group.value)).slice()
                                        newData.groups = newData.groups.filter(group => group.value);
                                    }
                                    else {
                                        apiData.groups = []
                                    }
                                    let materialNewData = Object.assign({}, newData);
                                    delete apiData.email;

                                    putUser(JSON.stringify(apiData)).then((res) => {

                                        if (res.status != "ok") {
                                            toast.error(translate('errorOccurredWhileUpdatingTheUser'));
                                            reject();
                                        } else {
                                            let materialData = data.slice();
                                            const index = materialData.map(user => user.id).indexOf(oldData.id);
                                            materialData[index] = materialNewData;
                                            this.setState({ data: materialData });
                                            toast.success(translate('userSuccessfullyUpdated'));
                                        }
                                    }).then(() => resolve()).catch();
                                }}
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                delUser(oldData.id).then((res) => {
                                    if (res.status != "ok") {
                                        toast.error(translate('errorOccurredWhileDeletingTheUser'));
                                    } else {
                                        let materialData = data.slice();
                                        const index = materialData.indexOf(oldData);
                                        materialData.splice(index, 1);
                                        this.setState({ data: materialData });
                                        toast.success(translate('userSuccessfullyDeleted'));
                                    }
                                }).then(() => resolve()).catch();
                            })
                    }}

                    options={{
                        emptyRowsWhenPaging: false,
                        actionsColumnIndex: 4,
                        sorting: true,
                        pageSize: parseFloat(localStorage.getItem('usersPageSize') || 5),
                        addRowPosition: 'first',
                        rowStyle: {
                            fontSize: "0.875rem",
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 400,
                        },
                        headerStyle: { fontWeight: '600' }
                    }}
                    localization={{
                        body: {
                            editRow: {
                                deleteText: `${translate('areYouSure')} ? ${translate('userDeleteMessage')}`,
                                cancelTooltip: `${translate('cancel')}`,
                                saveTooltip: `${translate('confirm')}`
                            },
                            addTooltip: `${translate('add')}`,
                            deleteTooltip: `${translate('delete')}`,
                            editTooltip: `${translate('edit')}`,
                            emptyDataSourceMessage: `${translate('noData')}`
                        },
                        toolbar: {
                            searchPlaceholder: `${translate('search')}`,
                            searchTooltip: `${translate('search')}`
                        },
                        pagination: {
                            labelRowsSelect: `${translate('paginationUsers')}`,
                            labelDisplayedRows: `{from}-{to} ${translate('outOf')} {count}`,
                            firstAriaLabel: `${translate('firstPage')}`,
                            firstTooltip: `${translate('firstPage')}`,
                            previousAriaLabel: `${translate('previousPage')}`,
                            previousTooltip: `${translate('previousPage')}`,
                            nextAriaLabel: `${translate('nextPage')}`,
                            nextTooltip: `${translate('nextPage')}`,
                            lastAriaLabel: `${translate('lastPage')}`,
                            lastTooltip: `${translate('lastPage')}`,
                        },
                        header: {
                            actions: `${translate('actions')}`
                        }
                    }}
                />
                {/* <ToastContainer/> */}
            </div>
        )


    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale,
        currentUser: state.currentUser
    };
};

export default connect(mapStateToProps)(withTranslate(UserSettings));