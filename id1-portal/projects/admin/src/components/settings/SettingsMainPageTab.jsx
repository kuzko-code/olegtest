import React from 'react';
import {
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

import WidgetCompositionSection from './WidgetCompositionSection.jsx';
import { bannersSecttionNames } from '../../constants/index.js';

const SettingsMainPageTab = ({
  translate,
  locationOfBanners,
  handleChangeWidgetComposition,
  handleChangeCheckDnD,
  setInitialState,
}) => {
  const locale = useSelector((state) => state.Intl.locale);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label className="control-label">
                {translate('mainPageSettings')}
              </Form.Label>
            </Form.Group>
            <Form.Group>
                <Form.Label className="control-label">
                {translate('mainPageInfo')}
              </Form.Label>
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

export default SettingsMainPageTab;
