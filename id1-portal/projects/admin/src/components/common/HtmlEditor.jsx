import React, { useEffect, useState } from 'react';
import { useTranslate } from 'react-redux-multilingual';
import { useDispatch, useSelector } from 'react-redux';

import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce.js';
import 'tinymce/icons/default/index.js';
import 'tinymce/themes/silver/index.js';
import 'tinymce/plugins/advlist/index.js';
import 'tinymce/plugins/autolink/index.js';
import 'tinymce/plugins/lists/index.js';
import 'tinymce/plugins/image/index.js';
import 'tinymce/plugins/charmap/index.js';
import 'tinymce/plugins/print/index.js';
import 'tinymce/plugins/anchor/index.js';
import 'tinymce/plugins/searchreplace/index.js';
import 'tinymce/plugins/visualblocks/index.js';
import 'tinymce/plugins/code/index.js';
import 'tinymce/plugins/fullscreen/index.js';
import 'tinymce/plugins/insertdatetime/index.js';
import 'tinymce/plugins/media/index.js';
import 'tinymce/plugins/table/index.js';
import 'tinymce/plugins/wordcount/index.js';
import 'tinymce/plugins/paste/index.js';
import 'tinymce/plugins/link/index.js';

import { htmlEditorWrapper } from './htmlEditorWrapper.js';
import { toast } from 'react-toastify';
import {
  ConditionalWrapper,
  parseEditorImagesIds,
} from '../../services/helpers.js';
import { getCorrectedEditorContent } from '../../services/index.js';
import { postFile } from '../../services/file-api-services.js';
import actions from '../../redux/actions/interfaceActions.js';

const HtmlEditor = ({
  editorValue,
  setEditorValue,
  setUploadedImages,
  parent,
}) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const language = useSelector((state) => state.Intl.locale);
  const isFullScreen = useSelector(
    (state) => state.interface.isEditorInFullscreen
  );

  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const imagesIds = parseEditorImagesIds(editorValue);
    const images = imagesIds.map((id) => ({ id, isSaved: true }));
    setUploadedImages(images);
  }, []);

  const handleEditorChange = (content) => {
    setEditorValue(getCorrectedEditorContent(content));
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    try {
      const response = await postFile(blobInfo.blob(), blobInfo.filename());

      if (response.status !== 'ok') {
        failure(
          'Image upload failed due to a Transport error. Description: ' +
            response.error_message
        );
        return;
      }
      setUploadedImages({ isSaved: false, id: response.data.id });
      success(response.data.source_url);
    } catch (error) {
      toast.error(translate('errorWhileSavingImage'));
      console.log('Error :>> ', error);
    }
  };

  const handleExecCommand = (e) => {
    if (e.command !== 'mceFullScreen') {
      return;
    }
    dispatch(actions.toggleIsEditorInFullScreen(!isFullScreen));
  };

  const checkIfScroll = (editor) => {
    const editableAreaHeight = editor.contentAreaContainer?.clientHeight;
    const documentHeight = editor.contentDocument?.activeElement.clientHeight;
    if (editableAreaHeight - 32 < documentHeight) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };

  const onEditorInit = (editor) => {
    checkIfScroll(editor);
    editor.on('ResizeContent', ({ target }) => checkIfScroll(target));
  };

  const translationPath =
    language === 'en'
      ? null
      : `/public/tiny-mce-languages/${translate('localeCode_tiny_mce')}.js`;
  const tinyLanguage =
    language === 'en' ? null : translate('localeCode_tiny_mce');

  return (
    <ConditionalWrapper
      condition={isFullScreen}
      wrapper={htmlEditorWrapper(parent, isScroll)}
    >
      <Editor
        apiKey="5o0m8jdshm5vsec8udqumnylfsgu0rd0h8xmd6yo4t1ltxqb"
        init={{
          language: tinyLanguage,
          language_url: translationPath,
          height: isFullScreen ? '100%' : 550,
          menubar: 'edit view insert format tools table',
          convert_urls: false,
          menu: {
            format: {
              title: 'Format',
              items:
                'bold italic underline strikethrough superscript subscript codeformat | fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
            },
            view: {
              title: 'View',
              items:
                'code | visualaid visualchars visualblocks | spellchecker | fullscreen',
            },
          },
          toolbar:
            'undo redo | fontselect fontsizeselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | fullscreen',
          plugins: [
            'advlist autolink lists link image charmap print anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code wordcount',
          ],
          forced_root_block_attrs: {
            style: 'font-family: Arial; font-size: 16px;',
          },
          fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
          paste_retain_style_properties: 'all',
          images_upload_handler: handleImageUpload,
          init_instance_callback: onEditorInit,
        }}
        value={editorValue}
        onEditorChange={handleEditorChange}
        onExecCommand={handleExecCommand}
      />
    </ConditionalWrapper>
  );
};

export default HtmlEditor;
