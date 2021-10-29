import React from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import { dateTimeFormattingByString, dateFormattingByString } from '../../helpers/date-helpers.js';


export const getColumns = (translate) => [
    { title: 'id', field: 'id', type: 'numeric', hidden: true },
    {
        title: translate('update'),
        field: 'version',
        customSort: (a, b) => {
            return a.title.trim().localeCompare(b.title.trim());
        },
        render: (rowData) => getUpdateTitle(rowData, translate),
        cellStyle: (rowData) => ({
            maxWidth: '500px',
            width: '100%',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        }),
    },
    {
        title: translate('statusOfPlugin'),
        field: 'status',
        sorting: false,
        lookup: {
            updated: translate("Updated"),
            currentVersion: translate("CurrentVersion"),
            notInstalled: translate("NotInstalled"),
        },
        cellStyle: () => ({ minWidth: '170px' }),

    },
    {
        title: translate("ReleaseDate"),
        field: 'created_date',
        defaultSort: 'desc',
        render: (rowData) => dateTimeFormattingByString(rowData.created_date),
        cellStyle: () => ({ minWidth: '170px' }),
    },
    {
        title: translate("DateOfInstallation"),
        field: 'update_date',
        sorting: false,
        render: (rowData) => dateTimeFormattingByString(rowData.update_date),
        cellStyle: () => ({ minWidth: '170px' }),
    },
];
const newColor = '#009a66';
const activeColor = '#808080';
const oldColor = '#d3d3d3';

export const getUpdateTitle = (rowData, translate) => {
    return `${translate("updateTitle", {
        version: rowData.version, created_date: dateFormattingByString(rowData.created_date)
    })}`;
}

export const getUpdateModalContent = (rowData, translate) => {
    return {
        title: getUpdateTitle(rowData, translate),
        body: rowData.description
    };
}

export const getActions = (translate, setModalContent, setIsShowModal, installUpdate) => [
    {
        icon: () => <DescriptionOutlinedIcon />,
        tooltip: translate("DetailedInformationAboutUpdate"),
        onClick: (event, rowData) => {
            setModalContent(getUpdateModalContent(rowData, translate));
            setIsShowModal(true);
        }
    },
    rowData => ({
        icon: () => <SystemUpdateAltIcon style={{
            color: rowData.status == "notInstalled" ?
                newColor :
                (rowData.status == "currentVersion" ?
                    activeColor :
                    oldColor)
        }} />,
        tooltip: `${rowData.status == "notInstalled" ?
            translate("Update") :
            (rowData.status == "currentVersion" ?
                translate("CurrentUpdate") :
                translate("UpdateNotAvailable"))}`,
        onClick: (event, rowData) => installUpdate(rowData),
        disabled: rowData.status !== "notInstalled"
    })
]

export const options = {
    rowStyle: () => {
        ({
            fontSize: '0.875rem',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
        });
    },
    actionsColumnIndex: -1,
    addRowPosition: 'first',
    emptyRowsWhenPaging: false,
    sorting: true,
    pageSize: parseFloat(localStorage.getItem('updatePageSize') || 5),
    headerStyle: { whiteSpace: 'nowrap', fontWeight: '600' },
};

export const getLocale = (translate) => ({
    body: {
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
        labelRowsSelect: `${translate('updates')}`,
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
});
