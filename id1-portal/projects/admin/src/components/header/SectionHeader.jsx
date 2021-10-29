import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import { green } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslate } from 'react-redux-multilingual/lib/context';
import { ConditionalWrapper } from '../../services/helpers.js';
import Sticky from 'react-sticky-el';
import { useSelector } from 'react-redux';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: '#1ab394',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const SectionHeader = ({
  isSticky = false,
  isCheckboxShown = false,
  isCancelSubmitShown = false,
  isCancelShown = true,
  isSubmitShown = true,
  title = '',
  handleSubmit = null,
  handlePreview = null,
  buttonTooltip = null,
  description = null,
  submitDisable = false,
  checkboxChecked = false,
  isCheckboxDisabled = false,
  onCheckboxChange,
  linkTo,
}) => {
  const translate = useTranslate();
  const history = useHistory();
  const { isEditorInFullscreen, mainSettingsModal } = useSelector(
    ({ interface: i }) => i
  );
  const isHidden = isEditorInFullscreen || mainSettingsModal.type;

  const onCancel = () => {
    history.push(linkTo);
  };

  return (
    <ConditionalWrapper
      condition={!isHidden && isSticky}
      wrapper={(children) => (
        <Sticky stickyStyle={{ zIndex: 1 }}>{children}</Sticky>
      )}
    >
      <div className="Row border-bottom bg-white">
        <Col xs={isCheckboxShown ? 11 : 10} className="px-5">
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <h2
              style={{
                marginTop: 18,
                marginBottom: 18,
              }}
            >
              {title}
            </h2>
            <div>
              {isCheckboxShown && (
                <FormControlLabel
                  className="m-0"
                  disabled={isCheckboxDisabled}
                  control={
                    <GreenCheckbox
                      checked={checkboxChecked}
                      onChange={onCheckboxChange}
                      value="checked"
                    />
                  }
                  labelPlacement="start"
                  label={translate('publish')}
                />
              )}
              {isCancelSubmitShown && (
                <span className="group-button">
                  {isCancelShown && (
                    <button
                      type="button"
                      className="btn btn-light border button-right"
                      onClick={onCancel}
                    >
                      {translate('cancel')}
                    </button>
                  )}
                  {isSubmitShown && (
                    <button
                      type="button"
                      className="btn btn-mint-green"
                      disabled={submitDisable}
                      onClick={handleSubmit}
                    >
                      {translate('save')}
                    </button>
                  )}
                </span>
              )}
              {handlePreview && !isCancelSubmitShown && (
                <>
                  <OverlayTrigger overlay={<Tooltip>{buttonTooltip}</Tooltip>}>
                    <Button
                      style={{
                        marginRight: 10,
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                      }}
                    >
                      <DesktopMacIcon
                        fontSize="small"
                        style={{ color: '#858585' }}
                        onClick={handlePreview}
                      />
                    </Button>
                  </OverlayTrigger>
                  <Button
                    style={{ backgroundColor: '#1d84c6' }}
                    onClick={handleSubmit}
                    disabled={submitDisable}
                  >
                    {translate('publish')}
                  </Button>
                </>
              )}
            </div>
          </Row>
        </Col>
        {description !== null && (
          <Col xs={10} className="px-5">
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {description}
            </Row>
          </Col>
        )}
      </div>
    </ConditionalWrapper>
  );
};

export default SectionHeader;
