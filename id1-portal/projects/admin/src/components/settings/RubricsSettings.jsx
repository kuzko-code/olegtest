import { Checkbox, FormControlLabel } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import shortid from 'shortid';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-redux-multilingual';
import RubricsSettingsItem from './RubricsSettingsItem.jsx';
import { getBannerById, putBanner } from '../../services/tab-api.js';
import { getRubrics } from '../../services/rubric-api-services.js';
import { toast } from 'react-toastify';

const RubricsSettings = ({ id, closeModal }) => {
  const language = useSelector((state) => state.Intl.locale);
  const translate = useTranslate();

  const [rubrics, setRubrics] = useState([]);
  const [banner, setBanner] = useState({
    rubrics: [],
    showLinksToAllNews: true,
  });

  const rubricsNews = banner.rubrics.map((rubricId) => {
    const res = rubrics.find((item) => item.id === rubricId);
    if (res === undefined) {
      return {
        id: rubricId,
        title: '',
        language: '',
      };
    }
    return res;
  });

  const addItem = () => {
    setBanner((banner) => ({
      ...banner,
      rubrics: [...banner.rubrics, Date.now().toString()],
    }));
  };

  const handleChange = () => {
    setBanner((banner) => ({
      ...banner,
      showLinksToAllNews: !banner.showLinksToAllNews,
    }));
  };

  const handleSubmit = async () => {
    try {
      const bannerClone = JSON.parse(JSON.stringify(banner));
      bannerClone.rubrics = bannerClone.rubrics.filter(
        (item) => typeof item === 'number'
      );

      const body = { id, form_data: bannerClone };
      const { data, status, error_message } = await putBanner(
        JSON.stringify(body)
      );
      toast.success(translate('changesSavedSuccessfully'));
    } catch (error) {
      toast.error(translate('errorOccurredWhileSavingTheSettings'));
      console.log('Error while saving settings :>> ', error);
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    const onInit = async () => {
      try {
        const [banner, rubrics] = await Promise.all([
          getBannerById(id),
          getRubrics(language),
        ]);

        if (banner.status !== 'ok' || rubrics.status !== 'ok') {
          banner.error_message &&
            console.log('Error :>> ', banner.error_message);
          rubrics.error_message &&
            console.log('Error :>> ', rubrics.error_message);
          return;
        }

        setRubrics(rubrics.data);
        banner.data.form_data && setBanner(banner.data.form_data);
      } catch (error) {
        console.log('Error in RubricsSettings:>> ', error);
      }
    };

    onInit();
  }, []);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={banner.showLinksToAllNews}
            onChange={handleChange}
            style={{ color: '#1ab394' }}
          />
        }
        label={translate('blockViewRubricCheck')}
      />
      {rubricsNews.map((item, idx, array) => (
        <RubricsSettingsItem
          idx={idx}
          rubricsNews={array}
          data={item}
          rubrics={rubrics}
          key={shortid.generate()}
          setBanner={setBanner}
        />
      ))}
      <div style={{ textAlign: 'right', marginBottom: 30 }}>
        <button
          type="button"
          className="btn btn-mint-green btn-add col-xs-12 btnModalAddClose"
          tabIndex="0"
          onClick={addItem}
        >
          <i className="glyphicon glyphicon-plus"></i>
        </button>
      </div>
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

export default RubricsSettings;
