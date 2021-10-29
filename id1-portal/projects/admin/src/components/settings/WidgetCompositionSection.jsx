import React, { useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Overlay } from 'react-bootstrap';
import { Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RLDD from 'react-list-drag-and-drop/lib/RLDD.js';
import { useTranslate } from 'react-redux-multilingual';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import DraggableItem from './DraggableItem.jsx';
import { UpdatingPopover } from '../ui/UpdatingPopover.jsx';
import actions from '../../redux/actions/interfaceActions.js';
import {
  getMainSettingsModalForm,
  enableScrolling,
} from '../../services/helpers.js';
import {
  addBanner,
  deleteBanner,
  getBannerTypes,
} from '../../services/tab-api.js';
import BannerIcon from '../ui/BannerIcon.jsx';

const WidgetCompositionSection = ({
  type_title,
  banners,
  sectionName,
  setComposition,
  handleChangeCheckDnD,
  setInitialState,
}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const language = useSelector(({ Intl }) => Intl.locale);
  const { isEditorInFullscreen } = useSelector((state) => state.interface);
  const { coordX, coordY } = useSelector(
    (state) => state.interface.mainSettingsModal
  );
  const plugins = useSelector(({ reducerPlugins }) => reducerPlugins) || [];
  const addButtonRef = useRef(null);
  const size = {
    leftBar: 7,
    rightBar: 5,
    bottomBar: 12,
    topBar: 12,
  };

  const [bannersList, setBannersList] = useState([]);
  const [modal, setModal] = useState({ type: null, id: null });
  const [isPopoverShown, setIsPopoverShown] = useState(false);

  const handleRLDDChange = (reorderedItems) => {
    setComposition(reorderedItems, sectionName);
  };

  const handleOpenBannersMenu = async () => {
    try {
      const { data } = await getBannerTypes(sectionName);
      setIsPopoverShown(true);
      setBannersList(data.map(({ title }) => title));
    } catch (error) {
      console.log('Error in getting tabs types :>> ', error);
    }
  };

  const handleDeleteItem = async (Id) => {
    const response = await deleteBanner(Id).catch((error) =>
      console.log('Error while deletting banner :>> ', error)
    );

    if (response.status === 'error') {
      console.log('Error :>> ', response.error_message);
      return;
    }

    const bannersFiltered = banners.filter(({ id }) => id !== Id);

    setComposition(bannersFiltered, sectionName);
    setInitialState();
  };

  const handleAddBanner = async (typeTitle) => {
    try {
      const { data, status, error_message } = await addBanner(
        sectionName,
        typeTitle,
        language
      );

      if (status === 'error') {
        console.log('Error :>> ', error_message);
        return;
      }

      const bannersUpdated = [
        ...banners,
        {
          enabled: false,
          id: data.id,
          type_title: data.type_title,
        },
      ];

      setComposition(bannersUpdated, sectionName);
      setInitialState();
      setIsPopoverShown(false);
    } catch (error) {
      console.log('Error in addBanner:>> ', error);
    }
  };

  const closeModal = () => {
    dispatch(
      actions.updateMainSettingsModal({ type: null, id: null, coordX, coordY })
    );
    setModal({ type: null, id: null });
    enableScrolling();

    if (modal.type === 'linkEditor') {
      document.body.style.width = '';
    }
  };

  return (
    <>
      <Col className="mb-3" xs={12} xl={size[sectionName]}>
        <Accordion
          defaultExpanded
          square
          className="compositionSection__container"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p>{translate(type_title)}</p>
          </AccordionSummary>
          <AccordionDetails>
            <RLDD
              cssClasses="compositionSection__listContainer"
              items={banners}
              itemRenderer={(item) => (
                <DraggableItem
                  title={translate(item.type_title)}
                  sectionName={sectionName}
                  type={item.type_title}
                  id={item.id}
                  checked={item.enabled}
                  handleCheck={handleChangeCheckDnD}
                  handleDeleteItem={handleDeleteItem}
                  setModal={setModal}
                />
              )}
              onChange={handleRLDDChange}
            />
          </AccordionDetails>
          <div className="compositionSection__addButtonContainer">
            <Overlay
              target={addButtonRef}
              rootClose
              show={isPopoverShown}
              onHide={() => setIsPopoverShown(false)}
              placement="top"
            >
              <UpdatingPopover id={`popover-positioned-${sectionName}`}>
                <ul className="compositionSection__popoverList">
                  {bannersList.map((banner) => (
                    <li
                      key={banner}
                      className="compositionSection__popoverItem"
                    >
                      <Button
                        classes={{
                          label: 'compositionSection__popoverButton',
                        }}
                        onClick={() => handleAddBanner(banner)}
                      >
                        <BannerIcon
                          bannerType={banner}
                          classes={{
                            root: 'compositionSection__popoverIcon',
                          }}
                        />
                        {translate(banner)}
                      </Button>
                    </li>
                  ))}
                </ul>
              </UpdatingPopover>
            </Overlay>
            <Button
              className="compositionSection__addButton"
              ref={addButtonRef}
              onClick={handleOpenBannersMenu}
            >
              <AddCircleIcon />
            </Button>
          </div>
        </Accordion>
      </Col>

      <Modal
        open={!!modal.type}
        onClose={closeModal}
        style={{ zIndex: modal.type === 'sliderLinks' && 100 }}
        disableEnforceFocus={modal.type === 'linkEditor' ? true : false}
      >
        <div
          className={`widgetCompositionSettings__modal ${
            !isEditorInFullscreen &&
            'widgetCompositionSettings__modal-transform'
          }`}
          style={{ width: modal.type !== 'linkEditor' && '50%' }}
        >
          <div className="col-lg">
            <div className="pageElementBox collapsed border-bottom">
              <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-between pr-4">
                <h5>{translate(modal.type || '')}</h5>
                <button
                  type="button"
                  onClick={closeModal}
                  className="sliderSettings__closeModalCross"
                >
                  <CloseIcon />
                </button>
              </div>
              <div
                className="pageElementBoxContent"
                style={{ display: 'block' }}
              >
                {getMainSettingsModalForm(
                  {
                    type: modal.type,
                    id: modal.id,
                    closeModal,
                  },
                  modal.type,
                  plugins
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WidgetCompositionSection;
