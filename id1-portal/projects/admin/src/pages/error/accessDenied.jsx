import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import Alert from '@material-ui/lab/Alert';

export class AccessDenied extends Component {

    render(){
        const { translate } = this.props;
        return (
            <Alert severity="error">{translate('notificationOfLackOfRights')}</Alert> 
        )
    }
}

export default withTranslate(AccessDenied);