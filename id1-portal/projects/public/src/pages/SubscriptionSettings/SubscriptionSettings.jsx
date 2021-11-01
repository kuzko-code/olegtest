import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { withTranslate } from 'react-redux-multilingual';
import { putNewsSubscription, getNewsSubscription } from '../../services';
import { SUBSCRIPTION_NEWS_SETTINGS } from '../../constants/common';
import Swal from 'sweetalert2'
import { NotFound } from "../ReExportPages.js"

import './SubscriptionSettings.css';


const SubscriptionSettings = ({ translate, match, history }) => {
  const id = match.params.id;
  const language = useSelector(({ Intl }) => Intl.locale);

  const defaultValues = { status: null, language: language };

  const themeColor = useSelector(
    ({ reducerSettings }) => reducerSettings.Layout.selectedColorTheme[2]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNewsSubscription(id, language)
      .then(res => {
        if (!res.language) {
          setError(true);
          setLoading(false);
          return;
        }
        setValue("status", res.status);
        setValue("language", res.language);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
        console.error("Error", err);
      })
  }, [])

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    shouldFocusError: true,
  });

  const onUnsubscribe = async () => {
    setLoading(true);
    try {
      await putNewsSubscription(id, {
        status: "Never"
      });
      Swal.fire({
        title: translate("unsubscribeSuccessfully"),
        icon: 'success',
        confirmButtonText: 'Ок',
        allowOutsideClick: false
      });
      history.push('/');
    } catch (err) {
      console.error('Error while setting the subscription :>> ', err);
      Swal.fire({
        title: translate("errorOccurredWhileSaving"),
        icon: 'error',
        confirmButtonText: 'Ок',
        allowOutsideClick: false
      });
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await putNewsSubscription(id, {
        status: data.status
      });
      Swal.fire({
        title: translate("settingsSavedSuccessfully"),
        icon: 'success',
        confirmButtonText: 'Ок',
        allowOutsideClick: false
      });
      reset(data);
    } catch (err) {
      console.error('Error while setting the subscription :>> ', err);
      Swal.fire({
        title: translate("errorOccurredWhileSaving"),
        icon: 'error',
        confirmButtonText: 'Ок',
        allowOutsideClick: false
      });
    }
    setLoading(false);
  };

  return (
    error ?
      <NotFound /> :
      <div className="p-4">
        <h1 className="text-center mb-4">{translate('subscriptionSettings')}</h1>
        <p className="subscriptionSettings__descriptionText text-center mb-4">
          {translate('subscriptionSettingsDescription')}
        </p>
        <h2 className="text-center mb-4">{translate('howOftenSendLetters')}</h2>
        {loading ?
          <div className="d-flex justify-content-center m-5">
            <div className="spinner-border text-color">
            </div>
          </div> :
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    aria-label="status"
                    name="status"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <div className="row">
                      {SUBSCRIPTION_NEWS_SETTINGS.map((status) => (
                        <div key={status} className="col-md-4 text-md-center">
                          <FormControlLabel
                            value={status}
                            control={<Radio style={{ color: themeColor }} />}
                            label={translate('subscriptionStatus' + status)}
                          />
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="subscriptionSettings__submitBtn"
                disabled={!isDirty}
              >
                {translate('saveSettings')}
              </button>
              <button
                type="button"
                className="subscriptionSettings__UnsubscribeBtn"
                onClick={onUnsubscribe}
              >
                {translate('subscriptionStatusNever')}
              </button>
            </div>
          </form>
        }
      </div>
  );
};

export default withRouter(withTranslate(SubscriptionSettings));