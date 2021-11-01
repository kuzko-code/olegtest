import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import { getMainNews, putViewNews } from "../../services/index.js"

import { connect } from 'react-redux';
import * as actions from '../../redux/settings/actions.js';
import RubricButton from "../../components/RubricButton/RubricButton.jsx";
import Helmet from 'react-helmet';
import { BreadcrumbsUI } from "../../components/ReExportComponents.js"
import { NotFound } from "../../pages/ReExportPages.js"

import Spinner from "../../components/Spinner/Spinner.jsx"
import AttachmentItem from "../../components/AttachmentItem/AttachmentItem.jsx"
import TagsList from "./TagsList/TagsList.jsx"
import ImagesGallery from '../../components/ImagesGallery/ImagesGallery.jsx';
import PageShare from '../../components/PageShare/PageShare.jsx';
import FacebookComments from "../../components/facebook/facebook-comments.jsx"
import { StickySidebar } from "../../components/layouts/StickySidebar/StickySidebar.jsx";
import "./News.css"

export class NewsPage extends Component {
    state = {
        data: {},
        loading: true,
        error: false,
    };


    componentDidMount() {
        this.loadingData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params != prevProps.match.params) {
            this.loadingData();
        }
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        });
    };

    async loadingData() {
        const id = +this.props.match.params.id;
        const { language } = this.props;

        if (isNaN(id)) {
            this.onError();
            return;
        }

        try {
            const responseMain = await getMainNews(id);
            setTimeout(putViewNews, 1000, id);
            if (responseMain.status != 'ok') {
                this.onError();
                return;
            }

            const data = responseMain.data;
            if (data.language != language) {
                this.onError();
                return;
            }

            this.setState({
                data,
                loading: false,
                error: false,
            });
        } catch (error) {
            console.log('Error :>> ', error);
            this.onError();
        }
    }

    render() {

        const { layout, translate, contacts, locateForURL } = this.props;
        var { data, loading, error } = this.state;
        const { nextNews, previousNews } = this.state.data;
        let imagesForGallery = (data.images || []).map(res => ({
            original: res,
            thumbnail: res,
            originalClass: 'custom-gallery-image-class',
            thumbnailClass: 'custom-gallery-thumbnail-class',
            originalAlt: data.title,
            originalTitle: data.title,
            thumbnailAlt: data.title
        }))

        var optionsTime = { hour: 'numeric', minute: 'numeric', hour12: false };
        var optionsDate = { day: 'numeric', month: 'numeric', year: 'numeric' };

        const hasData = !(loading || error);
        const errorMessage = error ? <NotFound /> : null;
        const spinner = loading && <Spinner />;

        let keywords = hasData ?
            keywords = data.description ?
                data.description.split(' ').join(',') :
                data.title.split(' ').join(',') : "";

        hasData ?
            keywords = keywords.concat(',', data.rubric ? data.rubric : "", data.tags)
            : "";

        const content = hasData ?
            <React.Fragment>
                <Helmet script={[{
                    "type": "application/ld+json",
                    "innerHTML": `{
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": "https://google.com/article"
                            },
                            "headline": "${(data.title || "").replace(/"/g, '\\"')}",
                            "datePublished": "${data.published_date}",
                            "image": ${JSON.stringify([data.main_picture, ...data.images])},
                            "publisher": {
                                "@type": "Organization",
                                "name": "${(layout.siteName || "").replace(/"/g, '\\"')}",
                                "logo": {
                                  "@type": "ImageObject",
                                  "url": "${data.main_picture}"
                                }
                              },
                            "author": {
                                "@type": "Organization",
                                "name": "${(layout.siteName || "").replace(/"/g, '\\"')}",
                                "email": "${contacts.email}",
                                "address": "${(contacts.address || "").replace(/"/g, '\\"')}",
                                "telephone": "${contacts.phone}"
                              }
                            }`
                }]}>
                    <meta charSet="utf-8" content={data.rubric} />
                    <meta charSet="utf-8" content={data.tags} />
                    <title>{data.title}</title>
                    <meta name="description" content={data.description} />
                    <meta name="keywords" content={keywords}></meta>
                    <link rel="canonical" href={process.env.PUBLIC_HOST + window.location.pathname} />
                    <meta property="og:title" content={data.title} />
                    <meta property="og:description" content={data.description} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={process.env.PUBLIC_HOST + window.location.pathname} />
                    <meta property="og:image" content={process.env.PUBLIC_HOST + data.main_picture} />
                </Helmet>
                <div className="news-content">
                    <RubricButton rubric={data.rubric} className="text-center" />
                    <h1 className="news-title">
                        {data.title}
                    </h1>
                    <div className="news-date">
                        {((new Date(data.published_date)).toLocaleString("uk-UA", optionsDate)).toString() + " " +
                            ((new Date(data.published_date)).toLocaleString("uk-UA", optionsTime)).toString()}
                    </div>

                    <div
                        className="entry-content"
                        dangerouslySetInnerHTML={{ __html: data.content }} />

                    {imagesForGallery.length > 0 &&
                        <ImagesGallery className="my-1" items={imagesForGallery} />}

                    {data.attachments &&
                        <div className="my-3">
                            {data.attachments.reverse().map(a =>
                                <AttachmentItem key={a.id} href={a.source_url} name={a.storage_key} />
                            )}
                        </div>}
                    {data.tags.length > 0 &&
                        <div className="news-tags">
                            <div className="news-tags-title">{translate('tags')}</div>
                            <TagsList tags={data.tags} />
                        </div>}
                    <div className="d-flex justify-content-between align-items-end my-2">
                        <PageShare/>
                        <button className="print-button" onClick={window.print}>
                            <PrintTwoToneIcon fontSize="large" />{translate('printableversion')}
                        </button>
                    </div>

                    <nav className="news-navigation">
                        <div className={previousNews.id !== null ? "news-previous" : "news-previous invisible"}>
                            <Link to={`${locateForURL}/news/${previousNews.id}`}>
                                <span className="text-nowrap">
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                    <span className="p-2">
                                        {translate('previousNews')}
                                    </span>
                                </span>
                                <h3>
                                    {previousNews.title}
                                </h3>
                            </Link>
                        </div>

                        <div className={nextNews.id !== null ? "news-next" : "news-next invisible"}>
                            <Link to={`${locateForURL}/news/${nextNews.id}`}>
                                <span className="text-nowrap">
                                    <span className="p-2">
                                        {translate('nextNews')}
                                    </span>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </span>
                                <h3>
                                    {nextNews.title}
                                </h3>
                            </Link>
                        </div>
                    </nav>
                    {data.facebook_enable &&
                        <FacebookComments />}
                </div>

            </React.Fragment>
            : null;

        return (
            <div className="news-page">
                <BreadcrumbsUI
                    curentPageTitle={data.title}
                    breadcrumbsArray={[{ href: `${locateForURL}/newslist`, title: translate('allNews') }]} />

                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        {content}
                        {spinner}
                        {errorMessage}
                    </div>
                    <div className="col-lg-4 col-md-12 sticky-block-wrapper">
                        <StickySidebar boundaryElement=".sticky-block-wrapper" />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        layout: state.reducerSettings.Layout,
        contacts: state.reducerSettings.Contacts,
        language: state.Intl.locale,
        locateForURL: `/${state.Intl.locale}`,
    };
};

export default connect(mapStateToProps, actions)(withTranslate(NewsPage));