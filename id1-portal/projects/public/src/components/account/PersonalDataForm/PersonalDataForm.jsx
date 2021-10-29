import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Controller, useForm } from 'react-hook-form';
import { IconButton, makeStyles } from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DateFnsUtils from '@date-io/date-fns';

import FormItem from './FormItem.jsx';
import { updateCurrentUser } from '../../../redux/user/userOperations.js';
import config from '../../../../config/index.jsx';
import './PersonalDataForm.css';

const useStyles = makeStyles({
  root: {
    borderRadius: 2,
  },
});

const PersonalDataForm = ({ translate }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { first_name, last_name, patronymic, phone, birthday, email, userId } =
    useSelector(({ user }) => user);
  const initialData = [
    {
      id: 'personalDataForm__first_name',
      name: 'first_name',
      value: first_name,
      label: translate('firstName'),
      isRequired: true,
    },
    {
      id: 'personalDataForm__last_name',
      name: 'last_name',
      value: last_name,
      label: translate('lastName'),
      isRequired: true,
    },
    {
      id: 'personalDataForm__patronymic',
      name: 'patronymic',
      value: patronymic,
      label: translate('patronymic'),
      isRequired: false,
    },
    {
      id: 'personalDataForm__email',
      name: 'email',
      value: email,
      label: translate('email'),
      isRequired: false,
    },
    {
      id: 'personalDataForm__phone',
      name: 'phone',
      value: phone,
      label: translate('phone'),
      isRequired: false,
    },
  ];
  const defaultValues = initialData.reduce((acc, { name, value }) => {
    return { ...acc, [name]: value };
  }, {});
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { ...defaultValues, birthday },
    shouldFocusError: true,
    mode: 'onBlur',
  });

  const [isEdited, setIsEdited] = useState(false);
  const [locale, setLocale] = useState(null);

  const onSubmit = (data) => {
    try {
      const body = Object.assign({}, data);
      delete body.email;

      dispatch(updateCurrentUser(body, setIsEdited));
    } catch (error) {
      console.error('Error while updating the user :>> ', error);
    }
  };

  const handleOpenEdit = () => {
    setIsEdited(true);
  };

  const handleCancelEdit = () => {
    reset({ ...defaultValues, birthday });
    setIsEdited(false);
  };

  useEffect(() => {
    const code = translate('localeCode_date_fns') || 'en-US';
    import(`date-fns/locale/${code}/index.js`)
      .then((obj) => {
        setLocale(obj.default);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <form>
      <div className="row justify-content-end m-0">
        {isEdited && (
          <IconButton
            classes={{
              root: classes.root,
            }}
            onClick={handleCancelEdit}
          >
            <CloseIcon className="mr-2" />
            <span className="accountSettings__editBtnText">
              {translate('cancel')}
            </span>
          </IconButton>
        )}
        <IconButton
          classes={{
            root: classes.root,
          }}
          onClick={isEdited ? handleSubmit(onSubmit) : handleOpenEdit}
        >
          {isEdited ? (
            <SaveIcon className="mr-2" />
          ) : (
            <EditIcon className="mr-2" />
          )}
          <span className="accountSettings__editBtnText">
            {isEdited ? translate('save') : translate('edit')}
          </span>
        </IconButton>
      </div>
      {initialData.map(({ id, name, label, isRequired }) => (
        <FormItem
          key={id}
          itemId={id}
          label={label}
          spanLabel={3}
          spanItem={9}
          isRequired={isRequired}
        >
          <fieldset disabled={name === 'email' || !isEdited} className="mb-1">
            <input
              id={id}
              type="text"
              className="form-control border-radius-1 shadow-none"
              {...register(name, {
                required: isRequired,
                pattern: name === 'phone' && config.REGULAR_EXPRESSIONS.PHONE,
                maxLength:
                  (name === 'first_name' ||
                    name === 'last_name' ||
                    name === 'patronymic') &&
                  100,
              })}
            />
          </fieldset>
          {errors[name] && errors[name].type === 'required' && (
            <span className="accountSettings__formErrorMessage">
              {translate('fieldRequired')}
            </span>
          )}
          {errors[name] && errors[name].type === 'pattern' && (
            <span className="accountSettings__formErrorMessage">
              {translate('formFormatError')}
            </span>
          )}
          {errors[name] && errors[name].type === 'maxLength' && (
            <span className="accountSettings__formErrorMessage">
              {translate('inputLength100Error')}
            </span>
          )}
        </FormItem>
      ))}
      <FormItem
        itemId={'personalDataForm__birthday'}
        label={translate('birthday')}
        spanLabel={3}
        spanItem={9}
        isRequired={false}
      >
        <Controller
          name="birthday"
          control={control}
          defaultValue={null}
          rules={{
            validate: {
              pastDate: (value) => new Date(value) < new Date(),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <MuiPickersUtilsProvider locale={locale} utils={DateFnsUtils}>
              <div
                className={[
                  'personalDataForm__datePickerWrapper mb-1',
                  !isEdited && 'disabled',
                ].join(' ')}
              >
                <KeyboardDatePicker
                  id="personalDataForm__birthday"
                  value={value ? new Date(value) : null}
                  onChange={onChange}
                  inputVariant="outlined"
                  format="dd.MM.yyyy"
                  autoOk
                  disabled={!isEdited}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  disableFuture
                />
              </div>
              {errors.birthday && errors.birthday.type === 'pastDate' && (
                <span className="accountSettings__formErrorMessage d-block">
                  {translate('birthdayDateFutureError')}
                </span>
              )}
            </MuiPickersUtilsProvider>
          )}
        />
      </FormItem>
    </form>
  );
};

export default withTranslate(PersonalDataForm);
