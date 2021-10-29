import React from 'react';
import * as PropTypes from 'prop-types';
import ReactCropper from 'react-cropper';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
// Utils
import { getFileInfo } from './utils';
// Styles
import 'cropperjs/dist/cropper.css';
import 'rc-slider/assets/index.css';

/**CropperModel `props`										info														type
Props = {
	file: Object, 											//File or Blob object
	  labels?: { 												//Labels
			heading: string,
			confirm: string,
			discard: string,
			zoom: string,
			rotate: string,
	  },
	mime?: string,											//MIME type (set null for auto retrieve)
	  quality?: number,										//Export image quality (1~100)
	  initialZoom?: number,									//Initial image zoom (0.0~10.0)
	  initialRotate?: number,									//Initial image rotate (-180~180)
	  modalProps?: ModalProps,								//Bootstrap modal options									{ ModalProps } from 'react-bootstrap';
	  cropperProps?: ReactCropperProps,						//Cropper options											{ ReactCropperProps } from 'react-cropper';
	  croppedCanvasProps?: Cropper.GetCroppedCanvasOptions,	//Cropped canvas options									Cropper from 'cropperjs';
	  onConfirm ( croppedFile: Object ): void,				//Event handlers: on confirm 
	  onDiscard ( file: Object ): void,						//Event handler: on discard
	  onCompleted (): void									//Event handler: Triggers on confirm and discard executed
 };
 */

function CropperModel(props) {
	const { labels, file } = props;
	const [cropper, setCropper] = React.useState(null);//Cropper
	const [image, setImage] = React.useState(null);//string
	const [zoom, setZoom] = React.useState(props.initialZoom);//number
	const [rotate, setRotate] = React.useState(props.initialRotate);//number

	React.useEffect(() => {
		if (file !== null) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImage(reader.result);
				cropper && cropper
					.zoomTo(props.initialZoom)
					.rotateTo(props.initialRotate);
			});
			reader.readAsDataURL(file);
		} else {
			setImage(null);
			setCropper(null);
		}
	}, [props, file, cropper]);

	const dataURLtoFile = (dataurl, filename) => {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	};

	const onConfirm = () => {
		if (!cropper) {
			return;
		}
		const croppedCanvas = {
			minWidth: 854,
			maxWidth: 1200,
			minHeight: 480,
			maxHeight: 600,
			imageSmoothingQuality: 'medium',
			...props.croppedCanvasProps,
		};
		const canvasData = cropper.getCroppedCanvas(croppedCanvas);//HTMLCanvasElement
		const fileInfo = getFileInfo(file, props.mime);
		const fileToUpload = dataURLtoFile(
			canvasData.toDataURL(),
			`${fileInfo.filename}.png`
		);
		typeof props.onConfirm === 'function' && props.onConfirm(fileToUpload);
		typeof props.onCompleted === 'function' && props.onCompleted();
		setRotate(0);
		setZoom(0);
	};

	const handleClose = () => {
		setCropper(false);
		setImage(null);
		typeof props.onDiscard === 'function' && props.onDiscard(file);
		typeof props.onCompleted === 'function' && props.onCompleted();
		setRotate(0);
		setZoom(0);
	};

	return (
		<Modal show={(!!file && !!image)} onHide={handleClose}
			animation={false} size="xl" {...props.modalProps}>
			<Modal.Header closeButton>
				<Modal.Title>{labels.heading}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="text-center">
				{image && (
					<ReactCropper
						src={image}
						style={{ height: 500, width: '100%' }}
						initialAspectRatio={16 / 9}
						viewMode={1}
						dragMode="move"
						center={true}
						toggleDragModeOnDblclick={false}
						checkOrientation={false}
						guides={true}
						rotatable={true}
						minCropBoxHeight={10}
						minCropBoxWidth={10}
						background={false}
						responsive={true}
						autoCropArea={1}
						onInitialized={instance => setCropper(instance)}
						{...props.cropperProps}
					/>
				)}
			</Modal.Body>
			<Modal.Footer className="d-block">
				<Row>
					<Col xs={6}>
						<div className="float-left mb-4 d-block" style={{ width: 200, marginRight: '65px' }}>
							<small>{labels.zoom}</small> <Slider min={0} step={.1} max={4} marks={{
								'0': '0x', '1': '1x', '2': '2x', '3': '3x', '4': '4x',
							}} value={zoom} onChange={(value) => {
								setZoom(value);
								cropper.zoomTo(value);
							}} />
						</div>
						<div className="float-left mb-3 d-block" style={{ width: 200 }}>
							<small>{labels.rotate}</small> <Slider min={-180} max={180} marks={{
								'-180': '-180°', '0': '0°', '180': '180°',
							}} value={rotate} onChange={(value) => {
								setRotate(value);
								cropper.rotateTo(value);
							}} />
						</div>
						<div className="clearfix" />
					</Col>
					<Col xs={6} style={{
						display: 'flex',
						alignSelf: 'center',
						justifyContent: 'flex-end',
					}}>
						<Button variant="primary" className="mr-1" onClick={onConfirm}>
							{labels.confirm}
						</Button>
						{' '}
						<Button variant="secondary" onClick={handleClose}>
							{labels.discard}
						</Button>
					</Col>
				</Row>
			</Modal.Footer>
		</Modal>
	);
}

CropperModel.propTypes = {
	initialZoom: PropTypes.number,
	initialRotate: PropTypes.number,
	mime: PropTypes.string,
	quality: PropTypes.number,
	file: PropTypes.object,
	labels: PropTypes.shape({
		heading: PropTypes.string,
		confirm: PropTypes.string,
		discard: PropTypes.string,
		zoom: PropTypes.string,
		rotate: PropTypes.string,
	}),
	cropperProps: PropTypes.object,
	modalProps: PropTypes.object,
	croppedCanvasProps: PropTypes.object,
	onDiscard: PropTypes.func,
	onCompleted: PropTypes.func,
}

CropperModel.defaultProps = {
	initialZoom: 0,
	initialRotate: 0,
	mime: null,
	quality: 70,
	labels: {
		heading: 'Crop Image',
		confirm: 'Confirm',
		discard: 'Discard',
		zoom: 'Zoom',
		rotate: 'Rotate',
	},
	modalProps: {},
	cropperProps: {},
	croppedCanvasProps: {},
	onDiscard: () => { },
	onCompleted: () => { },
}

export default CropperModel;
