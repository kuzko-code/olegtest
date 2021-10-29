export const formatDate = (date, language, dateOnly = false) => {
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: '2-digit',
  };

  const _time = new Date(date).toLocaleString(language, timeOptions);
  const _date = new Date(date).toLocaleString(language, dateOptions);

  if (dateOnly) {
    return _date;
  }

  return `${_time}, ${_date}`;
};

export const cutNews = (array, rubricTitle) => {
  const news = array || [];

  if (rubricTitle === 'rubric' && news.length > 5) {
    return news.slice(0, 5);
  }

  if (rubricTitle === 'blockViewRubric' && news.length > 6) {
    return news.slice(0, 6);
  }

  if (rubricTitle === 'listViewRubric' && news.length > 8) {
    return news.slice(0, 8);
  }

  return news;
};

export const findTitle = (titlesArray, id) => {
  const title = titlesArray.find((item) => item && item.id === id);
  if (title) {
    return title.title;
  }
};

export function mapOrder(array, order, key) {
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key];
    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
}

export const splitNewsList = (news, rubricTitle) => {
  let leftListNews;
  let rightListNews;
  if (rubricTitle === 'listViewRubric') {
    leftListNews = news.reduce((acc, item, idx) => {
      if (idx < Math.ceil(news.length / 2)) {
        acc.push(item);
        return acc;
      }
      return acc;
    }, []);

    rightListNews = news.reduce((acc, item, idx) => {
      if (idx >= Math.ceil(news.length / 2)) {
        acc.push(item);
        return acc;
      }
      return acc;
    }, []);
  }

  return { leftListNews, rightListNews };
};
