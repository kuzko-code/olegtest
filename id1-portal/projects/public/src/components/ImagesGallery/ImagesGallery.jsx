import ImageGallery from 'react-image-gallery';
import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import 'react-image-gallery/styles/css/image-gallery.css';
import "./ImagesGallery.css"
export class ImagesGallery extends Component {

    constructor(props) {
        super(props);
    };

    render() {
        const { items, className } = this.props;
        return (
            <div className={"images-gallery-style" + (className || "")}>
                <ImageGallery items={items} showBullets={true} slideDuration={900} />
            </div>
        );
    }
}

export default (withTranslate(ImagesGallery));