import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { deleteEditorImages } from '../../services/index.js';
import { delFile } from '../../services/file-api-services.js';
import HtmlEditor from '../common/HtmlEditor.jsx';
import { parseEditorImagesHeightDelete } from '../../services/helpers.js';
import { getBannerById, putBanner } from '../../services/tab-api.js';
import { translateUiSchema } from '../../helpers/jsonschema-helpers.js';

class LinksEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      editorValue: '',
      uploadedEditorImages: [],
      initialTitle: '',
      initialContent: '',
      isEditorAvailable: null,
      addedListImg: [],
      placeholder: '',
    };
  }

  componentWillUnmount() {
    this.state.uploadedEditorImages.forEach((file) => {
      if (!file.isSaved) {
        delFile(file.id);
      }
    });
  }

  componentDidMount = () => {
    getBannerById(this.props.id)
      .then(({ data, status, error_message }) => {
        if (status === 'ok') {
          const content = data.form_data?.content || '';

          this.setState({
            isEditorAvailable: true,
            editorValue: content,
            initialContent: content,
            title: data.form_data?.title || '',
            initialTitle: data.form_data?.title || '',
            placeholder: translateUiSchema(data.ui_schema, this.props.translate)
              .title['ui:placeholder'],
          });
        } else {
          console.log('Error in LinksEditor:>> ', error_message);
          this.setState({ isEditorAvailable: false });
        }
      })
      .catch((error) => console.log('Error in LinksEditor:>> ', error));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { title, editorValue, uploadedEditorImages } = this.state;
    let formData = {
      id: this.props.id,
      form_data: { title, content: parseEditorImagesHeightDelete(editorValue) },
    };
    putBanner(JSON.stringify(formData))
      .then((res) => {
        if (res.status != 'ok') {
          toast.error(
            this.props.translate('errorOccurredWhileSavingLinkEditor')
          );
          return;
        }

        toast.success(this.props.translate('changesSavedSuccessfully'));
        const updatedImages = deleteEditorImages(
          editorValue,
          uploadedEditorImages
        );
        this.setState({
          initialTitle: title,
          initialContent: editorValue,
          uploadedEditorImages: updatedImages,
        });
      })
      .catch((error) => console.log('Error :>> ', error))
      .finally(() => this.props.closeModal());
  };

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  setEditorValue = (content) => {
    this.setState({ editorValue: content });
  };

  setUploadedEditorImages = (images) => {
    this.setState((state) => {
      return {
        uploadedEditorImages: [
          ...state.uploadedEditorImages,
          ...(Array.isArray(images) ? images : [images]),
        ],
      };
    });
  };

  render() {
    const { translate } = this.props;
    let {
      title,
      isEditorAvailable,
      initialContent,
      initialTitle,
      editorValue,
      placeholder,
    } = this.state;

    return (
      <form className="linksEditor__form" onSubmit={this.onSubmit}>
        {isEditorAvailable ? (
          <>
            <label className="control-label" htmlFor="bannerTitle">
              {translate('linkBannerTitle')}
            </label>
            <div className="form-group field field-string">
              <input
                className="form-control border-radius-1 shadow-none"
                id="bannerTitle"
                placeholder={placeholder}
                type="text"
                value={title}
                onChange={this.handleChangeTitle}
              />
            </div>
            <div className="htmlEditorWrapper">
              <HtmlEditor
                editorValue={this.state.editorValue}
                setEditorValue={this.setEditorValue}
                setUploadedImages={this.setUploadedEditorImages}
                parent="linksEditor"
              />
            </div>
            <footer className="linkEditorFooter">
              <button
                type="submit"
                className="btn btn-mint-green btn-sm mr-3"
                disabled={
                  !(editorValue !== initialContent || title !== initialTitle)
                }
              >
                {translate('save')}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm btnModalAddClose"
                onClick={this.props.closeModal}
              >
                {translate('close')}
              </button>
            </footer>
          </>
        ) : (
          <h5>{translate('linksEditorUnaviable')}</h5>
        )}
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
  };
};

export default connect(mapStateToProps)(withTranslate(LinksEditor));
