import React, { useEffect } from 'react';
import ImageUploader from 'react-images-upload';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import "../../../public/assets/css/newssettings.css";
import '../../../public/assets/css/newsform.css';

const CustomCarousel = ({
    index,
    titles,
    values,
    placeholders,
    onChange,
    onUp,
    onDown,
    onDelete,
    onDrop,
    onClickPreview=()=>{},
    translate,
    isArray,
    isLinkValid }) => {
    return (
        <div className="custom-carousel row d-flex flex-column mb-4">
            <label className="control-label font-weight-600 col">{titles?.title?.title}</label>
            <div className="d-flex justify-content-between">
                <div
                    className="col"
                    style={{ display: "inline-block" }}
                >
                    <div
                        className="newsSettings"
                        style={{ width: "100%", display: "inline-block" }}
                    >
                        <div className="form-group field field-string">
                            <input
                                className="form-control border-radius-1 shadow-none"
                                name="title"
                                type="text"
                                onInput={(event) => onChange(event, index)}
                                defaultValue={values?.title}
                                placeholder={placeholders?.title && placeholders?.title['ui:placeholder']}
                                maxLength="100"
                            />
                        </div>
                    </div>
                    <div
                        className="newsSettings"
                        style={{ width: "100%", display: "inline-block" }}
                    >
                        <label className="control-label font-weight-600">{titles?.url?.title}</label>
                        <div className="form-group field field-string">
                            <input
                                className="form-control border-radius-1 shadow-none"
                                name="url"
                                type="text"
                                onInput={(event) => onChange(event, index)}
                                defaultValue={values && values?.url ? values?.url : undefined}
                                placeholder={placeholders?.url && placeholders?.url['ui:placeholder']}
                            />
                            {!isLinkValid &&
                                <span className="text-danger">
                                    {translate('linkFormat')}
                                </span>
                            }
                        </div>
                    </div>
                    <div
                        className="newsSettings"
                        style={{ width: "100%", display: "inline-block" }}
                        onClick ={(event)=> onClickPreview(event, index)}
                    >
                        <label className="control-label font-weight-600 requiredCustom" htmlFor={`image_${index}`}>{titles?.file?.title}</label>
                        <ImageUploader
                            withIcon={false}
                            withPreview={true}
                            withLabel={false}
                            singleImage={true}
                            buttonText={translate('upload')}
                            imgExtension={[
                                '.jpg',
                                '.gif',
                                '.png',
                                '.gif',
                                '.jpeg',
                            ]}
                            buttonClassName={
                                values && values.file ?
                                    'buttonImageDisabled' :
                                    'buttonImage'
                            }
                            onChange={(files, urls) => onDrop(files, urls, index)}                          
                            disabled={values && values.file}
                            defaultImages={
                                values && values.file ?
                                    [values.file] :
                                    []
                            }
                        />
                    </div>
                </div>
                {
                    isArray &&
                    <div className=" array-item-toolbox col-auto">
                        <div
                            className="btn-group  selectActionButtons"
                            style={{ display: "inline-flex", justifyContent: "space-around" }}
                        >
                            <button
                                type="button"
                                onClick={() => onUp(index)}
                                className="btn btn-light border array-item-move-up"
                                tabIndex="-1"
                                style={{
                                    flex: "1 1 0%",
                                    paddingLeft: "6px",
                                    paddingRight: "6px",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="glyphicon glyphicon-arrow-up"></i>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDown(index)}
                                className="btn btn-light border array-item-move-down"
                                tabIndex="-1"
                                style={{
                                    flex: "1 1 0%",
                                    paddingLeft: "6px",
                                    paddingRight: "6px",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="glyphicon glyphicon-arrow-down"></i>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(index)}
                                className="btn btn-danger array-item-remove"
                                tabIndex="-1"
                                style={{
                                    flex: "1 1 0%",
                                    paddingLeft: "6px",
                                    paddingRight: "6px",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="glyphicon glyphicon-remove"></i>
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(CustomCarousel));