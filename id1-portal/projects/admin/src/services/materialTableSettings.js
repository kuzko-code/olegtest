import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { dateTimeFormattingByString } from '../helpers/date-helpers.js';

export const getLocale = (translate) => ({
  body: {
    editRow: {
      deleteText: `${translate('areYouSure')} ? ${translate(
        'newsDeleteMessage'
      )}`,
      cancelTooltip: `${translate('cancel')}`,
      saveTooltip: `${translate('confirm')}`,
    },
    addTooltip: `${translate('add')}`,
    deleteTooltip: `${translate('delete')}`,
    editTooltip: `${translate('edit')}`,
    emptyDataSourceMessage: `${translate('noData')}`,
  },
  toolbar: {
    searchPlaceholder: `${translate('searchByName')}`,
    searchTooltip: `${translate('searchByName')}`,
  },
  pagination: {
    labelRowsSelect: `${translate('paginationNews')}`,
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
    actions: `${translate('actions')}`,
  },
});

export const options = {
  actionsColumnIndex: 5,
  emptyRowsWhenPaging: false,
  headerStyle: { whiteSpace: 'nowrap', fontWeight: '600' },
  pageSize: parseFloat(localStorage.getItem('newsPageSize') || 5),
  rowStyle: {
    fontSize: '0.875rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
  },
};

export const optionsData = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
};

export const optionsTime = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

export const getColumns = (translate) => [
  { title: 'id', field: 'id', type: 'numeric', hidden: true },
  {
    title: translate('newsName'),
    field: 'title',
    customSort: (a, b) => {
      return a.title.trim().localeCompare(b.title.trim());
    },
    cellStyle: (rowData) => ({
      maxWidth: '500px',
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }),
  },
  {
    title: translate('newsRubric'),
    field: 'rubric.title',
    cellStyle: (rowData) => ({
      maxWidth: '120px',
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }),
  },
  {
    title: translate('newsStatus'),
    field: 'status',
    lookup: {
      published: translate('published'),
      draft: translate('draft'),
      planned: translate('planned'),
    },
  },
  {
    title: translate('publishedDate'),
    field: 'published_date',
    render: (rowData) => dateTimeFormattingByString(rowData.published_date),
    cellStyle: () => ({ minWidth: '170px' }),
  },
  {
    title: translate('updatedDate'),
    field: 'updated_date',
    defaultSort: 'desc',
    render: (rowData) => dateTimeFormattingByString(rowData.updated_date),
    cellStyle: () => ({ minWidth: '170px' }),
  },
];

export const icons = {
  Add: () => <AddIcon />,
  Edit: () => <EditIcon />,
  Delete: () => <DeleteIcon style={{ color: '#ff0000' }} />,
};