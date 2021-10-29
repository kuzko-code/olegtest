import React, { useState, useEffect } from 'react';
import UpdateTable from "./update-table.jsx";
import AutoUpdateForm from "./auto-update-form.jsx";
import SectionHeader from '../../components/header/SectionHeader.jsx';
import { useTranslate } from 'react-redux-multilingual';
import { Modal, Form } from 'react-bootstrap';
import { getPortalInfo, registerPortal } from '../../services/update-api-services.js'
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const UpdatePage = (props) => {
    const translate = useTranslate();
    const ver = props.match.params.ver;
    const initForm = {
        email: "",
        name: "",
        username: "",
        phone: ""
    }

    const [isShowModal, setIsShowModal] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState(initForm);

    useEffect(() => {
        getPortalInfo()
            .then(res => {
                if (res && res.hasOwnProperty('email') && res.email) {
                    setIsRegister(true);
                    if (res && res.hasOwnProperty('is_active') && res.is_active) {
                        setIsActive(true);
                    }
                }
            })
            .catch((error) => {
                console.error('Error :>> ', error);
            });
    }, [])

    const handleClose = () => {
        setIsShowModal(false);
    };
    const handleStartRegister = () => {
        if (!isRegister) {
            setIsShowModal(true);
        } else {
            Swal.fire({
                text: translate("updateWaitRegistrationMessage"),
                icon: 'warning',
                confirmButtonText: 'Ок',
                allowOutsideClick: true
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const post = {
            email: data.get('email') || null,
            name: data.get('name') || null,
            username: data.get('username') || null,
            phone: data.get('phone') || null,
        }

        const { newData, isValid } = validationForm(post);
        if (!isValid) {
            setFormData(newData);
            return;
        }

        registerPortal(newData)
            .then(res => {
                setIsShowModal(false);
                setFormData(initForm);
                setIsRegister(true);
                Swal.fire({
                    text: translate("requestToUpdateSuccessfullySubmitted"),
                    icon: 'success',
                    confirmButtonText: 'Ок',
                    allowOutsideClick: true
                });
            })
            .catch(error => {
                console.error(error);
                if (error == 'Error: duplicate key value violates unique constraint "u_email"') {
                    toast.error(translate("update_EmailAlreadyRegistered"))
                } else if (error == 'Error: duplicate key value violates unique constraint "portals_portal_url_key"') {
                    toast.error(translate("update_URLAlreadyRegistered"))
                }
            })

    };
    const validationForm = (data) => {
        const reqError = translate("fieldIsRequired");
        const invalidPhoneError = translate("invalidPhoneNumberFormat");
        const invalidEmailError = translate("invalidEmailFormat");

        let newData = JSON.parse(JSON.stringify(data));
        let isValid = true;
        //phone
        if (newData.phone && !REGULAR_EXPRESSIONS.TELEPHONE.test(newData.phone)) {
            newData.phoneError = invalidPhoneError;
            isValid = false;
        } else {
            newData.phoneError = undefined;
            delete newData.phoneError;
        }
        //email
        if (!newData.email || !newData.email.length > 0) {
            newData.emailError = reqError;
            isValid = false;
        } else if (!REGULAR_EXPRESSIONS.EMAIL.test(newData.email)) {
            newData.emailError = invalidEmailError;
            isValid = false;
        } else {
            newData.emailError = undefined;
            delete newData.emailError;
        }
        //name
        if (!newData.name || !newData.name.length > 0) {
            newData.nameError = reqError;
            isValid = false;
        } else {
            newData.nameError = undefined;
            delete newData.nameError;
        }

        return { newData, isValid };
    }

    return (
        <div>
            <SectionHeader title={translate('update')} />
            <div className="updatePage">
                <div className="wrapper wrapperContent animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <AutoUpdateForm isActiveRegister={isRegister && isActive} startRegister={handleStartRegister} />
                            <UpdateTable ver={ver} isActiveRegister={isRegister && isActive} startRegister={handleStartRegister} />
                            <Modal
                                show={(isShowModal)}
                                onHide={handleClose}
                                animation={false} size="md">
                                <Modal.Header closeButton>
                                    <Modal.Title>{translate("registration")}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>{translate("updateRegistrationMessage")}</p>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label className="requiredCustom">{translate("email")}</Form.Label>
                                            <Form.Control name="email" type="email" placeholder="example@email.com" required isInvalid={formData.emailError} />
                                            <Form.Control.Feedback type="invalid">
                                                {formData.emailError}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label className="requiredCustom">{translate("nameOfInstitution")}</Form.Label>
                                            <Form.Control name="name" type="text" maxLength={1000} required isInvalid={formData.nameError} />
                                            <Form.Control.Feedback type="invalid">
                                                {formData.nameError}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicFullName">
                                            <Form.Label>{translate("fullName")}</Form.Label>
                                            <Form.Control name="username" type="text" maxLength={1000} />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPhone">
                                            <Form.Label>{translate("phone")}</Form.Label>
                                            <Form.Control name="phone" type="tel" placeholder="380123456789" isInvalid={formData.phoneError} />
                                            <Form.Control.Feedback type="invalid">
                                                {formData.phoneError}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="float-right pt-3" controlId="formBasic">
                                            <button
                                                type="submit"
                                                className="btn btn-mint-green btn-sm mr-3"
                                            >
                                                {translate('save')}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm btnModalAddClose"
                                                onClick={handleClose}
                                            >
                                                {translate('close')}
                                            </button>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UpdatePage;
