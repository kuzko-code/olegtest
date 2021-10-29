import React, { useRef, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-redux-multilingual';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';

import * as TableSettings from './update-table-settings.js';
import { getPortalVersions, getPortalVersionByVersion, updatePortal } from '../../services/update-api-services.js'

const UpdateTable = (props) => {
    const language = useSelector((state) => state.Intl.locale);
    const materialTableRef = useRef();
    const translate = useTranslate();
    const history = useHistory();

    const [isShowModal, setIsShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });
    const [startInstall, setStartInstall] = useState(false);

    useEffect(() => {
        const ver = props.ver
        if (ver) {
            getPortalVersionByVersion(ver)
                .then(res => {
                    if (res && Object.keys(res).length > 0) {
                        setModalContent(TableSettings.getUpdateModalContent(res, translate));
                        setIsShowModal(true);
                    }
                })
                .catch((error) => {
                    console.error('Error :>> ', error);
                });
        }
    }, [props.ver])

    const removeClassDisabledElement = () => {
        let element = document.getElementById("root");
        element.classList.remove("disabledElement");
    }

    const addClassDisabledElement = () => {
        let element = document.getElementById("root");
        element.classList.add("disabledElement");
    }

    const installUpdate = (rowData) => {
        if (props.isActiveRegister) {
            Swal.fire({
                title: translate("UpdatePlatformQuestion"),
                text: translate("updateModalWarning"),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonText: translate('installPluginCancelButtonText'),
                confirmButtonText: translate("YesUpdate")
            }).then((result) => {
                try {
                    if (result.value) {
                        if (!rowData.version || rowData.status !== 'notInstalled') {
                            toast.error(translate("SelectAvailableUpdate"));
                            return;
                        }
                        setStartInstall(true);
                        addClassDisabledElement();
                        updatePortal(rowData.version)
                            .then(res => {
                                setStartInstall(false);
                                removeClassDisabledElement();
                                Swal.fire({
                                    text: translate("UpdateInstalledSuccessfully"),
                                    icon: 'success',
                                    confirmButtonText: 'Ок',
                                    allowOutsideClick: true
                                }).then(result => {
                                    document.location.reload();
                                });
                            })
                            .catch(error => {
                                console.error(error);
                                setStartInstall(false);
                                removeClassDisabledElement();
                                Swal.fire({
                                    text: translate("updateError"),
                                    icon: 'error',
                                    confirmButtonText: 'Ок',
                                    allowOutsideClick: true
                                });
                            });
                    }
                } catch {
                    setStartInstall(false);
                    removeClassDisabledElement();
                }
            })
        } else {
            props.startRegister();
        }
    }

    const getData = (query) => {
        return new Promise((resolve, reject) => {
            Promise.all([
                getPortalVersions({
                    language: language,
                    sortField: query.orderBy ? query.orderBy.field : 'id',
                    sortDirection: query.orderDirection ? query.orderDirection : 'desc',
                    start: query.pageSize * query.page,
                    count: query.pageSize,
                    searchKeys: 'version',
                    search: query.search.trim(),
                }),
                getPortalVersions({
                    language: language,
                    aggFunc: 'count',
                    searchKeys: 'version',
                    search: query.search.trim(),
                })
            ]).then(res =>
                resolve({
                    data: res[0],
                    page: query.page,
                    totalCount: +res[1].count
                })
            ).catch((error) => {
                console.log('Error :>> ', error);
                reject(error);
            });
        })
    }
    const handleClose = () => {
        window.history.replaceState("", "", document.location.pathname.replace(/\/update\/(.*)/, "/update"));
        setIsShowModal(false);
    };

    return (
        <>
            <MaterialTable
                tableRef={materialTableRef}
                title={translate('UpdateList')}
                columns={TableSettings.getColumns(translate)}
                data={getData}
                onChangeRowsPerPage={pageSize => {
                    localStorage.updatePageSize = pageSize;
                }}
                actions={TableSettings.getActions(translate, setModalContent, setIsShowModal, installUpdate)}
                options={TableSettings.options}
                localization={TableSettings.getLocale(translate)}
            />
            {startInstall ? <LinearProgress /> : null}
            <Modal show={(isShowModal)} onHide={handleClose}
                animation={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title dangerouslySetInnerHTML={{ __html: modalContent.title }}></Modal.Title>
                </Modal.Header>
                <Modal.Body dangerouslySetInnerHTML={{ __html: modalContent.body }}></Modal.Body>
            </Modal>
        </>
    );
};

export default UpdateTable;