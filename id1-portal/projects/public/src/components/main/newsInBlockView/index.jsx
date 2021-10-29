import React from 'react';
import '../../../../public/assets/css/layout/modal.css';
import IndependentBlock from './independentBlock.jsx';
import PairedBlock from './pairedBlock.jsx';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { cutNews } from '../../../services/helpers';
import LinkToAllNews from '../linkToAllNews.jsx';
import { getNewsByRubrics } from '../../../redux/newsByRubric/newsByRubricOperations';

class NewsInBlockView extends React.Component {
  componentDidMount() {
    this.props.getNews(
      this.rubricsIds,
      this.props.rubricTitle,
      this.props.language
    );
  }
  form_data = this.props.form_data;
  rubricsIds = this.form_data.rubrics;

  render() {
    const { newsData } = this.props;
    let newsByRubric = [];
    if (this.props.newsData) {
      this.rubricsIds.map(id => {
        const arr = newsData[id];
        if (arr && arr.length > 0)
          newsByRubric.push(arr);
      });
    }
    let independentBlockNews = [];
    if (newsByRubric.length > 0 && newsByRubric.length % 2 !== 0) {
      independentBlockNews = newsByRubric.splice(0, 1)[0];
      independentBlockNews = cutNews(independentBlockNews, 'rubric');
    }
    return (
      this.rubricsIds.length > 0 ?
        <div>
          {independentBlockNews.length > 0 &&
            <IndependentBlock newsList={independentBlockNews} />}
          {newsByRubric.length > 0 &&
            <PairedBlock newsByRubric={newsByRubric} />}
          {this.props.showLink && (
            <LinkToAllNews className="justify-content-end" />
          )}
        </div> : null
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    newsData: state.newsByRubric.data.rubric,
    leftBanners: state.reducerSettings.BannersPosition.locationOfLeftBanners,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNews: (rubricsIds, rubricTitle, language) => {
      if (!rubricsIds || rubricsIds.length === 0 || !rubricTitle) {
        return;
      }
      dispatch(getNewsByRubrics(rubricsIds, rubricTitle, language));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(NewsInBlockView));
