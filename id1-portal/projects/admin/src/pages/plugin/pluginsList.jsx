import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
//icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ShopIcon from '@material-ui/icons/Shop';
//service
import * as actions from '../../redux/actions/plugins.js';
import { activatePlugin, deletePluginsByName } from "../../services/plugin-api-services.js";

export class PluginsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'name', field: 'name', type: 'string', hidden: "true" },
                { title: 'dateOfInstallation', field: 'dateOfInstallation', type: 'date', hidden: "true", defaultSort: "desc" },
                {
                    title: props.translate('pluginDisplayName'), field: 'displayName',
                    customSort: (a, b) => { return a.displayName.trim().localeCompare(b.displayName.trim()); },
                    editable: "onAdd"
                },
                { title: props.translate('descriptionOfPlugin'), field: 'description', editable: "onAdd" },
                {
                    title: props.translate('statusOfPlugin'),
                    field: 'activate',
                    lookup: { true: props.translate('statusOfPluginActivated'), false: props.translate('statusOfPluginDeactivated') },
                },
                {
                    title: props.translate('license'),
                    field: 'free',
                    lookup: { true: props.translate('free'), false: props.translate('paid') },
                    editable: "onAdd"                   
                },
            ],
            data: this.props.pluginsInfo.map(plugin => { if(plugin.license === "MIT" || !plugin.license) {plugin.free = true} else {plugin.free = false}  return plugin})
        }
    }

    componentDidMount() {
        let searchInput = document.querySelector(".pagePlugins input.MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedStart.MuiInputBase-inputAdornedEnd");

        if (searchInput) {
            searchInput.oninput = function () {
                if (searchInput.value.startsWith(" ")) searchInput.value = searchInput.value.trimStart()
            }
        }
    }

    render() {
        const { data, columns } = this.state;
        const { history, translate, pluginsInfo, language } = this.props;

        var plugins = pluginsInfo.map(plugin => {

            if (plugin.translateDisplayName) {
                if (translate(plugin.translateDisplayName)) {
                    plugin.displayName = translate(plugin.translateDisplayName);                   
                }
            }
            if (plugin.translateDescription) {
                if (translate(plugin.translateDescription)) {
                    plugin.description = translate(plugin.translateDescription);                   
                }
            } 
            return plugin;
        })

        return (
            <div className="row">
                <div className="col-sm-12">
                    <div className="container left1px MTableTitleBold">
                        <MaterialTable
                            title={translate('listPlugins')}
                            columns={columns}
                            data={plugins}
                            icons={{
                                Edit: () => <EditIcon style={{ color: "#009a66" }} />,
                                Delete: () => <DeleteIcon style={{ color: "#ff0000" }} />
                            }}

                            onChangeRowsPerPage={pageSize => {
                                localStorage.pluginsPageSize = pageSize;
                            }}

                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        var url = null;

                                        if (oldData.routeForActivate) {
                                            url = oldData.routeForActivate;
                                        }

                                        activatePlugin(JSON.stringify({ name: newData.name, activate: JSON.parse(newData.activate) }), url).then((responses) => {
                                            var error = false;
                                            responses.forEach(res => {
                                                if (res.status != "ok" && res.status != "200") {
                                                    error = true;
                                                    toast.error(translate('pluginActivateError'));
                                                    reject();
                                                }
                                            });
                                            if (!error) {
                                                this.props.UpdatePlugins(newData);
                                                this.props.updateRoutes();
                                                if (JSON.parse(newData.activate)) {
                                                    toast.success(translate('pluginIsAlreadyActivated'));
                                                } else {
                                                    toast.success(translate('pluginIsAlreadyDeactivated'));
                                                }
                                            }

                                        }).then(() => resolve()).catch();

                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        deletePluginsByName(oldData.name).then(async res => {
                                            if (res.error_message != null) {
                                                toast.error(translate('pluginRemovalError'));
                                                resolve();
                                                return;
                                            }
                                            await setTimeout(() => {
                                                this.props.updateRoutes();
                                                toast.success(translate('pluginSuccessfullyRemoved'));
                                                resolve();
                                            }, 10000);
                                        })
                                    })
                            }}

                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: `${translate('addPlugin')}`,
                                    isFreeAction: true,
                                    onClick: (event) => history.push(`/${language}/pluginAdd`)
                                },
                                {
                                    icon: () => <ShopIcon style={{ color: "#009a66" }} />,
                                    tooltip: `${translate('pluginStore')}`,
                                    isFreeAction: true,
                                    onClick: () => window.open('https://softlist.com.ua/', '_blank')
                                }
                            ]}

                            options={{
                                emptyRowsWhenPaging: false,
                                actionsColumnIndex: 4,
                                sorting: true,
                                pageSize: parseFloat(localStorage.getItem('pluginsPageSize') || 5),
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
                                        deleteText: `${translate('areYouSure')}? ${translate('pluginDeleteMessage')}`,
                                        cancelTooltip: `${translate('cancel')}`,
                                        saveTooltip: `${translate('confirm')}`
                                    },
                                    addTooltip: `${translate('add')}`,
                                    deleteTooltip: `${translate('delete')}`,
                                    editTooltip: `${translate('edit')}`,
                                    emptyDataSourceMessage: `${translate('noData')}`
                                },
                                toolbar: {
                                    searchPlaceholder: `${translate('searchByName')}`,
                                    searchTooltip: `${translate('searchByName')}`
                                },
                                pagination: {
                                    labelRowsSelect: `${translate('paginationPlugins')}`,
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
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale,
        pluginsInfo: state.reducerPlugins,
        updateRoutes: state.Intl.updateRoutes
    };
};

export default withRouter(connect(mapStateToProps, actions)(withTranslate(PluginsList)));