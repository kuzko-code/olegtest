import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "../../../public/assets/css/layout/newspage.css"
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import "../../../public/assets/css/layout/newsform.css";
import ImagesGallery from './imagesGallery.jsx';
import PrintTwoToneIcon from '@material-ui/icons/PrintTwoTone';
import { getMainNews, putViewNews } from "../../services/index.js"
import {
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';
import RightPanel from "../layouts/rightPanel/index.jsx";
import { connect } from 'react-redux';
import * as actions from '../../redux/settings/actions.js';
import NotFound from "../pages/404.jsx";
import RubricButton from "./rubricButton.jsx";
import Helmet from 'react-helmet';
import BreadcrumbsUI from "../pages/BreadcrumbsUI.jsx"
import FacebookComments from "../facebook/facebook-comments.jsx"
import AttachmentItem from "../attachment-item.jsx"
import Sticky from 'react-sticky-el';
export class NewsPage extends Component {
    state = {
        popularNews: [],
        data: {},
        social: null,
        color: null,
        loading: true,
        error: false,
        allBannersInfo: []
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
        let bannerString = '';

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
        let imagesForGallery = [];
        data.images !== undefined ? data.images.map(res => imagesForGallery.push({
            original: res,
            thumbnail: res,
            originalClass: 'custom-gallery-image-class',
            thumbnailClass: 'custom-gallery-thumbnail-class',
            originalAlt: data.title,
            originalTitle: data.title,
            thumbnailAlt: data.title
        })) : null

        var optionsTime = { hour: 'numeric', minute: 'numeric', hour12: false };
        var optionsDate = { day: 'numeric', month: 'numeric', year: 'numeric' };
        var colorThemeWidget = classnames({
            'widget': true,
            'color-default': true,
            'color-theme': true
        });

        var colorThemeNavigation = classnames({
            'post-navigation clearfix': true,
            'color-theme': true
        });
        const hasData = !(loading || error);
        const errorMessage = error ? <NotFound /> : null;
        const spinner = loading ? <div className="d-flex justify-content-center">
            <div className={`spinner-border text-color`}>
            </div>
        </div> : null;

        var keywords = hasData ? keywords = data.description ? data.description.split(' ').join(',') : data.title.split(' ').join(',') : "";
        hasData ? keywords = keywords.concat(',', data.rubric ? data.rubric : "", data.tags) : "";
        const content = hasData ?

            <React.Fragment>
                <div className="single-post">
                    <Helmet script={[{
                        "type": "application/ld+json",
                        "innerHTML": `{
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": "https://google.com/article"
                            },
                            "headline": "${(data.title || "").replaceAll('"', '\\"')}",
                            "datePublished": "${data.published_date}",
                            "image": ${JSON.stringify([data.main_picture, ...data.images])},
                            "publisher": {
                                "@type": "Organization",
                                "name": "${(layout.siteName || "").replaceAll('"', '\\"')}",
                                "logo": {
                                  "@type": "ImageObject",
                                  "url": "${data.main_picture}"
                                }
                              },
                            "author": {
                                "@type": "Organization",
                                "name": "${(layout.siteName || "").replaceAll('"', '\\"')}",
                                "email": "${contacts.email}",
                                "address": "${(contacts.address || "").replaceAll('"', '\\"')}",
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

                    <div className="post-title-area text-center">
                        <span className={colorThemeWidget}>
                            <RubricButton rubric={data.rubric}></RubricButton>
                        </span>
                        <h1 className="post-title" style={{ fontSize: "30px" }}>
                            {data.title} </h1>
                        <div className="post-meta">
                            <span className="post-date">
                                {((new Date(data.published_date)).toLocaleString("uk-UA", optionsDate)).toString() + " " + ((new Date(data.published_date)).toLocaleString("uk-UA", optionsTime)).toString()}</span>
                        </div>
                    </div>

                    <div className="post-content-area">
                        <div className="post-media post-featured-image"></div>
                        <div className="entry-content" style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: data.content }}></div>
                        {imagesForGallery.length !== 0 ? <ImagesGallery items={imagesForGallery} /> : null}
                        <div>
                            {data.attachments && data.attachments.reverse().map(a =>
                                <AttachmentItem key={a.id} href={a.source_url} name={a.storage_key} />
                            )}
                        </div>

                        <div className="tags-area clearfix">
                            {data.tags.length > 0 ? <React.Fragment>
                                <div className="tags__title">{translate('tags')}</div>
                                <div className="post-tags">
                                    {data.tags !== undefined ? data.tags.map(tag => <h2 key={tag}><Link className="tag-post" to={`/newslist?tag=${tag}`}><span >{tag}</span></Link></h2>) : null}
                                </div>
                            </React.Fragment>
                                : null}
                        </div>
                        <div className="share__title">{translate('share')}</div>
                        <div className="post-share">
                            <FacebookShareButton className="d-inline-block mr-4 pointer" url={process.env.PUBLIC_HOST + window.location.pathname}>
                                <span title={translate('shareTooltip')}><FacebookIcon size={32} round={true} /></span>
                            </FacebookShareButton>
                            <TwitterShareButton className="d-inline-block mr-4 pointer" url={process.env.PUBLIC_HOST + window.location.pathname}>
                                <span title={translate('shareTooltip')}><TwitterIcon size={32} round={true} /></span>
                            </TwitterShareButton>
                            <LinkedinShareButton className="d-inline-block mr-4 pointer" url={process.env.PUBLIC_HOST + window.location.pathname}>
                                <span title={translate('shareTooltip')}><LinkedinIcon size={32} round={true} /></span>
                            </LinkedinShareButton>
                            <a className="d-inline-block printIcon" onClick={window.print}>
                                <PrintTwoToneIcon fontSize="large" />{translate('printableversion')}</a>
                        </div>
                    </div>
                </div>

                <nav className={colorThemeNavigation}>
                    <div className={previousNews.id !== null ? "post-previous" : "post-previous invisible"}>
                        <Link to={`${locateForURL}/news/${previousNews.id}`}>
                            <span>
                                <FontAwesomeIcon icon={['fas', 'angle-left']} />
                                <span className="p-2">
                                    {translate('previousNews')}
                                </span>
                            </span>
                            <h3>
                                {previousNews.title}
                            </h3>
                        </Link>
                    </div>

                    <div className={nextNews.id !== null ? "post-next" : "post-next invisible"}>
                        <Link to={`${locateForURL}/news/${nextNews.id}`}>
                            <span>
                                <span className="p-2">
                                    {translate('nextNews')}
                                </span>
                                <FontAwesomeIcon icon={['fas', 'angle-right']} />
                            </span>
                            <h3>
                                {nextNews.title}
                            </h3>
                        </Link>
                    </div>
                </nav>
            </React.Fragment>
            : null;

        return (
            <React.Fragment>
                <div id="main">
                    <div className="indent news">
                        <BreadcrumbsUI
                            curentPageTitle={data.title}
                            breadcrumbsArray={[{ href: `${locateForURL}/newslist`, title: translate('allNews') }]} />
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                {content}
                                {spinner}
                                {errorMessage}
                                {data.facebook_enable && <FacebookComments />}
                            </div>
                            <div className="col-lg-4 col-md-12 sticky-block-wrapper">
                                <Sticky
                                    topOffset={-50}
                                    stickyClassName={"sticky-block"}
                                    boundaryElement=".sticky-block-wrapper"
                                    hideOnBoundaryHit={false}
                                >
                                    <RightPanel
                                        colorThemeWidget={colorThemeWidget}
                                    />
                                </Sticky>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
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