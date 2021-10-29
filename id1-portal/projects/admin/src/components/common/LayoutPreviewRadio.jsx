import React, { useState } from 'react';
import { Col, FormCheck } from 'react-bootstrap';
import { Radio, Modal } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

const LayoutPreviewRadio = ({ name, id, title, selected, src, onSelect, preview = true }) => {
  const [isModalShown, setIsModalShown] = useState(false);

  const handleClick = () => setIsModalShown(true);
  const onClosePreview = () => setIsModalShown(false);
  const onSelectTemplate = (e) => {
    !isModalShown && onSelect(e);
  };

  return (
    <>
      <Col className="px-4">
        <FormCheck.Label htmlFor={id}>
          <Radio
            name={name}
            id={id}
            checked={selected}
            onChange={onSelectTemplate}
            style={{ color: '#43a047', marginLeft: -10 }}
            size="small"
          />
          <span>{title}</span>
          <div
            style={{
              position: 'relative',
              width: 160,
              height: 'auto',
              backgroundColor: 'grey',
              borderRadius: 6,
            }}
          >
            <img
              style={{ maxWidth: '100%' }}
              src={src}
              alt="layout preview thumbnail"
            />
            {preview ? <div
              style={{
                marginLeft: 'auto',
                width: 'max-content',
                cursor: 'pointer',
                position: 'absolute',
                top: 4,
                right: 6,
                backgroundColor: '#fff',
                padding: 2,
                borderRadius: '50%',
              }}
              onClick={handleClick}
            >
              <VisibilityIcon />
            </div> : null}
          </div>
        </FormCheck.Label>
      </Col>
      {preview ?
        <Modal open={isModalShown} onClose={onClosePreview}>
          <img
            style={{
              maxWidth: '85%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '90vh'
            }}
            src={src}
            alt="modal window preview"
          />
        </Modal> : null}
    </>
  );
};
export default LayoutPreviewRadio;
