import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withTranslate } from 'react-redux-multilingual';
import { Tab, Tabs } from 'react-bootstrap';
import { REGULAR_EXPRESSIONS } from '../../../config/index.jsx';
import NotFound from '../../pages/error/404.jsx';
import {
  addColorScheme,
  getColorSchemes,
  deleteColorScheme,
  updateSettings,
  getSettings,
  putBanners,
} from '../../services/index.js';
import { postFile, delFile } from '../../services/file-api-services.js';
import { getFileId } from '../../helpers/file-helpers.js';
import SectionHeader from '../header/SectionHeader.jsx';
import SettingsNameLogoTab from './SettingsNameLogoTab.jsx';
import SettingsLayoutTab from './SettingsLayoutTab.jsx';
import TabPanel from './TabPanel.jsx';
import { Contacts } from './contacts.jsx';
import '../../../public/assets/css/newslist.css';
import '../../../public/assets/css/mainsettings.css';
import { Modal } from '@material-ui/core';
import { filterProps } from '../../services/helpers.js';
import { linkRegexp } from '../../constants/index.js';
import { getBannersSettings } from '../../services/tab-api.js';

export class MainSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: '',
      headerSubtitle: '',
      headerLogoDefault: [],
      footerLogoDefault: [],
      headerLogo: { url: '', isSaved: null, id: null },
      footerLogo: { url: '', isSaved: null, id: null },
      images: [],
      logoUploading: false,
      oldSiteUrl: '',
      metaGoogleSiteVerification: null,
      headerLayout: 'MonochromeLimited',
      colorSchemes: [],
      currentInputColor: ['#000000', '#000000', '#000000'],
      locationOfBanners: [],
      contacts: {
        schema: {},
        formData: { socialMedia: {} },
      },
      initialState: '',
      loading: true,
      error: false,
      currentTab: 0,
      isModalPreviewShown: false,
      isOldLinkValid: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  componentDidMount = async () => {
    (async () => {
      try {
        const [settingsData, bannersData] = await Promise.all([
          getSettings(
            'layout,siteLogos,metaGoogleSiteVerification,contacts',
            this.props.language
          ),
          getBannersSettings(this.props.language),
        ]);

        const response = settingsData.data.reduce(
          (acc, item) => ({ ...acc, [item.title]: item }),
          {}
        );
        const { layout, siteLogos, contacts, metaGoogleSiteVerification } =
          response;

        const responseThemes = await getColorSchemes();
        const initialState = {
          siteName: layout.settings_object.siteName,
          headerSubtitle: layout.settings_object.descriptionForSite,
          headerLogo: {
            url: siteLogos.settings_object.headerLogo,
            id: getFileId(siteLogos.settings_object.headerLogo),
            isSaved: true,
          },
          footerLogo: {
            url: siteLogos.settings_object.footerLogo,
            id: getFileId(siteLogos.settings_object.footerLogo),
            isSaved: true,
          },
          oldSiteUrl: layout.settings_object.siteOldVersion,
          metaGoogleSiteVerification:
            metaGoogleSiteVerification.settings_object
              .metaGoogleSiteVerification,
          headerLayout: layout.settings_object.header,
          colorSchemes: responseThemes,
          currentInputColor: layout.settings_object.selectedColorTheme || [
            '#000000',
            '#000000',
            '#000000',
          ],
          locationOfBanners: bannersData.data,
          contacts: {
            schema: contacts.settings_schema,
            formData: contacts.settings_object,
          },
        };

        this.setState({
          ...initialState,
          initialState: JSON.stringify(initialState),
          headerLogoDefault: [siteLogos.settings_object.headerLogo],
          footerLogoDefault: [siteLogos.settings_object.footerLogo],
          loading: false,
          error: null,
        });
      } catch (error) {
        this.onError();
        console.log('error :>> ', error);
      }
    })();
  };

  componentWillUnmount() {
    const images = [
      ...this.state.images,
      this.state.headerLogo,
      this.state.footerLogo,
    ];
    images
      .filter((image) => image.id)
      .forEach((image) => {
        if (!image.isSaved) {
          delFile(image.id);
        }
      });
  }

  validateSiteName = () => {
    if (!this.state.siteName || this.state.siteName?.length < 3) {
      toast.error(this.props.translate('minLengthSiteName'));
      return;
    }
  };

  validateSiteLink = () => {
    if (this.state.oldSiteUrl && !this.state.oldSiteUrl.match(linkRegexp)) {
      this.setState({
        isOldLinkValid: false,
      });

      return false;
    } else {
      this.setState({
        isOldLinkValid: true,
      });

      return true;
    }
  };

  async handleSubmit(event) {
    event.preventDefault();

    const metaGoogleSiteVerification = this.state.metaGoogleSiteVerification
      ? this.state.metaGoogleSiteVerification.trim()
      : '';

    if (
      metaGoogleSiteVerification &&
      metaGoogleSiteVerification.search(REGULAR_EXPRESSIONS.HTMLTag) === -1
    ) {
      toast.error(
        this.props.translate('erorValidateMetaGoogleSiteVerification')
      );
      return;
    }
    this.validateSiteName();

    if (!this.validateSiteLink()) {
      toast.error(this.props.translate('formValidationError'));
      return;
    }

    this.setState((state) => ({
      headerLogo: { ...state.headerLogo, isSaved: true },
      footerLogo: { ...state.footerLogo, isSaved: true },
      images: [...state.images.map((image) => ({ ...image, isSaved: false }))],
    }));

    const form_data = JSON.parse(JSON.stringify(this.state.locationOfBanners));
    for (const key in form_data) {
      form_data[key] = form_data[key].map((item) => ({
        id: item.id,
        enabled: item.enabled,
      }));
    }

    const banners = {
      form_data,
      language: this.props.language,
    };

    try {
      const [resSettings, resBanners] = await Promise.all([
        updateSettings(this.createData(this.props.language, true)),
        putBanners(JSON.stringify(banners)),
      ]);

      if (resSettings.status !== 'ok' || resBanners.status !== 'ok') {
        if (resSettings.error_message) {
          throw resSettings.error_message;
        }

        if (resBanners.error_message) {
          throw resBanners.error_message;
        }
      }

      const initialState = filterProps(this.state);
      this.setState({ initialState: JSON.stringify(initialState) });
      toast.success(this.props.translate('changesSavedSuccessfully'));
    } catch (error) {
      toast.error(this.props.translate('errorOccurredWhileSavingTheSettings'));
      console.log('Error on settings submit:>> ', error);
    }
  }

  createData = (language, includeGoogleSiteVerification, isPreview = false) => {
    const data = {
      settings: [
        {
          title: isPreview ? 'layoutOfPreview' : 'layout',
          settings_object: {
            selectedColorTheme: this.state.currentInputColor,
            header: this.state.headerLayout,
            siteName: this.state.siteName?.trim(),
            siteOldVersion: this.state.oldSiteUrl,
            descriptionForSite: this.state.headerSubtitle?.trim(),
          },
        },
        {
          title: isPreview ? 'siteLogosOfPreview' : 'siteLogos',
          settings_object: {
            headerLogo: this.state.headerLogo.url,
            footerLogo: this.state.footerLogo.url,
          },
        },
      ],
      language,
    };

    if (isPreview) {
      data.settings.push({
        title: 'locationPreviewOfBanners',
        settings_object: this.state.locationOfBanners,
      });
    }

    if (!isPreview) {
      data.settings.push({
        title: 'contacts',
        settings_object: this.state.contacts.formData,
      });
    }

    if (
      this.props.currentUser.internalrole == 'root_admin' &&
      includeGoogleSiteVerification
    ) {
      data.settings.push({
        title: 'metaGoogleSiteVerification',
        settings_object: {
          metaGoogleSiteVerification: this.state.metaGoogleSiteVerification,
        },
      });
    }

    return JSON.stringify(data);
  };

  onDropLogo = async (picturesUpload, section) => {
    if (picturesUpload.length > 0) {
      this.setState({ logoUploading: section });
      let imageNameParts = picturesUpload[0].name.split('.');
      let name = `${imageNameParts[0].substring(0, 90)}.${
        imageNameParts[imageNameParts.length - 1]
      }`;
      const res = await postFile(picturesUpload[0], name);
      this.setState({
        logoUploading: false,
        [section]: {
          url: res.data.source_url,
          isSaved: false,
          id: getFileId(res.data.source_url),
        },
      });
    } else {
      this.setState((state) => {
        return {
          images: [...state.images, state[section]],
          [section]: {
            url: '',
            isSaved: null,
            id: null,
          },
        };
      });
    }
  };

  handleClickOnAddThemes = async (newColorScheme) => {
    try {
      const response = await addColorScheme(newColorScheme);
      response.status === 'ok' &&
        this.setState((state) => ({
          colorSchemes: [
            ...state.colorSchemes,
            {
              color_scheme: newColorScheme,
              custom_color_scheme: true,
              id: response.data.id,
            },
          ],
        }));
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  handleClickOnStandartThemes = async (event) => {
    try {
      const item = event.target.closest('.themes-item');
      if (!item) return;
      const index = +item.dataset.index;

      if (event.target.classList.contains('delete')) {
        const response = await deleteColorScheme(index);
        if (response.status === 'ok') {
          const filtered = this.state.colorSchemes.filter(
            (item) => item.id !== index
          );
          this.setState({ colorSchemes: filtered });
        }
        return;
      }

      if (item.classList.contains('themes-item')) {
        const elem = this.state.colorSchemes.find((item) => item.id === index);
        this.setState({
          currentInputColor: elem.color_scheme,
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  handleChangeSiteName = ({ target }) => {
    if (target.value.length > 100) {
      toast.error(this.props.translate('siteNameMaxLengthAlert'));
      return;
    }

    this.setState({
      siteName: target.value,
    });
  };

  handleChangeHeaderSubtitle = ({ target }) => {
    if (target.value.length > 150) {
      toast.error(this.props.translate('subtitleMaxLengthAlert'));
      return;
    }

    this.setState({
      headerSubtitle: target.value,
    });
  };

  handleChangeOldSiteUrl = ({ target }) => {
    this.setState({
      oldSiteUrl: target.value,
    });
  };

  handleChangemetaTag = (event) => {
    this.setState({
      metaGoogleSiteVerification:
        event.target.value === ' '
          ? event.target.value.trimStart()
          : event.target.value,
    });
  };

  setHeaderLayout = ({ target }) => this.setState({ headerLayout: target.id });

  setCurrentInputColor = (color) => {
    this.setState({ currentInputColor: color });
  };

  setContacts = (data) => {
    this.setState((state) => ({
      contacts: {
        ...state.contacts,
        formData: data.formData,
      },
    }));
  };

  setInitialState = () => {
    this.setState((state) => {
      const initialState = JSON.parse(state.initialState);
      initialState.locationOfBanners = state.locationOfBanners;
      return {
        initialState: JSON.stringify(initialState),
      };
    });
  };

  ArrayFieldTemplate(props) {
    return (
      <div>
        {props.items.map((element) => element)}
        {props.canAdd && (
          <button type="button" onClick={props.onAddClick}></button>
        )}
      </div>
    );
  }

  checkIfChanged = () => {
    const currentState = filterProps(this.state);
    return this.state.initialState === JSON.stringify(currentState);
  };

  handleTabChange = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  handleChangeWidgetComposition = (banners, key) => {
    const newLayout = { ...this.state.locationOfBanners, [key]: banners };
    this.setState({
      locationOfBanners: newLayout,
    });
  };

  handleChangeCheckDnD = (id, sectionName) => {
    const createNewSettings = (state) => {
      const newSettings = state.locationOfBanners[sectionName].map((item) => {
        if (item.id === id) {
          return { ...item, enabled: (item.enabled = !item.enabled) };
        }

        return item;
      });
      return newSettings;
    };

    this.setState((state) => ({
      ...state,
      locationOfBanners: {
        ...state.locationOfBanners,
        [sectionName]: createNewSettings(state),
      },
    }));
  };

  handlePreview = async () => {
    event.preventDefault();
    this.validateSiteName();
    try {
      const response = await updateSettings(this.createData(null, false, true));
      if (response.status === 'ok') {
        this.setState({ isModalPreviewShown: true });
      }
    } catch (error) {
      toast.error(this.props.translate('errorOccurredWhileSavingTheSettings'));
      console.log('error :>> ', error);
    }
  };

  onClosePreview = () => {
    this.setState({ isModalPreviewShown: false });
  };

  render() {
    const { loading, error, metaGoogleSiteVerification, isModalPreviewShown } =
      this.state;

    const hasData = !(loading || error);
    const errorMessage = error ? <NotFound /> : null;

    return (
      <div className="custom-dialog">
        <SectionHeader
          isSticky={true}
          title={this.props.translate('mainSettings')}
          buttonTooltip={this.props.translate('preview')}
          handlePreview={this.handlePreview}
          handleSubmit={this.handleSubmit}
          submitDisable={this.checkIfChanged()}
        />
        <div className="Row my-3">
          <div className="col-sm-10">
            <Tabs
              activeKey={this.state.currentTab}
              onSelect={this.handleTabChange}
              className="tabTitle"
            >
              <Tab title={this.props.translate('layoutTab')} eventKey={0} />
              <Tab
                title={this.props.translate('nameAndLogoTab')}
                eventKey={1}
              />
              <Tab title={this.props.translate('contacts')} eventKey={2} />
            </Tabs>
            <TabPanel
              index={0}
              currentTab={this.state.currentTab}
              hasData={hasData}
            >
              <SettingsLayoutTab
                translate={this.props.translate}
                colorSchemes={this.state.colorSchemes}
                handleClickOnStandartThemes={this.handleClickOnStandartThemes}
                handleClickOnAddThemes={this.handleClickOnAddThemes}
                colorInput={this.state.currentInputColor}
                setCurrentInputColor={this.setCurrentInputColor}
                headerLayout={this.state.headerLayout}
                setHeaderLayout={this.setHeaderLayout}
                locationOfBanners={this.state.locationOfBanners}
                handleChangeWidgetComposition={
                  this.handleChangeWidgetComposition
                }
                handleChangeCheckDnD={this.handleChangeCheckDnD}
                setInitialState={this.setInitialState}
              />
            </TabPanel>

            <TabPanel
              index={1}
              currentTab={this.state.currentTab}
              hasData={hasData}
            >
              <SettingsNameLogoTab
                siteName={this.state.siteName}
                handleChangeSiteName={this.handleChangeSiteName}
                logoUploading={this.state.logoUploading}
                headerLogoDefault={this.state.headerLogoDefault}
                footerLogoDefault={this.state.footerLogoDefault}
                isUploadImageBtnDisabledHeader={!!this.state.headerLogo.url}
                isUploadImageBtnDisabledFooter={!!this.state.footerLogo.url}
                metaGoogleSiteVerification={metaGoogleSiteVerification}
                onDropLogo={this.onDropLogo}
                handleChangemetaTag={this.handleChangemetaTag}
                currentUser={this.props.currentUser}
                headerSubtitle={this.state.headerSubtitle}
                oldSiteUrl={this.state.oldSiteUrl}
                handleChangeHeaderSubtitle={this.handleChangeHeaderSubtitle}
                handleChangeOldSiteUrl={this.handleChangeOldSiteUrl}
                isOldLinkValid={this.state.isOldLinkValid}
              />
            </TabPanel>

            <TabPanel
              index={2}
              currentTab={this.state.currentTab}
              hasData={hasData}
            >
              <Contacts
                translate={this.props.translate}
                language={this.props.language}
                contacts={this.state.contacts}
                setContacts={this.setContacts}
              />
            </TabPanel>
            {errorMessage}
          </div>
        </div>

        <Modal open={isModalPreviewShown} onClose={this.onClosePreview}>
          <iframe
            style={{
              width: '85%',
              height: '85%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            src={process.env.PUBLIC_HOST + `/${this.props.language}/preview`}
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    currentUser: state.currentUser,
  };
};

export default connect(mapStateToProps)(withTranslate(MainSettings));
