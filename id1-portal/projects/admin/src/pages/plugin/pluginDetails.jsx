import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
//component
import SectionHeader from '../../components/header/SectionHeader.jsx';
//service
import { getPluginsByName } from "../../services/plugin-api-services.js";



export class PluginDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: "",
            name: "",
            loading: true,
            error: false
        }
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        });
    };

    componentDidMount() {
        getPluginsByName(this.props.match.params.name).then(responseData => {
            if (responseData.status == "ok") {

                this.setState({
                    name: responseData.data.name,
                    displayName: responseData.data.displayName,
                    loading: false,
                    error: false
                });
            } else {
                toast.error(responseData.error_message);
            }
        }).catch(this.onError);
    }

    render() {
        const { translate } = this.props;
        const { error, loading, name, displayName } = this.props;
        
        const errorMessage = error ? <div className="alert alert-light">{translate('unexpectedErrorOccurred')}</div> : null;

        const content = !error ? <div>
            <SectionHeader title={translate('pluginInformation')} />
            <div className="AppealsList wrapper wrapperContent animated fadeInRight">
                <div className="pageElementBoxContent">
                    <div className="row">
                        <div className="col">
                            <h4>{translate('pluginDisplayName')}</h4>
                            <p>{name}</p>
                        </div>
                        <div className="col">
                            <h4>{translate('descriptionOfPlugin')}</h4>
                            <p>{displayName}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-right">
                        <Link className="btn btn-mint-green mb-2 text-white pluginDetailsCloseButton" to="/plugins">{translate('close')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div> : null;

        return (
            <React.Fragment>
                <div>Сторінка в розробці</div>
            {/* {content}
            {/* {spinner} 
            {errorMessage} */}

        </React.Fragment>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         language: state.Intl.locale
//     };
// };

export default (withTranslate(PluginDetails));