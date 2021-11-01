import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Dropzone from 'react-dropzone';
import CircularProgress from '@material-ui/core/CircularProgress';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
import NotFound from '../../pages/error/404.jsx';
import FileView from '../common/fileView.jsx';
//helpers
import { getFileId, getFileName } from '../../helpers/file-helpers.js';
//services
import { delFile, postFile, delDocument, postDocument, updateDocument } from '../../services/file-api-services.js';
import { getNewsById, putNews, postNews } from '../../services/news-api-services.js';
import { getRubrics } from '../../services/rubric-api-services.js';
import { getTags } from '../../services/tag-api-services.js';
import { deleteEditorImages } from '../../services/index.js';
import SectionHeader from '../header/SectionHeader.jsx';
import '../../../public/assets/css/newsform.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { dataURLtoFile, parseEditorImagesHeightDelete } from '../../services/helpers.js';
import DateTimePicker from '../common/DateTimePicker.jsx';
import Cropper from 'react-cropper';
import { Modal, Form } from 'react-bootstrap';
import HtmlEditor from '../common/HtmlEditor.jsx';
import 'cropperjs/dist/cropper.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import InfoIcon from '@material-ui/icons/Info';
import CreatableInputOnly from '../common/CreatableInputOnly.jsx';
const ASPECT_RATIO = 4 / 3;

const customStyles = {
  option: (provided, state) => ({ ...provided }),
  control: (provided, state) => ({
    ...provided,
    // This line disable the blue border
    '&:hover': { borderColor: '#1ab394' }, // border style on hover
    border: '1px solid lightgray', // default border color
    boxShadow: 'none', // no box-shadow
    // width: '33%',
  }),
};

export class NewsForm extends Component {
  constructor(props) {
    super(props);
    this.cropperRef = React.createRef();
    this.state = {
      methodForModal: null,
      newFile: {
        id: null,
        name: null,
        extention: null,
        data: null,
        tags: [],
      },
      showEditFileModal: false,
      toastId: null,
      filess: [],
      editedFiles: [],
      filesToDelete: [],
      pictures: null,
      picturesUrl: null,
      picturesUrlDelete: null,
      disabled: false,
      display: false,
      title: '',
      smallText: '',
      facebook_enable: true,
      checked: true,
      isCheckboxDisabled: false,
      rubrics: [],
      tags: [],
      rubric: {},
      tag: [],
      editorValue: '',
      uploadedEditorImages: [],
      redirect: false,
      save: false,
      displayFile: false,
      loading: true,
      error: false,
      displayGalleryFiles: false,
      galleryFiless: [],
      galleryFilesToDelete: [],
      autoPublishDate: '',
      _selectedDate: new Date(),
      initialState: '',
      cropper: {
        isActive: false,
        image: null,
        name: null,
      },
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    this.loadingnData();
  }

  componentWillUnmount() {
    this.state.uploadedEditorImages.forEach((file) => {
      if (!file.isSaved) {
        delFile(file.id);
      }
    });

    this.state.filess.forEach((file) => {
      if (!file.isSaved) {
        delDocument(file.id);
      }
    });

    this.state.galleryFiless.forEach((file) => {
      if (!file.isSaved) {
        delFile(file.id);
      }
    });

    if (this.state.save === false) {
      if (this.state.pictures) {
        delFile(getFileId(this.state.pictures));
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params != prevProps.match.params) {
      this.loadingnData();
    }

    if (prevState.autoPublishDate !== this.state.autoPublishDate) {
      if (new Date() < new Date(this.state.autoPublishDate)) {
        this.setState({ isCheckboxDisabled: true, checked: false });
      } else {
        this.setState({ isCheckboxDisabled: false });
      }
    }
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  loadingnData = () => {
    const { language, translate } = this.props;

    let rubrics = [{ value: null, label: translate('withoutRubrics') }];
    let tags = [];

    Promise.all([getRubrics(language), getTags(language)])
      .then((resonses) => {
        resonses[0].data.map((datas) =>
          rubrics.push({
            value: datas.id.toString(),
            label: datas.title.toString(),
          })
        );
        rubrics.sort(function (a, b) { return b.value - a.value });
        resonses[1].data.map((datas) =>
          tags.push({
            value: datas.title.toString(),
            label: datas.title.toString(),
          })
        );

        if (this.props.match.params.id != 0) {
          let myArrayFilteredTag = null;
          let rubric = null;

          getNewsById(this.props.match.params.id).then((res) => {
            let galleryFiless = [];
            let filess = [];

            res.data.images !== null
              ? res.data.images.map((res) => {
                const id = getFileId(res);
                const fileName = getFileName(res);
                galleryFiless.push({
                  id,
                  source_url: res,
                  storage_key: fileName,
                  isSaved: true,
                });
              })
              : null;
            res.data.attachments.map((res) => {
              filess.push({ ...res, isSaved: true });
            });
            (myArrayFilteredTag = tags.filter((el) => {
              return res.data.tags.some((f) => {
                return f === el.value;
              });
            })),
              (rubric = rubrics.filter(
                (rub) => rub.value == res.data.rubric_id
              ));
            if (res.data.language != language) {
              this.onError();
            } else {
              const initialState = {
                title: res.data.title,
                galleryFiless,
                filess,
                picturesUrl: res.data.main_picture,
                smallText: res.data.description,
                facebook_enable: res.data.facebook_enable,
                editorValue: res.data.content,
                tag: myArrayFilteredTag,
                rubric,
                checked: res.data.is_published,
                autoPublishDate:
                  res.data.published_date === null
                    ? ''
                    : res.data.published_date,
              };

              this.setState({
                ...initialState,
                rubrics: rubrics,
                tags: tags,
                loading: false,
                error: false,
                _selectedDate: res.data.published_date
                  ? new Date(res.data.published_date)
                  : new Date(),
                initialState: JSON.stringify(initialState),
              });
            }
          });
        } else {
          let rubric = rubrics.filter((rub) => rub.value == null);
          this.setState({
            title: '',
            smallText: '',
            facebook_enable: true,
            rubric: rubric,
            tag: [],
            checked: true,
            rubrics: rubrics,
            tags: tags,
            loading: false,
            error: false,
            initialState: '',
          });
        }
      })
      .catch(() => this.onError());
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { translate, language } = this.props;

    const {
      filess,
      filesToDelete,
      galleryFiless,
      galleryFilesToDelete,
      checked,
      rubric,
      tag,
      editorValue,
      uploadedEditorImages,
      title,
      smallText,
      facebook_enable,
      pictures,
      picturesUrl,
      picturesUrlDelete,
      editedFiles,
    } = this.state;

    const date = this.state.autoPublishDate
      ? new Date(this.state.autoPublishDate)
      : null;

    if (title.trim().length < 3) {
      toast.error(this.props.translate('minLengthNewsName'));
      return;
    }
    if (pictures === null && picturesUrl === null) {
      toast.error(this.props.translate('notAddedNewsImageAlert'));
      return;
    }

    const id = +this.props.match.params.id;
    const titleTrimmed = title.trim();
    const smallTextTrimmed = smallText.trim();

    if (picturesUrlDelete !== null) {
      delFile(getFileId(picturesUrlDelete));
    }

    editedFiles.forEach(item => {
      updateDocument(item.id, item.storage_key, item.content).then(res => {
      }).catch(err => {
        console.error(err)
        toast.error(this.props.translate("updateDocumentError"))
        return;
      })
    })
    const newsJson = JSON.stringify({
      id,
      title: titleTrimmed,
      content: parseEditorImagesHeightDelete(editorValue),
      rubric_id:
        rubric[0] !== undefined
          ? parseInt(rubric[0].value)
          : parseInt(rubric.value),
      tags: tag.map((tags) => tags.value),
      is_published: checked,
      description: smallTextTrimmed,
      facebook_enable: facebook_enable,
      images: galleryFiless.map((file) => file.id),
      attachments: filess.map((file) => ({
        id: file.id,
        is_active: file.is_active,
      })),
      main_picture:getFileId(pictures)!==""?getFileId(pictures):getFileId(picturesUrl),
      language,
      published_date: date?.toISOString() || null,
    });

    let response;
    if (id === 0) {
      response = postNews(newsJson);
    } else {
      response = putNews(newsJson);
    }

    response
      .then((res) => {
        if (res.status !== 'ok') {
          toast.error(translate('errorOccurredWhileSavingTheNews'));
          return;
        }

        const updatedImages = deleteEditorImages(
          editorValue,
          uploadedEditorImages
        );
        filesToDelete.forEach((id) => delFile(id));
        galleryFilesToDelete.forEach((id) => delFile(id));

        this.props.toast(translate('newsSuccessfullyAdded'));
        const savedFiles = filess.map((file) => ({ ...file, isSaved: true }));
        const savedGalleryFiles = galleryFiless.map((file) => ({
          ...file,
          isSaved: true,
        }));

        this.setState({
          filess: savedFiles,
          galleryFiless: savedGalleryFiles,
          uploadedEditorImages: updatedImages,
          save: true,
          redirect: true,
        });
      })
      .catch((error) => console.log('Error :>> ', error));
  };

  handleChangeTag = (selectedOption) => {
    if(selectedOption==null)
    selectedOption=[]
    
    this.setState({ tag: selectedOption });
  };

  handleChangeRubric = (optionSelected) => {
    this.setState({ rubric: optionSelected });
  };

  handleChangeTitle = (event) => {
    event.preventDefault();
    if (event.target.value.length > 700) {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast.error(
          this.props.translate('newsNameLengthLimitation') +
          ' 700 ' +
          this.props.translate('newsNameLengthLimitationUnit')
        );
      }
      event.preventDefault();
    }
    this.setState({ title: event.target.value });
  };

  handleChangeSmallText = (event) => {
    this.setState({
      smallText:
        event.target.value[0] === ' '
          ? event.target.value.trimStart()
          : event.target.value,
    });
  };

  handleChangeCheckBox = (name) => (event) => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  handleChangeFacebookEnable = (event) => {
    this.setState({ facebook_enable: event.target.checked });
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

  onClickDeleteFile = (id) => {
    const { filess } = this.state;
    const filtered = filess.filter((file) => file.id !== id);
    this.setState((state) => ({
      filess: filtered,
      filesToDelete: [...state.filesToDelete, id],
    }));
  };

  onShowFileName = (id) => {
    let { filess } = this.state;
    const changed = filess.map((item) => {
      if (item.id === id) {
        item.is_active = !item.is_active;
        return item;
      }
      return item;
    });
    this.setState({ filess: changed });
  };

  onClickDeleteGalleryFile = (id) => {
    const { galleryFiless } = this.state;
    const filtered = galleryFiless.filter((file) =>
      file.id ? file.id !== id : getFileId(file) !== id
    );
    this.setState((state) => ({
      galleryFiless: filtered,
      galleryFilesToDelete: [...state.galleryFilesToDelete, id],
    }));
  };

  changePublishDate = (date) => {
    this.setState({
      autoPublishDate: date ? date.toISOString() : '',
    });
  };

  setAutoPublishDate = (selectedDate, autoPublishDate) => {
    this.setState({
      _selectedDate: selectedDate,
      autoPublishDate,
    });
  };

  onDrop = (picturesUpload, pictureDataURLs) => {
    let { picturesUrl, pictures } = this.state;

    if (picturesUpload.length > 0) {
      this.setState({
        disabled: true,
        display: true,
        cropper: {
          isActive: true,
          image: pictureDataURLs[0],
          name: picturesUpload[0].name.split('.')[0].substring(0, 90),
        },
      });
    } else if (picturesUrl !== null) {
      this.setState({
        picturesUrl: null,
        picturesUrlDelete: picturesUrl,
        disabled: false,
      });
    } else {
      delFile(getFileId(pictures)).then((res) => {
        this.setState({ pictures: null, disabled: false });
      });
    }
  };

  onCrop = () => {
    this.setState((prevState) => ({
      cropper: {
        isActive: false,
        image: prevState.image,
        index: prevState.index,
        name: prevState.name,
      },
    }));

    const imageElement = this.cropperRef?.current;
    const cropperImage = imageElement?.cropper;
    const fileToUpload = dataURLtoFile(
      cropperImage.getCroppedCanvas().toDataURL(),
      `${this.state.cropper.name}.png`
    );
    postFile(fileToUpload).then((res) => {
      this.setState({
        pictures: res.data.source_url,
        display: false,
        cropper: {
          isActive: false,
          image: null,
          index: null,
          name: null,
        },
      });
    });
  };
  onCloseCrop = () => this.setState({
    display: false,
    cropper: {
      isActive: false,
      image: null,
      index: null,
      name: null,
    },
  });

  onDropGalleryFiles = (galleryFiles) => {
    this.setState({ displayGalleryFiles: true });
    let masGalleryFiles = [];
    let { galleryFiless } = this.state;

    galleryFiles.map((file) => {
      if (file.name.split('.')[0].length > 100) {
        toast.error(this.props.translate('fileNameIsTooLong'));
        return;
      }
      masGalleryFiles.push(postFile(file));
    });
    Promise.all(masGalleryFiles).then((resonses) => {
      resonses.map((res) => {
        galleryFiless.push({ ...res.data, isSaved: false });
      });
      this.setState({
        galleryFiless: galleryFiless,
        displayGalleryFiles: false,
      });
    });
  };

  onDropFiles = (files) => {

    let index = files[0].name.lastIndexOf('.');
    this.setState({
      showEditFileModal: true,
      methodForModal: "POST",
      newFile: {
        ...this.state.newFile,
        name: files[0].name.substring(0, index),
        data: files[0],
        extention: files[0].name.substring(index, files[0].name.length),
      }
    })
  };

  handleSubmitModalPost = async (event) => {
    event.preventDefault();

    let { newFile, filess } = this.state;
    this.setState({
      displayFile: true,
      showEditFileModal: false,
      newFile: {
        id: null,
        name: null,
        data: null,
        tags: [],
        extention: null,
      }
    });
    await postDocument(newFile.data, newFile.name + newFile.extention, newFile.tags).then(res => {
      filess.push({ ...res.data, is_active: true, saved: false });
      this.setState({ filess: filess, displayFile: false })
    }).catch(err => {
      console.error(err)
      this.props.toast.error(this.props.translate("unexpectedErrorOccurred"))
    })
  }
  handleSubmitModalPut = async (event) => {
    event.preventDefault()

    const { newFile, filess, editedFiles } = this.state
    let editedFile = editedFiles.find(item => item.id == newFile.id)

    filess[filess.indexOf(filess.find(item => item.id == newFile.id))] = {
      ...filess[filess.indexOf(filess.find(item => item.id == newFile.id))],
      storage_key: newFile.name + newFile.extention,
      content: newFile.tags
    }

    if (editedFile) {
      editedFiles[editedFiles.indexOf(editedFile)] = {
        ...editedFile,
        storage_key: newFile.name + newFile.extention,
        content: newFile.tags
      }
    } else {
      editedFiles.push({
        id: newFile.id,
        storage_key: newFile.name + newFile.extention,
        content: newFile.tags
      })
    }

    this.setState({
      showEditFileModal: false,
      newFile: {
        id: null,
        name: null,
        data: null,
        tags: [],
        extention: null,
      },
      filess: filess,
      editedFiles: editedFiles
    })
  }
  onClickEdit = (file) => {
    let index = file.storage_key.lastIndexOf('.');
    this.setState({
      methodForModal: "PUT",
      showEditFileModal: true,
      newFile: {
        id: file.id,
        name: file.storage_key.substring(0, index),
        extention: file.storage_key.substring(index, file.storage_key.length),
        tags: file.content ? file.content : [],
      }
    })
  }

  validateFileName(newFile) {
    const { translate } = this.props
    if (newFile.name != null) {
      if ((newFile.name.length + newFile.extention.length) >= 100) {
        return {
          wrongFileName: true,
          wrongFileNameMessage: translate("fileNameIsTooLong")
        }
      } else if (newFile.name.length == 0) {
        return {
          wrongFileName: true,
          wrongFileNameMessage: translate("shouldBeString")
        }
      }
    }
    return {
      wrongFileName: false,
      wrongFileNameMessage: null
    }
  }

  render() {
    const { redirect } = this.state;
    const { translate } = this.props;
    const {
      methodForModal,
      newFile,
      loading,
      error,
      rubrics,
      tags,
      rubric,
      tag,
      picturesUrl,
      display,
      displayFile,
      displayGalleryFiles,
      title,
      smallText,
      facebook_enable,
      pictures,
      editorValue,
      galleryFiless,
      filess,
      checked,
      autoPublishDate,
      initialState,
      cropper,
    } = this.state;
    let disabled = this.state;
    let tempPicturesUrl = picturesUrl !== null ? picturesUrl : pictures;

    if (picturesUrl !== null || pictures !== null) {
      disabled = true;
    }

    const hasData = !(loading || error);
    const errorMessage = error ? <NotFound /> : null;

    if (redirect) {
      this.setState({ redirect: false });
      return <Redirect push to={`/`} />;
    }

    const fileNameValidation = this.validateFileName({ name: newFile.name, extention: newFile.extention })

    let onSubmitModal = null
    if (methodForModal == "POST") {
      onSubmitModal = this.handleSubmitModalPost
    } else if (methodForModal == "PUT") {
      onSubmitModal = this.handleSubmitModalPut
    }
    const files = this.state.filess.map((file) => (
      <FileView
        key={file.id}
        file={file}
        enableEdit={true}
        onEdit={this.onClickEdit}
        onClickDeleteFile={this.onClickDeleteFile}
        onShowFileName={this.onShowFileName}
      />
    ));

    const galleryFiles =
      this.state.galleryFiless === null ? (
        <div></div>
      ) : (
        this.state.galleryFiless.map((file) => (
          <FileView
            key={file.id}
            file={file}
            onClickDeleteFile={this.onClickDeleteGalleryFile}
          />
        ))
      );
    const currentState = {
      title,
      galleryFiless,
      filess,
      picturesUrl,
      smallText,
      facebook_enable,
      editorValue,
      tag,
      rubric,
      checked,
      autoPublishDate,
    };
    const submitDisable =
      this.props.match.params.id !== 0 &&
      initialState === JSON.stringify(currentState);
    let disableHeader = false;
    if (submitDisable == true || displayFile === true || displayGalleryFiles == true) {
      disableHeader = true;
    }
    return (
      <React.Fragment>
        <Modal
          show={this.state.showEditFileModal}
          onExited={() => this.setState({
            showEditFileModal: false,
            methodForModal: null,
            newFile: {
              id: null,
              name: null,
              data: null,
              tags: [],
              extention: null,
            }
          })}
          onHide={() => this.setState({
            showEditFileModal: false,
            methodForModal: null,
            newFile: {
              id: null,
              name: null,
              data: null,
              tags: [],
              extention: null,
            }
          })}
          dialogClassName="modal-90w"
          centered={true}
          size='lg'
          scrollable={true}>
          <Modal.Header closeButton>
            <h3>{translate("documentSettingsTitle")}</h3>
          </Modal.Header>
          <Modal.Body bsPrefix="overflow-auto">
            <div className="col-lg-12">
              <form autoComplete="off" className="card-body" role="form">
                <div className="form-group pr-4 ">
                  <label className="font-weight-600 mb-2 col-form-label">
                    {translate("title")}
                  </label>
                  <div>
                    <input
                      id="fileName"
                      type="text"
                      autoComplete="off"
                      className="form-control rounded shadow-none"
                      onChange={(data) => {
                        this.setState({
                          newFile: {
                            ...newFile,
                            name: data.target.value,
                          }
                        })
                      }}
                      value={newFile.name ? newFile.name : ""}
                    />
                  </div>
                  {fileNameValidation.wrongFileName &&
                    <span className="adminValidSpan">{fileNameValidation.wrongFileNameMessage}</span>
                  }
                </div>
                <div className="form-group pr-4">
                  <label className="font-weight-600 mb-2 col-form-label">
                    {translate("keywords")}
                  </label>
                  <div>
                    <CreatableInputOnly styles={customStyles} tags={newFile.tags} onTagsChange={(value) => {
                      this.setState({
                        newFile: {
                          ...newFile,
                          tags: value
                        }
                      })
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    disabled={fileNameValidation.wrongFileName}
                    onClick={onSubmitModal}
                    className="btn btn-mint-green col-xs-12 mt-3 mr-2"
                  >
                    {translate('save')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary col-xs-12 mt-3"
                    onClick={() => this.setState({
                      showEditFileModal: false,
                      methodForModal: null,
                      newFile: {
                        name: null,
                        data: null,
                        tags: [],
                        extention: null,
                      }
                    })}
                  >
                    {translate('close')}
                  </button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
        <Modal onHide={this.onCloseCrop} show={cropper.isActive} size="lg">
          <Modal.Body>
            <div>
              <Cropper
                style={{ height: 500, width: '100%' }}
                aspectRatio={ASPECT_RATIO}
                src={cropper.image}
                guides={true}
                rotatable="true"
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                viewMode={1}
                checkOrientation={false}
                ref={this.cropperRef}
              />
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={this.onCrop}
                  className="btn btn-info btn-add col-xs-12 mt-3 mr-2"
                >
                  {translate('save')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary col-xs-12 mt-3"
                  onClick={this.onCloseCrop}
                >
                  {translate('close')}
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {hasData ? (
          <div className="NewsForm">
            <SectionHeader
              isSticky={true}
              isCheckboxShown={true}
              title={
                this.props.match.params.id != 0
                  ? translate('editingNews')
                  : translate('creatingNews')
              }
              isCancelSubmitShown={true}
              handleSubmit={this.handleSubmit}
              submitDisable={disableHeader}
              checkboxChecked={this.state.checked}
              isCheckboxDisabled={this.state.isCheckboxDisabled}
              onCheckboxChange={this.handleChangeCheckBox('checked')}
              linkTo="/"
            />
            <form>
              <div className={this.props.isEditorInFullscreen ? "" : "content wrapper wrapperContent animated fadeInRight"}>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="pageElementBox collapsed border-bottom">
                      <div className="pageElementBoxTitle border-bottom-0">
                        <h5>
                          {this.props.match.params.id != 0
                            ? translate('editNews')
                            : translate('addNews')}
                        </h5>
                      </div>
                      <div
                        className="pageElementBoxContent"
                        style={{ display: 'block' }}
                      >
                        <div className="form-group  row">
                          <label className="col-sm-2 col-form-label requiredCustom">
                            {translate('title')}
                          </label>
                          <div className="col-sm-10">
                            <input
                              required
                              minLength={3}
                              value={this.state.title}
                              onChange={this.handleChangeTitle}
                              type="text"
                              className="form-control border-radius-1 shadow-none"
                              resize="none"
                            />
                          </div>
                        </div>
                        <div className="form-group  row">
                          <label className="col-sm-2 col-form-label">
                            {translate('shortDescription')}
                          </label>
                          <div className="col-sm-10">
                            <textarea
                              value={this.state.smallText}
                              onChange={this.handleChangeSmallText}
                              className="textarea form-control border-radius-1 shadow-none"
                              name="Text1"
                              rows="2"
                            ></textarea>
                          </div>
                        </div>
                        <div className="form-group  row">
                          <label className="col-sm-2 col-form-label requiredCustom">
                            {translate('image')}
                          </label>
                          <div
                            className={
                              display !== false
                                ? 'col-sm-10 opacity06'
                                : 'col-sm-10'
                            }
                          >
                            <div
                              className={
                                display === false
                                  ? 'CircularProgress d-none'
                                  : 'CircularProgress'
                              }
                            >
                              <CircularProgress style={{ color: 'yellow' }} />
                            </div>
                            <ImageUploader
                              withIcon={false}
                              withPreview={true}
                              withLabel={false}
                              singleImage={true}
                              buttonText={translate('upload')}
                              onChange={this.onDrop}
                              imgExtension={[
                                '.jpg',
                                '.gif',
                                '.png',
                                '.gif',
                                '.jpeg',
                              ]}
                              maxFileSize={25 * 1024 * 1024}
                              buttonClassName={
                                disabled === true
                                  ? 'buttonImageDisabled'
                                  : 'buttonImage'
                              }
                              defaultImages={
                                tempPicturesUrl ? [tempPicturesUrl] : []
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pageElementBox collapsed border-bottom">
                      <div className="pageElementBoxTitle border-bottom-0">
                        <h5>{translate('contentEditor')}</h5>
                      </div>
                      <div
                        className="pageElementBoxContent"
                        style={{ display: 'block' }}
                      >
                        <HtmlEditor
                          editorValue={this.state.editorValue}
                          setEditorValue={this.setEditorValue}
                          setUploadedImages={this.setUploadedEditorImages}
                          parent="newsForm"
                        />
                      </div>
                    </div>

                    <div className="pageElementBox collapsed border-bottom">
                      <div className="pageElementBoxTitle border-bottom-0">
                        <h5>{translate('addTags')}</h5>
                      </div>
                      <div
                        className="pageElementBoxContent"
                        style={{ display: 'block' }}
                      >
                        <CreatableSelect
                          isMulti
                          onChange={this.handleChangeTag}
                          value={this.state.tag}
                          options={tags}
                          placeholder={''}
                          className="select"
                          styles={customStyles}
                        />
                      </div>
                    </div>

                    {!this.props.isEditorInFullscreen && (
                      <div className="pageElementBox collapsed border-bottom">
                        <div className="pageElementBoxTitle border-bottom-0">
                          <h5>{translate('addSliderImages')}</h5>
                        </div>
                        <div
                          className="pageElementBoxContent"
                          style={{ display: 'block' }}
                        >
                          <Dropzone
                            onDrop={this.onDropGalleryFiles}
                            accept="image/*"
                            multiple
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className="container">
                                <div
                                  {...getRootProps({ className: 'dropzone' })}
                                >
                                  <input {...getInputProps()} multiple />
                                  <br />
                                  <br />
                                  <h2 className="text-center m-t-5">
                                    {translate('dropFilesHereOrClickToUpload')}
                                  </h2>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                          <div className="mt-2">
                            <aside>{galleryFiles}</aside>
                            <CircularProgress
                              className={
                                displayGalleryFiles === false
                                  ? 'd-none ml-3'
                                  : 'ml-3'
                              }
                              style={{ color: 'yellow' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {!this.props.isEditorInFullscreen && (
                      <div className="pageElementBox collapsed border-bottom">
                        <div className="pageElementBoxTitle border-bottom-0">
                          <h5>{translate('addAttachments')}</h5>
                        </div>
                        <div
                          className="pageElementBoxContent"
                          style={{ display: 'block' }}
                        >
                          <Dropzone onDrop={this.onDropFiles} multiple={false}>
                            {({ getRootProps, getInputProps }) => (
                              <section className="container">
                                <div
                                  {...getRootProps({ className: 'dropzone' })}
                                >
                                  <input {...getInputProps()} />
                                  <br />
                                  <br />
                                  <h2 className="text-center m-t-5">
                                    {translate('dropFilesHereOrClickToUpload')}
                                  </h2>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                          <div className="mt-2">
                            <aside>{files}</aside>
                            <CircularProgress
                              className={
                                displayFile === false ? 'd-none ml-3' : 'ml-3'
                              }
                              style={{ color: 'yellow' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-4">
                    <div className="pageElementBox collapsed border-bottom">
                      <div className="pageElementBoxTitle border-bottom-0">
                        <h5>{translate('newsRubric')}</h5>
                      </div>
                      <div
                        className="pageElementBoxContent"
                        style={{ display: 'block' }}
                      >
                        <Select
                          options={rubrics}
                          value={this.state.rubric}
                          onChange={this.handleChangeRubric}
                          placeholder={''}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <DateTimePicker
                      autoPublishDate={this.state.autoPublishDate}
                      setAutoPublishDate={this.setAutoPublishDate}
                      changePublishDate={this.changePublishDate}
                    />
                    <div className="pageElementBox border-bottom">
                      <div className="pageElementBoxTitle d-flex justify-content-between pr-4">
                        <h5>{translate("facebook_commentsEnableOnNewsPage")}
                          <OverlayTrigger overlay={<Tooltip>{translate('facebookPlugin_Tooltip')}</Tooltip>}>
                            <InfoIcon fontSize="small" />
                          </OverlayTrigger>
                        </h5>

                        <Form.Check
                          name='facebookComment'
                          label={translate("enable")}
                          id='facebookComment'
                          checked={this.state.facebook_enable}
                          onChange={this.handleChangeFacebookEnable}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : null}
        {errorMessage}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    isEditorInFullscreen: state.interface.isEditorInFullscreen,
  };
};

export default connect(mapStateToProps)(withTranslate(NewsForm));
