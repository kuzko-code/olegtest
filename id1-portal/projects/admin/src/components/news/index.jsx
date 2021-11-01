import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import MaterialTable from 'material-table';
import "../../../public/assets/css/newslist.css";
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
//services
import { getNews, delNews } from "../../services/news-api-services.js";
import SectionHeader from '../header/SectionHeader.jsx';
import * as materialTableSettings from '../../services/materialTableSettings.js'

toast.configure();

export class NewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            redirectAdd: false,
            redirectEdit: false,
            newsId: 0
        }
    }
    materialTableRef = React.createRef();

    componentDidMount() {
        let searchInput = document.getElementsByClassName("MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd")[0]
        searchInput.oninput = function () {
            if (searchInput.value[0] === " ") {
                searchInput.value = searchInput.value.trimStart()
            }
        }
    }

    getData = (query) => {
        const { language, translate } = this.props;

        return new Promise((resolve, reject) => {
            let getDataUrl = `?include=rubric&fields=id,title,status,published_date,updated_date&language=${language}`;
            var sortField = query.orderBy ? query.orderBy.field : "date";

            if (sortField != "rubric.title") {
                getDataUrl += `&sortField=` + sortField;
            }
            else {
                getDataUrl += `&sortField=rubric_id`;
            }
            var sortDirection = query.orderDirection ? query.orderDirection : 'desc';
            getDataUrl += `&sortDirection=` + sortDirection;

            getDataUrl += `&start=` + (query.pageSize * query.page);
            getDataUrl += `&count=` + (query.pageSize);
            getDataUrl += `&search=` + query.search;

            const getCountUrl = `?aggFunc=count&search=${query.search}&language=${language}`;

            Promise.all([getNews(getDataUrl), getNews(getCountUrl)]).then((resonses) => resolve(
                {
                    data: resonses[0].data.map(news => {
                        if (news.rubric == null) news.rubric = { title: translate('withoutRubrics') };
                        return news;
                    }),
                    page: query.page,
                    totalCount: +resonses[1].data.count
                }
            ));
        })
    }

    handleRowDelete = (oldData) =>{
        let{data,query}=this.materialTableRef.current.state
    if (data.length === 1 && query.page !== 0) {
      query.page = query.page - 1
      this.materialTableRef.current.state.query = query
    }

        return new Promise((resolve, reject) => {
            delNews({ id: oldData.id }).then((resDelNews) => {
                if (resDelNews.error_message != null) {
                    toast.error(this.props.translate('errorOccurredWhileDeletingTheNews'));
                    resolve();
                    return;
                }
                toast.success(this.props.translate('newsSuccessfullyDeleted'));
               this.materialTableRef.current.onQueryChange();
                resolve();
            });
        });
    }
        

    render() {
        const { translate, language } = this.props;
        const { redirectAdd, redirectEdit, newsId } = this.state;
        const columns = materialTableSettings.getColumns(translate)

        if (redirectAdd) {
            this.setState({ redirectAdd: false });
            return <Redirect push to={`/${language}/newsform/0`} />;
        }

        if (redirectEdit) {
            this.setState({ redirectEdit: false });
            return <Redirect push to={`/${language}/newsform/${newsId}`} />;
        }

        return (
            <div>
                <SectionHeader title={translate('allNews')} />
                <div className="NewsList wrapper wrapperContent animated fadeInRight">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="container left1px MTableTitleBold">
                                <MaterialTable
                                    title={translate('newsList')}
                                    tableRef={this.materialTableRef}
                                    columns={columns}
                                    data={this.getData}
                                    icons={materialTableSettings.icons}
                                    onChangeRowsPerPage={pageSize => {
                                        localStorage.newsPageSize = pageSize;
                                    }}

                                    editable={{
                                        onRowDelete: this.handleRowDelete,
                                    }}

                                    actions={[
                                        {
                                            icon: 'add',
                                            tooltip: `${translate('addNews')}`,
                                            isFreeAction: true,
                                            onClick: (event) => this.setState({ redirectAdd: true })
                                        },
                                        {
                                            icon: () => <EditIcon style={{ color: "#009a66" }} />,
                                            tooltip: `${translate('editNews')}`,
                                            onClick: (event, rowData) => this.setState({ redirectEdit: true, newsId: rowData.id })
                                        }
                                    ]}
                                    options={materialTableSettings.options}
                                    localization={materialTableSettings.getLocale(translate)}
                                />
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
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(NewsList));