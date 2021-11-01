import React from 'react';
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import InfoIcon from '@material-ui/icons/Info';
import { useTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';
const SettingsStandartTemplate=({
  colorSchemes,
  colorInput,
  setCurrentInputColor,
  handleClickOnAddThemes,
  handleClickOnStandartThemes,
}) => {
  const locale = useSelector((state) => state.Intl.locale);
  const handleSelectColor = async ({ target }, id) => {
    const color = [...colorInput];
    color[id] = target.value;
    setCurrentInputColor(color);
  };
  const translate = useTranslate();
  const onAddColorScheme = () => {
    handleClickOnAddThemes(colorInput);
  };
  return(
    <Form.Group className="pb-2" id="show">
              <Form.Label>{translate('elementsColor')}</Form.Label>
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
  )
}
export default SettingsStandartTemplate;