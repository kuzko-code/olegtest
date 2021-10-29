import React from 'react';
import { Suspense } from 'react';
import ViewCarouselOutlinedIcon from '@material-ui/icons/ViewCarouselOutlined';
import Crop75OutlinedIcon from '@material-ui/icons/Crop75Outlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';
import ArtTrackOutlinedIcon from '@material-ui/icons/ArtTrackOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import FiberNewOutlinedIcon from '@material-ui/icons/FiberNewOutlined';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import FacebookIcon from '@material-ui/icons/Facebook';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import LinksEditor from '../components/links/linksEditor.jsx';
import CarouselSettings from '../components/settings/CarouselSettings.jsx';
import CarouselSettingsWithTemplate from '../components/settings/CarouselSettingsWithTemplate.jsx';
import LinkWrapperSettings from '../components/settings/LinkWrapperSettings.jsx';
import NewsInSliderSettings from '../components/settings/NewsInSliderSettings.jsx';
import PopularLastNews from '../components/settings/PopularLastNews.jsx';
import FacebookPage from '../components/settings/FacebookPage.jsx';
import RubricsSettings from '../components/settings/RubricsSettings.jsx';

export const sortArray = (a, b) => {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
};

export const filterPassedDate = (calendarDate) => {
  const today = new Date();
  const date = new Date(calendarDate);
  date.setHours(23, 59, 59);

  return today < date;
};

export const excludeTime = (selectedDate) => {
  const isToday = checkToday(selectedDate);
  if (!isToday) {
    return [];
  } else {
    const hours = [0, 3, 6, 9, 12, 15, 18, 21, 23];
    const today = new Date();
    const day = new Date();
    const excludeData = hours
      .map((item) => new Date(day.setHours(item, 0, 0)))
      .filter((item) => {
        return item < today;
      });
    return excludeData;
  }
};

export const checkToday = (date) => {
  if (!date) {
    return false;
  }

  const today = new Date();
  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    return true;
  } else {
    return false;
  }
};

export const roundTime = (date) => {
  const hours = date.getHours();
  const roundedHours = hours - (hours % 3) + 3;
  date.setHours(roundedHours, 0, 0);
  return date.toISOString();
};

export const filterEmptyValues = (data, id) => {
  if (!data) {
    return;
  }

  if (id === 'blockViewRubric' || id === 'listViewRubric' || id === 'rubric') {
    return data.rubrics?.filter((item) => !item.toString().startsWith('empty'));
  }

  if (id === 'sliderNewsForTop' || id === 'sliderNewsForBottom') {
    return data.form_data?.map((item) =>
      item.filter((itm) => !itm.toString().startsWith('empty'))
    );
  }

  return data.filter((item) => !item.toString().startsWith('empty'));
};

export const filterEmptyArray = (data) =>
  data.filter((item) => {
    if (item.length === 0) {
      return false;
    }

    return true;
  });

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

export const parseEditorImagesIds = (html) => {
  const imagesIds = [];
  if (!html) {
    return imagesIds;
  }
  const regexp = new RegExp('<img [^>]*src="([^"]+)"', 'g');
  const result = html.match(regexp);

  if (result) {
    result.map((el) => {
      const idStartIdx = el.lastIndexOf('/') + 1;
      const idEndIdx = el.indexOf('_');
      if (idStartIdx > 0 && idEndIdx > 0) {
        imagesIds.push(el.substring(idStartIdx, idEndIdx));
      }
    });
  }

  return imagesIds;
};

export const parseEditorImagesHeightDelete = (html) => {
  return html.replaceAll(/(<img [^>]*)(height="[^"]+")/g, '$1');
};

export const filterProps = (obj) => {
  const filtered = Object.assign({}, obj);
  delete filtered.initialState;
  delete filtered.currentTab;
  delete filtered.logoUploading;
  delete filtered.error;
  delete filtered.images;
  delete filtered.isModalPreviewShown;
  delete filtered.loading;
  delete filtered.isOldLinkValid;
  delete filtered.footerLogoDefault;
  delete filtered.headerLogoDefault;
  return filtered;
};

export const pressEnterPreventDefault = (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
    return false;
  }
};

export const getMainSettingsModalForm = (props, type, plugins) => {
  if (!type) {
    return;
  }

  const forms = {
    sliderNews: <NewsInSliderSettings {...props} />,
    sliderLinks: <CarouselSettingsWithTemplate {...props} />,
    blockViewRubric: <RubricsSettings {...props} />,
    listViewRubric: <RubricsSettings {...props} />,
    rubric: <RubricsSettings {...props} />,
    latestNews: <PopularLastNews {...props} />,
    popularNews: <PopularLastNews {...props} />,
    linkEditor: <LinksEditor {...props} />,
    blockLinks: <CarouselSettings {...props} />,
    linkWrapper: <LinkWrapperSettings {...props} />,
    facebookPage: <FacebookPage {...props} />,
  };

  if (forms[type]) {
    return forms[type];
  }

  const { plugin, tab } = plugins.reduce(
    (acc, plugin) => {
      const tab = plugin.tabs?.find((tab) => tab.type === type);

      if (tab) {
        return { plugin, tab };
      }

      return acc;
    },
    { plugin: null, tab: null }
  );

  const Component = tab?.formTabSettings
    ? React.lazy(() =>
        import(`../plugins/${plugin.name + tab.formTabSettings}`)
      )
    : () => <span>No form found</span>;

  return (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );
};

export const getAddBannerIcon = (type, props) => {
  if (!type) {
    return;
  }

  const icons = {
    sliderNews: <ViewCarouselOutlinedIcon {...props} />,
    sliderLinks: <ViewCarouselOutlinedIcon {...props} />,
    linkWrapper: <Crop75OutlinedIcon {...props} />,
    blockViewRubric: <ImageOutlinedIcon {...props} />,
    listViewRubric: <ListOutlinedIcon {...props} />,
    rubric: <ArtTrackOutlinedIcon {...props} />,
    linkEditor: <CreateOutlinedIcon {...props} />,
    socialNetworks: <ForumOutlinedIcon {...props} />,
    popularTags: <LabelOutlinedIcon {...props} />,
    popularNews: <BallotOutlinedIcon {...props} />,
    latestNews: <FiberNewOutlinedIcon {...props} />,
    blockLinks: <MenuOutlinedIcon {...props} />,
    facebookPage: <FacebookIcon {...props} />,
    mailing: <MailOutlineIcon {...props} />,
  };

  return icons[type];
};

export const disableScrolling = () => {
  var x = window.scrollX;
  var y = window.scrollY;
  window.onscroll = function () {
    window.scrollTo(x, y);
  };
};

export const enableScrolling = () => {
  window.onscroll = null;
};
