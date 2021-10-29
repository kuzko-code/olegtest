import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslate } from 'react-redux-multilingual';
import { Form, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getScheduleUpdateSite, updateScheduleUpdateSite } from '../../services/update-api-services.js'

const customStyles = {
    option: (provided, state) => ({ ...provided }),
    control: (provided, state) => ({
        ...provided,
        '&:hover': { borderColor: '#1ab394' },
        border: '1px solid lightgray',
        boxShadow: 'none',

    }),
    menu: (provided, state) => ({ ...provided, zIndex: 11 }),
};

const AutoUpdateForm = (props) => {
    const translate = useTranslate();

    const [data, setData] = useState({});
    const [initialData, setInitialData] = useState('');
    const [loading, setLoading] = useState(true);

    const periodUpdateOptions = [
        { value: "every_week", label: translate("every_week") },
        { value: "every_month", label: translate("every_month") },
        { value: "every_year", label: translate("every_year") }
    ];
    const daysOfWeekOptions = [
        { value: 1, label: translate("Monday") },
        { value: 2, label: translate("Tuesday") },
        { value: 3, label: translate("Wednesday") },
        { value: 4, label: translate("Thursday") },
        { value: 5, label: translate("Friday") },
        { value: 6, label: translate("Saturday") },
        { value: 0, label: translate("Sunday") }
    ];
    const hoursOfDayOptions = [...Array(24).keys()].map((item, index) => {
        return { value: index, label: `${index}:00` };
    });

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        setLoading(true)
        let initialState = {
            updatedFrequency: "never",
            updatedTime: 0,
            updatedDay: 0
        }
        getScheduleUpdateSite()
            .then((res) => {
                if (res) {
                    initialState = Object.assign({}, initialState, res);
                }
                setData(initialState);
                setInitialData(JSON.stringify(initialState));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    }

    const handleChangeUpdatedFrequencyRadio = ({ target }) => {
        const freq = target.id;
        if (freq == 'never') {
            setData((prevState) => ({ ...prevState, updatedFrequency: freq }));
        } else {
            if (props.isActiveRegister) {
                setData((prevState) => ({ ...prevState, updatedFrequency: 'every_week', updatedDay: 1, updatedTime: 0 }));
            } else {
                props.startRegister();
            }
        }
    };

    const handleChangeUpdatedFrequency = (e) => {
        const freq = e.value;
        setData((prevState) => ({ ...prevState, updatedFrequency: freq }));
    }
    const handleChangeUpdatedDay = (e) => {
        const day = e.value;
        setData((prevState) => ({ ...prevState, updatedDay: day }));
    }

    const handleChangeUpdatedTime = (e) => {
        const time = e.value;
        setData((prevState) => ({ ...prevState, updatedTime: time }));
    }

    const handleClickSave = (e) => {
        if (props.isActiveRegister) {
            updateScheduleUpdateSite(data)
                .then(res => {
                    setInitialData(JSON.stringify(data));
                    toast.success(translate("updateSettingsSaved"));
                })
                .catch((error) => {
                    console.log('Error :>> ', error);
                    toast.error(translate("errorOccurredWhileSavingTheUpdateSettings"));
                });
        } else {
            props.startRegister();
        }
    }

    return (
        <div className="pageElementBox border-bottom">
            <div className="pageElementBoxTitle border-bottom-0">
                <h5>{translate("UpdateSettings")}</h5>
            </div>
            <div className="pageElementBoxContent">
                {loading ?
                    <CircularProgress
                        className={'ml-3'}
                        style={{ color: '#19aa8d' }}
                    /> :
                    <Form>
                        <div className="mb-3">
                            <Form.Check
                                name="updatedFrequency"
                                inline
                                label={translate("AutoUpdate")}
                                type="radio"
                                id={`auto-update`}
                                checked={data.updatedFrequency != 'never'}
                                onChange={handleChangeUpdatedFrequencyRadio}
                            />
                            <Form.Check
                                name="updatedFrequency"
                                inline
                                label={translate("DoNotUpdate")}
                                type="radio"
                                id={`never`}
                                checked={data.updatedFrequency == 'never'}
                                onChange={handleChangeUpdatedFrequencyRadio}
                            />
                        </div>
                        {data.updatedFrequency != 'never' &&
                            <Form.Row>
                                <Form.Label column sm="12" lg="2" htmlFor="periodUpdate" className="text-md-left text-lg-right">
                                    {translate("UpdateFrequency")}
                                </Form.Label>
                                <Col sm="12" lg="2">
                                    <Select
                                        id="periodUpdate"
                                        options={periodUpdateOptions}
                                        value={periodUpdateOptions.find(item => item.value == data.updatedFrequency)}
                                        onChange={handleChangeUpdatedFrequency}
                                        placeholder={''}
                                        styles={customStyles}
                                    />
                                </Col>
                                {
                                    data.updatedFrequency == 'every_month' ?
                                        <Form.Label column sm="12" lg="4" className="text-md-center text-lg-center">
                                            {translate("firstDayOfMonth")}
                                        </Form.Label> :
                                        data.updatedFrequency == 'every_year' ?
                                            <Form.Label column sm="12" lg="4" className="text-md-center text-lg-center">
                                                {translate("firstDayOfFirstMonthOfYear")}
                                            </Form.Label> :
                                            <>
                                                <Form.Label column sm="12" lg="2" htmlFor="daysOfWeek" className="text-md-left text-lg-right">
                                                    {translate("Weekday")}
                                                </Form.Label>
                                                <Col sm="12" lg="2" disabled>
                                                    <Select
                                                        id="daysOfWeek"
                                                        options={daysOfWeekOptions}
                                                        value={daysOfWeekOptions.find(item => item.value == data.updatedDay)}
                                                        onChange={handleChangeUpdatedDay}
                                                        placeholder={''}
                                                        styles={customStyles}
                                                    />
                                                </Col>
                                            </>
                                }
                                <Form.Label column sm="12" lg="2" htmlFor="hoursOfDay" className="text-md-left text-lg-right">
                                    {translate("UpdateTime")}
                                </Form.Label>
                                <Col sm="12" lg="2">
                                    <Select
                                        id="hoursOfDay"
                                        options={hoursOfDayOptions}
                                        value={hoursOfDayOptions.find(item => item.value == data.updatedTime)}
                                        onChange={handleChangeUpdatedTime}
                                        placeholder={''}
                                        styles={customStyles}
                                    />
                                </Col>
                            </Form.Row>
                        }
                        <Form.Row className="justify-content-between mt-3">
                            <Form.Text as="p" className="text-danger">
                                {
                                    data.updatedFrequency == 'never' ? translate('updateWarning2') : translate('updateWarning')
                                }
                            </Form.Text>
                            <Button
                                onClick={handleClickSave}
                                className="btn btn-mint-green mr-2"
                                disabled={JSON.stringify(data) == initialData}
                            >{translate('save')}</Button>
                        </Form.Row>
                    </Form>
                }
            </div>
        </div>
    );
};

export default AutoUpdateForm;