import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import GovLinksSettings from './govLinksSettings.jsx';
import SectionHeader from '../header/SectionHeader.jsx';
import FloatMenuSettings from './FloatMenuSettings.jsx';
import '../../../public/assets/css/linkssettings.css';

export class LinksSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { translate } = this.props;

    return (
      <div className="linksEditor">
        <SectionHeader title={translate('linksSettings')} />
        <div className="mt-4 mx-3">
          <div className="row linksEditorContainer">
            <div className="col-6">
              <GovLinksSettings />
            </div>
            <div className='col-6'>
              <FloatMenuSettings />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslate(LinksSettings);
