import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ImageUploader from 'react-images-upload';
import { Form, Row } from 'react-bootstrap';
import { useTranslate } from 'react-redux-multilingual';

const SettingsNameLogoTab = ({
  siteName,
  handleChangemetaTag,
  handleChangeSiteName,
  handleChangeHeaderSubtitle,
  handleChangeOldSiteUrl,
  logoUploading,
  headerLogoDefault,
  footerLogoDefault,
  isUploadImageBtnDisabledHeader,
  isUploadImageBtnDisabledFooter,
  metaGoogleSiteVerification,
  onDropLogo,
  currentUser,
  headerSubtitle,
  oldSiteUrl,
  isOldLinkValid,
}) => {
  const translate = useTranslate();
  const onDropHeader = (image) => {
    onDropLogo(image, 'headerLogo');
  };
  const onDropFooter = (image) => {
    onDropLogo(image, 'footerLogo');
  };

  return (
    <Form>
      <Row>
        <div className=" col-sm-12 form-group field field-string">
          <label className="control-label" htmlFor="root_siteName">
            {translate('siteName')}
          </label>
          <div className="form-group field field-string">
            <input
              className="form-control border-radius-1 shadow-none"
              id="root_siteName"
              label="Site name"
              type="text"
              value={siteName || ''}
              onChange={handleChangeSiteName}
              maxLength={100}
            />
          </div>
        </div>

        <div className=" col-sm-12 form-group field field-string">
          <label className="control-label" htmlFor="headerSubtitle">
            {translate('headerSubtitle')}
          </label>
          <div className="form-group field field-string">
            <input
              className="form-control border-radius-1 shadow-none"
              id="headerSubtitle"
              type="text"
              value={headerSubtitle || ''}
              onChange={handleChangeHeaderSubtitle}
              maxLength={150}
            />
          </div>
        </div>

        <div
          className={
            logoUploading === 'headerLogo'
              ? ' opacity06 col-sm-10 form-group field field-string'
              : ' col-sm-10 form-group field field-string'
          }
        >
          <div
            className={
              logoUploading === 'headerLogo'
                ? 'CircularProgress'
                : 'CircularProgress d-none'
            }
          >
            <CircularProgress style={{ color: 'white' }} />
          </div>
          <Form.Label className="control-label" htmlFor="root_footerLogo">
            {translate('headerLogo')}
          </Form.Label>
          <ImageUploader
            withIcon={false}
            withPreview={true}
            withLabel={false}
            singleImage={true}
            buttonText={translate('upload')}
            onChange={onDropHeader}
            imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
            maxFileSize={25 * 1024 * 1024}
            buttonClassName={
              isUploadImageBtnDisabledHeader
                ? 'buttonImageDisabled'
                : 'buttonImage'
            }
            defaultImages={headerLogoDefault}
          />
        </div>

        <div
          className={
            logoUploading === 'footerLogo'
              ? ' opacity06 col-sm-10 form-group field field-string'
              : ' col-sm-10 form-group field field-string'
          }
        >
          <div
            className={
              logoUploading === 'footerLogo'
                ? 'CircularProgress'
                : 'CircularProgress d-none'
            }
          >
            <CircularProgress style={{ color: 'white' }} />
          </div>

          <label className="control-label" htmlFor="root_footerLogo">
            {translate('footerLogo')}
          </label>
          <ImageUploader
            withIcon={false}
            withPreview={true}
            withLabel={false}
            singleImage={true}
            buttonText={translate('upload')}
            onChange={onDropFooter}
            imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
            maxFileSize={25 * 1024 * 1024}
            buttonClassName={
              isUploadImageBtnDisabledFooter
                ? 'buttonImageDisabled'
                : 'buttonImage'
            }
            defaultImages={footerLogoDefault}
          />
        </div>

        <div className=" col-sm-12 form-group field field-string">
          <label className="control-label" htmlFor="oldSiteUrl">
            {translate('oldSiteUrl')}
          </label>
          <div className="form-group field field-string">
            <input
              className="form-control border-radius-1 shadow-none"
              id="oldSiteUrl"
              type="text"
              value={oldSiteUrl || ''}
              onChange={handleChangeOldSiteUrl}
            />
            {!isOldLinkValid && (
              <span className="text-danger">{translate('linkFormat')}</span>
            )}
          </div>
        </div>

        {currentUser.internalrole == 'root_admin' && (
          <div className=" col-sm-12 form-group field field-string">
            <label className="control-label" htmlFor="root_siteName">
              {translate('metaGoogleSiteVerification')}
            </label>
            <div className="form-group field field-string">
              <input
                className="form-control border-radius-1 shadow-none"
                id="root_siteName"
                type="text"
                value={metaGoogleSiteVerification || ''}
                onChange={handleChangemetaTag}
              />
            </div>
          </div>
        )}
      </Row>
    </Form>
  );
};

export default SettingsNameLogoTab;
