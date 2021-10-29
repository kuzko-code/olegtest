import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table';
import ApiService from '../../helpers/api-helpers.js';
import { dateTimeFormattingByString } from "../../helpers/date-helpers.js";
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';

const api = new ApiService('/visitors', localStorage.getItem('token'));

const VisitorsList = () => {
    const materialTableRef = useRef();
    const translate = useTranslate();
    const statuses = {
        "true": translate("сonfirmed"),
        "false": translate("notConfirmed")
    }

    const getData = (query) => {
        return new Promise((resolve, reject) => {
            Promise.all([
                api.getAllItems({
                    fields: 'id,first_name,last_name,email,is_active,created_date',
                    sortField: query.orderBy ? query.orderBy.field : 'id',
                    sortDirection: query.orderDirection ? query.orderDirection : 'desc',
                    start: query.pageSize * query.page,
                    count: query.pageSize,
                    search: query.search,
                    searchKeys: "first_name,last_name,email",
                }),
                api.getAllItems({
                    aggFunc: 'count',
                    searchKeys: "first_name,last_name,email",
                    search: query.search
                }),
            ])
                .then(([data, { count }]) => {
                    data.forEach(element => {
                        element.full_name = element.first_name + " " + element.last_name
                    });
                    resolve({
                        data: data,
                        page: query.page,
                        totalCount: Number(count),
                    });
                })
                .catch((error) => {
                    console.log('Error :>> ', error);
                    reject(error);
                });
        });
    };

    return (
        <div className="row">
            <div className="col-9 MTableTitleBold">
                <MaterialTable
                    tableRef={materialTableRef}
                    title={translate("users")}
                    columns={[
                        { title: translate("fullName"), field: 'full_name' },
                        { title: translate("email"), field: "email" },
                        { title: translate("status"), field: "is_active", lookup: statuses },
                        { title: translate("createdDate"), field: "created_date", render: (rowData) => dateTimeFormattingByString(rowData.created_date) }]}

                    data={getData}

                    icons={{
                        Delete: () => <DeleteIcon style={{ color: "#ff0000" }} />
                    }}

                    onChangeRowsPerPage={(pageSize) => {
                        localStorage.visitorsPageSize = pageSize;
                    }}

                    editable={{
                        onRowDelete: (oldData) => {
                            let { data, query } = materialTableRef.current.state
                            if (data.length === 1 && query.page !== 0) {
                                query.page = query.page - 1
                                materialTableRef.current.state.query = query
                            }
                            return new Promise((resolve, reject) => {
                                api.deleteItem(oldData.id).then(() => {
                                    toast.success(translate("visitorDeleteMessage"));
                                    materialTableRef.current.onQueryChange();
                                    resolve();
                                }).catch((error) => {
                                    toast.error(translate("visitorDeleteError"));
                                    reject(error);
                                });
                            })
                        }

                    }}

                    options={{
                        actionsColumnIndex: -1,
                        sorting: true,
                        addRowPosition: 'first',
                        rowStyle: {
                            fontSize: "0.865rem",
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 500,
                        },
                        headerStyle: { fontWeight: '600' },
                        emptyRowsWhenPaging: false
                    }}
                    localization={{
                        body: {
                            emptyDataSourceMessage: `${translate('noData')}`,
                            editRow: {
                                deleteText: `${translate('areYouSure')} ? ${translate(
                                    'userDeleteMessage')}`,
                                cancelTooltip: `${translate('cancel')}`,
                            },
                            deleteTooltip: `${translate('delete')}`,
                        },
                        toolbar: {
                            searchPlaceholder: `${translate('searchByFullName')}`,
                            searchTooltip: `${translate('search')}`,
                        },
                        pagination: {
                            labelRowsSelect: `${translate("visitorsPagination")}`,
                            labelDisplayedRows: `{from}-{to} ${translate(
                                'outOf'
                            )} {count}`,
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
                            actions: `${translate('actions')}`,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default VisitorsList;
