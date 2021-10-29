import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table';
import "../../../../public/assets/css/newslist.css";
import { getTags, putTags, postTags, delTags } from "../../../services/tag-api-services.js";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

export class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'id', field: 'id', type: 'numeric', hidden: "true", defaultSort: "desc" },
                {
                    title: props.translate('tagName'), field: 'title',
                    customSort: (a, b) => { return a.title.trim().localeCompare(b.title.trim()); },
                    validate: rowData => rowData.title !== '' && rowData.title !== undefined
                },
            ],
            data: [],
            loading: true,
            error: false
        }
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        });
    };

    componentDidMount() {

        let searchInput = document.querySelector(".tag input.MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedStart.MuiInputBase-inputAdornedEnd");

        if (searchInput) {
            searchInput.oninput = function () {
                if (searchInput.value.startsWith(" ")) searchInput.value = searchInput.value.trimStart()
            }
        }
        getTags(this.props.language).then(res => {
            this.setState({
                data: res.data,
                loading: false,
                error: false
            });
        }).catch(this.onError);
    }

    isTagValidated = (Tag) => {
        const { translate } = this.props;
        if (!Tag.hasOwnProperty("title")) {
            toast.error(translate('tagNameIsRequired'));
            return false;
        }
        if (Tag.title === "") {
            toast.error(translate('tagNameIsRequired'));
            return false;
        }
        return true;
    }

    outputErrorMessage = (error_message) => {
        const { translate } = this.props;
        if (error_message === `duplicate key value violates unique constraint "news_tags_title_unique"`) {
            toast.error(translate('tagAlreadyExists'));
        } else {
            toast.error(translate('unexpectedErrorOccurred'));
        }
    }

    render() {
        const { data, loading, error } = this.state;
        const { translate, language } = this.props;

        const errorMessage = error ? <div className="alert alert-light">{translate('unexpectedErrorOccurred')}</div> : null;

        const content = !error ?
            <div className="MTableTitleBold">
                <MaterialTable

                    title={translate('tagsList')}
                    columns={this.state.columns}
                    data={data}

                    icons={{
                        Add: () => <AddIcon />,
                        Edit: () => <EditIcon style={{ color: "#009a66" }} />,
                        Delete: () => <DeleteIcon style={{ color: "#ff0000" }} />
                    }}

                    onChangeRowsPerPage={pageSize => {
                        localStorage.tagsPageSize = pageSize;
                    }}

                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                newData.title = newData.title.trim();
                                if (!this.isTagValidated(newData)) {
                                    reject();
                                    return;
                                }
                                postTags({ title: newData.title, language: language }, 'POST').then((res) => {
                                    if (res.status != "ok") {
                                        this.outputErrorMessage(res.error_message);
                                        resolve();
                                        return;
                                    }
                                    var tempData = this.state.data.slice();
                                    newData.id = res.data.id;
                                    tempData.unshift(newData);
                                    this.setState({ data: tempData });
                                    toast.success(translate('tagSuccessfullyAdded'));

                                }).then(() => resolve()).catch();
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                newData.title = newData.title.trim();
                                if (!this.isTagValidated(newData)) {
                                    reject();
                                    return;
                                }
                                var rawData = { id: newData.id, title: newData.title, language: language };
                                putTags(rawData).then((res) => {
                                    if (res.status != "ok") {
                                        this.outputErrorMessage(res.error_message);
                                        resolve();
                                        return;
                                    }
                                    var dataTemp = this.state.data.slice();
                                    const index = dataTemp.indexOf(oldData);
                                    dataTemp[index] = newData;
                                    this.setState({ data: dataTemp });
                                    toast.success(translate('tagSuccessfullyUpdated'));
                                }).then(() => resolve()).catch();
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                delTags(oldData.id).then((res) => {
                                    if (res.status != "ok") {
                                        toast.error(translate('errorOccurredWhileDeletingTheTag'));
                                        resolve();
                                        return;
                                    }
                                    var tempData = this.state.data.slice();
                                    const index = tempData.indexOf(oldData);
                                    tempData.splice(index, 1);
                                    this.setState({ data: tempData });
                                    toast.success(translate('tagSuccessfullyDeleted'));

                                }).then(() => resolve()).catch();
                            })
                    }}

                    options={{
                        actionsColumnIndex: 2,
                        pageSize: parseFloat(localStorage.getItem('tagsPageSize') || 5),
                        addRowPosition: 'first',
                        emptyRowsWhenPaging: false,
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
                                deleteText: `${translate('areYouSure')} ? ${translate('tagDeleteMessage')}`,
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
                            labelRowsSelect: `${translate('paginationTag')}`,
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
            : null;

        return (
            <React.Fragment>
                {content}
                {/* {spinner} */}
                {errorMessage}

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(Tags));