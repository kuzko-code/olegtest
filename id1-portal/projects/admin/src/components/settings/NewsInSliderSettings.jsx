import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';

import SliderSettings from './SliderSettings.jsx';
import { getBannerById, putBanner } from '../../services/tab-api.js';
import { getAllNews } from '../../services/news-api-services.js';

const NewsInSliderSettings = ({ id, closeModal }) => {
  const language = useSelector((state) => state.Intl.locale);
  const translate = useTranslate();

  const [allNews, setAllNews] = useState([]);
  const [banner, setBanner] = useState([]);
  const [slidersCount, setSlidersCount] = useState(1);

  const handleSubmit = async () => {
    try {
      const bannerClone = JSON.parse(JSON.stringify(banner));
      const form_data = bannerClone
        .map((arr) => arr.filter((item) => typeof item === 'number'))
        ?.filter((arr) => arr.length !== 0);

      const { status, error_message } = await putBanner(
        JSON.stringify({ id, form_data })
      );

      if (status !== 'ok') {
        throw error_message;
      }

      toast.success(translate('changesSavedSuccessfully'));
    } catch (error) {
      console.log('Error while saving settings :>> ', error);
    } finally {
      closeModal();
    }
  };

  const getBannerData = () => {
    const bannerClone = banner.slice();
    bannerClone.length = slidersCount;
    for (let i = 0; i < bannerClone.length; i++) {
      const element = bannerClone[i];
      if (!element) {
        bannerClone[i] = [];
      }
    }

    return bannerClone;
  };

  useEffect(() => {
    const onInit = async () => {
      try {
        const [banner, news] = await Promise.all([
          getBannerById(id),
          getAllNews(language),
        ]);

        if (banner.status !== 'ok' || news.status !== 'ok') {
          if (banner.error_message) {
            throw banner.error_message;
          }
          if (news.error_message) {
            throw news.error_message;
          }
        }

        setAllNews(news.data);
        setSlidersCount(banner.data.json_schema.maxItems);

        Array.isArray(banner.data.form_data) &&
          banner.data.form_data.length > 0 &&
          setBanner(banner.data.form_data);
      } catch (error) {
        console.log('Error in NewsInSliderSettings:>> ', error);
      }
    };

    onInit();
  }, []);

  return (
    <>
      {getBannerData().map((item, idx) => (
        <SliderSettings
          key={idx}
          newsIds={item}
          blockIdx={idx}
          title={id}
          allNews={allNews}
          setBanner={setBanner}
        />
      ))}

      <div className="mainSettingsModal__btnWrapper">
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-mint-green btn-sm mr-3"
        >
          {translate('save')}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm btnModalAddClose"
          onClick={closeModal}
        >
          {translate('close')}
        </button>
      </div>
    </>
  );
};

export default NewsInSliderSettings;
