import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import { withTranslate } from 'react-redux-multilingual';
import { useDispatch, useSelector } from 'react-redux';
import BlockViewRubricItem from './BlockViewRubricItem.jsx';
import ListViewRubricItem from './ListViewRubricItem.jsx';
import LinkToAllNews from '../linkToAllNews.jsx';
import { cutNews, findTitle, splitNewsList, mapOrder } from '../../../services/helpers.js';
import { getNewsByRubrics } from '../../../redux/newsByRubric/newsByRubricOperations.js';
import './NewsViewRubric.css';


import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabScrollButton from '@material-ui/core/TabScrollButton';
import Box from '@material-ui/core/Box';

const SimpleTabs = withStyles({
  root: {
    borderBottom: '2px solid #0000001a',
  },
  indicator: {
    backgroundColor: 'var(--theme-color)',
  },
})(Tabs);

const SimpleTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    maxWidth: 'none',
    marginRight: theme.spacing(4),
    fontSize: '18px',
    fontWeight: 'bold',
    '&:hover': {
      color: 'var(--theme-color)',
      opacity: 0.9,
    },
    '&$selected': {
      color: '#000000',
    },
    '&:focus': {
      color: '#000000',
    },
  },
  selected: {}
}))((props) => <Tab disableRipple {...props} />);

const SimpleTabScrollButton = withStyles({
  root: {
    width: '35px',
    '&$disabled': {
      opacity: '0.25'
    }
  },
  disabled: {}
})(TabScrollButton);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-label={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="newsViewRubric__wrapper">
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index, label) {
  return {
    'aria-label': label
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
}));


const NewsViewRubric = ({ form_data, rubricTitle, showLink, translate }) => {

  const className = {
    blockViewRubric: 'newsViewRubric__content',
    listViewRubric: 'newsViewRubric__content',
  };

  const dispatch = useDispatch();
  const language = useSelector((state) => state.Intl.locale);

  const classes = useStyles();

  const [activeRubric, setActiveRubric] = useState(0);
  const data = useSelector((state) => state.newsByRubric.data[rubricTitle]);

  useEffect(() => {
    if (!rubricsIds || rubricsIds.length === 0 || !rubricTitle) {
      return;
    }
    dispatch(getNewsByRubrics(rubricsIds, rubricTitle, language));
  }, []);

  const newsByRubricData = data ? data : {};
  const newsByRubric = Object.values(newsByRubricData).filter(n => n && n.length > 0);

  const rubricsIds = form_data.rubrics;
  const rubricsTitlesTemp = newsByRubric
    .reduce((acc, item) => [...acc, ...item], [])
    .map((item) => item.rubric || { id: 0, title: translate('withoutRubrics') });

  let rubricsTitles = [...new Map(rubricsTitlesTemp.map(item =>
    [item.id, item])).values()];

  rubricsTitles = mapOrder(rubricsTitles, rubricsIds, 'id');

  const handleChange = (event, newValue) => {
    setActiveRubric(newValue);
  };
  return newsByRubric && newsByRubric.length > 0 && activeRubric != null ? (
    <div className={classes.root}>
      <SimpleTabs
        value={activeRubric}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        ScrollButtonComponent={SimpleTabScrollButton}
      >
        {rubricsTitles &&
          rubricsTitles.map((rubric, index) => (
            <SimpleTab key={rubric.id} label={rubric.title} {...a11yProps(index, rubric.title)} />
          ))}
      </SimpleTabs>
      {rubricsTitles &&
        rubricsTitles.map((rubric, index) => {
          const news = cutNews(newsByRubricData[rubric.id], rubricTitle);
          const { leftListNews, rightListNews } = splitNewsList(news, rubricTitle);
          return (
            <TabPanel value={activeRubric} index={index} key={index}>
              <div className={className[rubricTitle]}>
                {rubricTitle === 'listViewRubric' && (
                  <div className="row">
                    <div className="col">
                      {leftListNews.map((item) => {
                        return <ListViewRubricItem key={item.id} news={item} />;
                      })}
                    </div>
                    <div className="col">
                      {rightListNews.map((item) => {
                        return <ListViewRubricItem key={item.id} news={item} />;
                      })}
                    </div>
                  </div>
                )}
                {rubricTitle === 'blockViewRubric' &&
                  news.map((item) => {
                    return <BlockViewRubricItem key={item.id} news={item} />;
                  })}
              </div>
            </TabPanel>
          )
        })}
      {showLink && <LinkToAllNews className="justify-content-end" />}
    </div>
  ) : null;
};

export default withTranslate(NewsViewRubric);
