import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import '../../../public/assets/css/newslist.css';
import Form from 'react-jsonschema-form';
import { translateJsonSchema } from '../../helpers/jsonschema-helpers';

export class Contacts extends Component {

  render() {
  
    const transformErrors = (errors) => {
      return errors.map(error => {
        if (error.name === 'pattern') {
          error.message = this.props.translate('linkFormat');
        } else if (error.name === 'maxLength') {
          error.message = this.props.translate('govLinkTitleTooLong');
        }
        return error;
      });
    }

    return (
      <div>
        <div className="Contacts wrapper">
          <div className="row">
            <div className="col-sm-12">
              {this.props.contacts.schema !== null &&
                this.props.contacts.formData && (
                  <Form
                    schema={translateJsonSchema(this.props.contacts.schema, this.props.translate)}
                    formData={this.props.contacts.formData}
                    onChange={this.props.setContacts}
                    transformErrors={transformErrors}
                    liveValidate={true}
                    id="contacts-form"
                  >
                    <button type="submit" className="d-none"></button>
                  </Form>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslate(Contacts);
