import React, {Component} from 'react';
import {withTranslate} from 'react-redux-multilingual';
import {Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
export class NoAccess extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {translate} = this.props;
        return (
            <div id="403">
                <div className="bg-white mt-4 align-center">{translate('accessDenied')}</div>
            </div>
        )
    }
}

// export default MainPage;
export default withTranslate(NoAccess);