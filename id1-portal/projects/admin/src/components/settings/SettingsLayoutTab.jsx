import React from 'react';
import {
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import LayoutPreviewRadio from '../common/LayoutPreviewRadio.jsx';
import SettingsStandartTemplate from '../templates/SettingsStandartTemplates.jsx';
import { useSelector } from 'react-redux';


const SettingsLayoutTab = ({
  translate,
  colorSchemes,
  colorInput,
  setCurrentInputColor,
  handleClickOnAddThemes,
  handleClickOnStandartThemes,
  headerLayout,
  setHeaderLayout,
}) => {
  const locale = useSelector((state) => state.Intl.locale);
 
return (
    <Container fluid>
      <Row>
        <Col >
          <Form className='pr-0 ' >
            <Form.Group >
              <Form.Label className="control-label">
                {translate('designChoose')}
              </Form.Label>
              <Row>
                <Col>
                  <Row className="d-inline-flex">
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      title={'Шаблон-1'}
                      id={'MonochromeLimited'}
                      selected={headerLayout == 'MonochromeLimited'}
                      src={`/public/assets/pictures/layout/layout-monochrome_limited.jpg`}
                      onSelect={setHeaderLayout}
                    />
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      title={'Шаблон-2'}
                      id={'DichromaticAllWidth'}
                      selected={headerLayout == 'DichromaticAllWidth'}
                      src={`/public/assets/pictures/layout/layout-dichromatic_all_width.jpg`}
                      onSelect={setHeaderLayout}
                    />
                    <LayoutPreviewRadio
                      name={'previewRadio'}
                      title={'Шаблон-3'}
                      id={'DichromaticLimited'}
                      selected={headerLayout == 'DichromaticLimited'}
                      src={`/public/assets/pictures/layout/layout-dichromatic_limited.jpg`}
                      onSelect={setHeaderLayout}
                    />
                   </Row>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
            <SettingsStandartTemplate
            colorSchemes={colorSchemes}
            colorInput={colorInput}
            setCurrentInputColor={setCurrentInputColor}
            handleClickOnAddThemes={handleClickOnAddThemes}
            handleClickOnStandartThemes={handleClickOnStandartThemes}
            />
          </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsLayoutTab;
