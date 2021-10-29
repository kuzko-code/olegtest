import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table'
import "../../../../public/assets/css/newslist.css"
//services
import { createGroup, updateGroups, deleteGroup } from "../../../services/group-api-services.js"
import { toast } from 'react-toastify';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal'
import ModalGroupInfo from "./modalGroupInfo.jsx"

export class GroupSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'id', field: 'id', type: 'numeric', hidden: "true", defaultSort: "desc" },
                {
                    title: props.translate('groupName'), field: 'name',
                    validate: rowData => rowData.name !== '' && rowData.name !== undefined && rowData.name.length >= 3 && rowData.name.length <= 100
                }
            ],
            showModal: false,
            modalGroupId: 0,
            modalGroupName: ''

        }
    }

    render() {
        const { translate, language, history } = this.props;
        let data = this.props.groupsList;

        var action = {
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    newData.name = newData.name.trim();
                    newData.permission = oldData.permission;
                    updateGroups(JSON.stringify(newData)).then((res) => {
                        if (res.status != "ok") {
                            toast.error(translate('errorOccurredWhileUpdatingTheGroup'));
                            reject();
                        } else {

                            var materialData = data.slice();
                            newData.value = newData.id;
                            newData.label = newData.name;
                            const index = materialData.indexOf(oldData);
                            materialData[index] = newData;
                            this.props.handleChangeGroupsList(materialData);
                            toast.success(translate('groupSuccessfullyUpdated'));
                        }
                    }).then(() => resolve()).catch();
                })
        }

        if (this.props.currentUser.internalrole === "root_admin" || this.props.currentUser.internalrole === "global_admin")
            action = Object.assign(action,
                {
                    onRowDelete: oldData =>

                        new Promise((resolve, reject) => {
                            deleteGroup(oldData.id).then((res) => {
                                if (res.status != "ok") {
                                    toast.error(translate('errorOccurredWhileDeletingTheGroup'));
                                    reject();
                                } else {
                                    let materialData = data.slice();
                                    const index = materialData.map(group => group.id).indexOf(oldData.id);
                                    materialData.splice(index, 1);
                                    this.props.handleChangeGroupsList(materialData);
                                    toast.success(translate('groupSuccessfullyDeleted'));
                                }
                            }).then(() => resolve()).catch();
                        })
                },
                {
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            newData.name = newData.name.trim();
                            newData.name = newData.name.substring(0, 100);
                            createGroup(JSON.stringify(newData)).then(res => {
                                if (res.status != "ok") {
                                    var text = translate('errorOccurredWhileAddingTheGroup');
                                    toast.error(text);
                                    reject();
                                } else {
                                    newData.id = res.data.id;
                                    let materialData = data.slice();
                                    newData.value = newData.id;
                                    newData.label = newData.name;
                                    materialData.unshift(newData);
                                    this.props.handleChangeGroupsList(materialData);
                                    toast.success(translate('groupSuccessfullyAdded'));
                                }
                            }).then(() => resolve()).catch();

                        })
                }
            );


        return (
            <div className="container left1px MTableTitleBold">
                <Modal
                    show={this.state.showModal}
                    onHide={() => this.setState({ showModal: false })}
                    dialogClassName="modal-90w"
                    centered={true}
                    size='lg'
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h3>{this.state.modalGroupName}</h3>

                    </Modal.Header>
                    <Modal.Body bsPrefix="overflow-auto">
                        <ModalGroupInfo id={this.state.modalGroupId} />
                    </Modal.Body>
                </Modal>
                <MaterialTable

                    title={translate('groupsList')}
                    columns={this.state.columns}
                    data={data}
                    icons={{ Add: () => <AddIcon />, Edit: () => <EditIcon style={{ color: "#009a66" }} />, Delete: () => <DeleteIcon style={{ color: "#ff0000" }} /> }}

                    onChangeRowsPerPage={pageSize => {
                        localStorage.groupsPageSize = pageSize;
                    }}

                    actions={[
                        {
                            icon: () => <i className="fa fa-users" aria-hidden="true" style={{ color: "#199ed8", fontSize: "18px" }}></i>,
                            tooltip: ["root_admin", "global_admin"].includes(this.props.userRole) ? translate('groupManagement') : translate('viewRights'),
                            onClick: (event, rowData) => {
                                ["root_admin", "global_admin"].includes(this.props.userRole) ?
                                    history.push(`/${language}/usersAndGroups_settings/groupManagement/${rowData.id}`, rowData.name)
                                    :
                                    this.setState({ showModal: true, modalGroupId: rowData.id, modalGroupName: rowData.name })
                            }
                        }
                    ]}

                    editable={action}

                    options={{
                        emptyRowsWhenPaging: false,
                        actionsColumnIndex: 4,
                        sorting: true,
                        pageSize: parseFloat(localStorage.getItem('groupsPageSize') || 5),
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
                                deleteText: `${translate('areYouSure')} ? ${translate('groupDeleteMessage')}`,
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
                            labelRowsSelect: `${translate('paginationGroups')}`,
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
        currentUser: state.currentUser,
        language: state.Intl.locale
    };
};

export default withRouter(connect(mapStateToProps)(withTranslate(GroupSettings)));