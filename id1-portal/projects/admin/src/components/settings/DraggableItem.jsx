import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Overlay } from 'react-bootstrap';
import { useTranslate } from 'react-redux-multilingual';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';
import { Button } from '@material-ui/core';

import { UpdatingPopover } from '../ui/UpdatingPopover.jsx';
import actions from '../../redux/actions/interfaceActions';
import { disableScrolling } from '../../services/helpers.js';

const DraggableItem = ({
  title,
  type,
  id,
  checked,
  handleCheck,
  sectionName,
  handleDeleteItem,
  setModal,
}) => {
  const dispatch = useDispatch();
  const deleteButtonRef = useRef();
  const translate = useTranslate();
  const plugins = useSelector(({ reducerPlugins }) => reducerPlugins) || [];
  let isSettingsIcon = false;

  const [isPopoverShown, setIsPopoverShown] = useState(false);

  const tab = plugins.flatMap((p) => p.tabs).find((tab) => type === tab?.type);

  const checkBoxHandler = () => handleCheck(id, sectionName);

  const handleOpenSettings = () => {
    disableScrolling();
    setModal({ type, id });
    dispatch(
      actions.updateMainSettingsModal({
        type,
        id,
        coordX: window.scrollX,
        coordY: window.scrollY,
      })
    );

    if (type === 'linkEditor') {
      document.body.style.width = '100%';
    }
  };

  const handleDelete = () => {
    handleDeleteItem(id);
  };

  if (tab) {
    isSettingsIcon = tab.formTabSettings;
  } else {
    isSettingsIcon =
      type !== 'socialNetworks' && type !== 'popularTags' && type !== 'mailing';
  }

  return (
    <>
      <div className="compositionItem">
        <div className="compositionItem__iconsWrapper compositionItem__listIcon ">
          <ListIcon htmlColor="#7f77a9" />
        </div>
        <p className="compositionItem__title">{title}</p>
        <div className="compositionItem__iconsWrapper">
          <Form.Check id={type} checked={checked} onChange={checkBoxHandler} />
          {isSettingsIcon && (
            <button
              className="compositionItem__settingsBtn"
              type="button"
              onClick={handleOpenSettings}
            >
              <SettingsIcon
                className="compositionItem__settingsIcon"
                htmlColor="#009966"
                fontSize="small"
              />
            </button>
          )}

          <Overlay
            target={deleteButtonRef}
            rootClose
            show={isPopoverShown}
            onHide={() => setIsPopoverShown(false)}
            placement="top"
          >
            <UpdatingPopover id={`popover-delete-confirm`}>
              <p>{translate('areYouSure')}</p>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={handleDelete}
                classes={{
                  root: 'compositionItem__okBtnDeletionConfirm',
                }}
              >
                OK
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsPopoverShown(false)}
              >
                {'cancel'}
              </Button>
            </UpdatingPopover>
          </Overlay>

          <button
            ref={deleteButtonRef}
            className="compositionItem__settingsBtn"
            type="button"
            onClick={() => setIsPopoverShown(true)}
          >
            <DeleteIcon
              className="compositionItem__settingsIcon"
              htmlColor="#ff0102"
              fontSize="small"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default DraggableItem;
