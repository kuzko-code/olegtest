import React from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import InfoIcon from '@material-ui/icons/Info';
import LayoutPreviewRadio from '../common/LayoutPreviewRadio.jsx';
import { useSelector } from 'react-redux';

import WidgetCompositionSection from './WidgetCompositionSection.jsx';
import { bannersSecttionNames } from '../../constants/index.js';

const SettingsLayoutTab = ({
  translate,
  colorSchemes,
  colorInput,
  setCurrentInputColor,
  handleClickOnAddThemes,
  handleClickOnStandartThemes,
  headerLayout,
  setHeaderLayout,
  locationOfBanners,
  handleChangeWidgetComposition,
  handleChangeCheckDnD,
  setInitialState,
}) => {
  const locale = useSelector((state) => state.Intl.locale);
  const handleSelectColor = async ({ target }, id) => {
    const color = [...colorInput];
    color[id] = target.value;
    setCurrentInputColor(color);
  };

  const onAddColorScheme = () => {
    handleClickOnAddThemes(colorInput);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label className="control-label">
                {translate('headerLayoutScheme')}
              </Form.Label>
              <Row>
                <Col>
                  <Row className="d-inline-flex">
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      id={'MonochromeLimited'}
                      selected={headerLayout == 'MonochromeLimited'}
                      src={
                        locale == 'ua'
                          ? `../../../public/assets/pictures/layout/layout-monochrome_limited-ua.jpg`
                          : `../../../public/assets/pictures/layout/layout-monochrome_limited-en.png`
                      }
                      onSelect={setHeaderLayout}
                    />
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      id={'DichromaticAllWidth'}
                      selected={headerLayout == 'DichromaticAllWidth'}
                      src={
                        locale == 'ua'
                          ? `../../../public/assets/pictures/layout/layout-dichromatic_all_width-ua.jpg`
                          : `../../../public/assets/pictures/layout/layout-dichromatic_all_width-en.png`
                      }
                      onSelect={setHeaderLayout}
                    />
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      id={'DichromaticLimited'}
                      selected={headerLayout == 'DichromaticLimited'}
                      src={
                        locale == 'ua'
                          ? `../../../public/assets/pictures/layout/layout-dichromatic_limited-ua.jpg`
                          : `../../../public/assets/pictures/layout/layout-dichromatic_limited-en.png`
                      }
                      onSelect={setHeaderLayout}
                    />
                  </Row>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="pb-2">
              <Form.Label>{translate('colorScheme')}</Form.Label>
              <Form.Row>
                <div className="dropdown">
                  <Button className="btn-mint-green" size="sm">
                    {translate('selectStandartThemeBtn')}
                  </Button>
                  <div
                    onClick={handleClickOnStandartThemes}
                    className="dropdown-content"
                  >
                    {colorSchemes.map((schema) => (
                      <div
                        key={schema.id}
                        data-index={schema.id}
                        className="themes-item"
                        style={{ justifyContent: 'flex-start' }}
                      >
                        {schema.color_scheme.map((themeColor) => (
                          <div
                            key={themeColor}
                            style={{ backgroundColor: themeColor }}
                            className="color-box"
                          ></div>
                        ))}
                        {schema.custom_color_scheme && (
                          <a className="delete" style={{ cursor: 'pointer' }}>
                            x
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Form.Row>
              <Form.Row style={{ marginBottom: 20 }}>
                <Col>
                  <Row>
                    <label
                      className="col-sm-2 control-label"
                      htmlFor="light-color"
                    >
                      {translate('siteColor')}
                    </label>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>{translate('colorPickerTooltip1')}</Tooltip>
                      }
                    >
                      <InfoIcon fontSize="small" style={{ marginRight: 10 }} />
                    </OverlayTrigger>
                    <input
                      className="col-sm-2 form-control"
                      id="light-color"
                      value={colorInput[1]}
                      type="color"
                      onChange={(e) => handleSelectColor(e, 1)}
                    ></input>
                  </Row>
                  <Row>
                    <label
                      className="col-sm-2 control-label"
                      htmlFor="main-color"
                    >
                      {translate('headerGradient')}
                    </label>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>{translate('colorPickerTooltip2')}</Tooltip>
                      }
                    >
                      <InfoIcon fontSize="small" style={{ marginRight: 10 }} />
                    </OverlayTrigger>
                    <input
                      className="col-sm-2 form-control"
                      id="main-color"
                      value={colorInput[2]}
                      type="color"
                      onChange={(e) => handleSelectColor(e, 2)}
                    ></input>
                  </Row>
                  <Row>
                    <label
                      className="col-sm-2 control-label"
                      htmlFor="dark-color"
                    >
                      {translate('navItemColor')}
                    </label>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>{translate('colorPickerTooltip3')}</Tooltip>
                      }
                    >
                      <InfoIcon fontSize="small" style={{ marginRight: 10 }} />
                    </OverlayTrigger>
                    <input
                      className="col-sm-2 form-control"
                      id="dark-color"
                      value={colorInput[0]}
                      type="color"
                      onChange={(e) => handleSelectColor(e, 0)}
                    ></input>
                  </Row>
                </Col>
              </Form.Row>
              <button
                onClick={onAddColorScheme}
                type="button"
                className="btn btn-mint-green btn-sm"
                disabled={JSON.stringify(colorSchemes).includes(
                  JSON.stringify(colorInput)
                )}
              >
                {translate('addStandartTheme')}
              </button>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                {translate('widgetCompositionSectionTitle')}
              </Form.Label>
              <section className="widgetCompositionSettings__container pt-2">
                {bannersSecttionNames.map((item) => (
                  <WidgetCompositionSection
                    key={item}
                    type_title={item}
                    banners={locationOfBanners[item] || []}
                    sectionName={item}
                    setComposition={handleChangeWidgetComposition}
                    handleChangeCheckDnD={handleChangeCheckDnD}
                    setInitialState={setInitialState}
                  />
                ))}
              </section>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsLayoutTab;
