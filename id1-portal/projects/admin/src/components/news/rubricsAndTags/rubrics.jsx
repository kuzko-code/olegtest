import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table';
import "../../../../public/assets/css/newslist.css";
//services
import { getRubrics, putRubrics, postRubrics, delRubrics } from "../../../services/rubric-api-services.js";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

export class Rubrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'id', field: 'id', type: 'numeric', hidden: "true", defaultSort: "desc" },
                {
                    title: props.translate('rubricName'), field: 'title',
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
        const { language } = this.props;

        let searchInput = document.querySelector(".rubric input.MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedStart.MuiInputBase-inputAdornedEnd");

        if (searchInput) {
            searchInput.oninput = function () {
                if (searchInput.value.startsWith(" ")) searchInput.value = searchInput.value.trimStart()
            }
        }

        getRubrics(language).then(res => {
            var temp = res.data.filter(function filterByCount(item) {
                if (item.id === null) {
                    return false;
                }
                return true;
            })
            this.setState({
                data: temp,
                loading: false,
                error: false
            });
        }).catch(this.onError);
    }

    isRubricValidated = (Rubric) => {
        const { translate } = this.props;
        if (!Rubric.hasOwnProperty("title")) {
            toast.error(translate('rubricNameIsRequired'));
            return false;
        }
        if (Rubric.title === "") {
            toast.error(translate('rubricNameIsRequired'));
            return false;
        }
        return true;
    }

    outputErrorMessage = (error_message) => {
        const { translate } = this.props;
        if (error_message === `duplicate key value violates unique constraint "news_rubrics_title_unique"`) {
            toast.error(translate('rubricAlreadyExists'));
        } else {
            toast.error(translate('unexpectedErrorOccurred'));
        }
    }

    render() {
        const { data, loading, error, columns } = this.state;
        const { translate, language } = this.props;
        // const hasData = !(loading || error);
        const errorMessage = error ? <div className="alert alert-light">{translate('unexpectedErrorOccurred')}</div> : null;
        // const spinner = loading ? <CircularProgress /> : null;
        const content = !error ?
            <div className="MTableTitleBold">
                <MaterialTable
                    title={translate('rubricsList')}
                    columns={columns}
                    data={data}
                    icons={{
                        Add: () => <AddIcon />,
                        Edit: () => <EditIcon style={{ color: "#009a66" }} />,
                        Delete: () => <DeleteIcon style={{ color: "#ff0000" }} />
                    }}

                    onChangeRowsPerPage={pageSize => {
                        localStorage.rubricsPageSize = pageSize;
                    }}

                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                newData.title = newData.title.trim();
                                if (!this.isRubricValidated(newData)) {
                                    reject();
                                    return;
                                }

                                postRubrics({ title: newData.title, language: language }).then((res) => {
                                    if (res.status != "ok") {
                                        this.outputErrorMessage(res.error_message);
                                        resolve();
                                        return;
                                    }
                                    var tempData = this.state.data.slice();
                                    newData.id = res.data.id;
                                    tempData.unshift(newData);
                                    this.setState({ data: tempData });
                                    toast.success(translate('rubricSuccessfullyAdded'));

                                }).then(() => resolve()).catch();
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                newData.title = newData.title.trim();
                                if (!this.isRubricValidated(newData)) {
                                    reject();
                                    return;
                                }
                                var raw = { id: newData.id, title: newData.title, language: language };
                                putRubrics(raw).then((res) => {
                                    if (res.status != "ok") {
                                        this.outputErrorMessage(res.error_message);
                                        resolve();
                                        return;
                                    }
                                    var dataTemp = this.state.data.slice();
                                    const index = dataTemp.indexOf(oldData);
                                    dataTemp[index] = newData;
                                    this.setState({ data: dataTemp });
                                    toast.success(translate('rubricSuccessfullyUpdated'));
                                }).then(() => resolve()).catch();
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                delRubrics(oldData.id).then((res) => {
                                    if (res.status != "ok") {
                                        toast.error(translate('errorOccurredWhileDeletingTheRubric'));
                                        resolve();
                                        return;
                                    }
                                    var tempData = this.state.data.slice();
                                    const index = tempData.indexOf(oldData);
                                    tempData.splice(index, 1);
                                    this.setState({ data: tempData });
                                    toast.success(translate('rubricSuccessfullyDeleted'));
                                }).then(() => resolve()).catch();
                            })
                    }}

                    options={{
                        actionsColumnIndex: 2,
                        sorting: true,
                        pageSize: parseFloat(localStorage.getItem('rubricsPageSize') || 5),
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
                                deleteText: `${translate('areYouSure')} ? ${translate('rubricDeleteMessage')}`,
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
                            labelRowsSelect: `${translate('paginationRubric')}`,
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

export default connect(mapStateToProps)(withTranslate(Rubrics));