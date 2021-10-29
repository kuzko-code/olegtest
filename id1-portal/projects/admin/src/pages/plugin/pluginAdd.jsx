import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import LinearProgress from '@material-ui/core/LinearProgress';
import Swal from 'sweetalert2';
//component
import SectionHeader from '../../components/header/SectionHeader.jsx';
//service
import { installPlugins } from "../../services/plugin-api-services.js";
//style
import '../../../public/assets/css/plugin.css'


export class PluginAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            error: false,
            pluginFiles: null,
            installing: false,
            redirect :false
        }
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        });
    };

    onDropFiles = (files) => {
        const { translate } = this.props;

        if (files[0].name.split('.').pop() != 'zip') {
            toast.error(translate('errorExtensionOfFileName'));
            return;
        }

        if (files[0].size < 100 * 1024 * 1024) {
            this.setState({ pluginFiles: files })
        }
        else {
            toast.error(translate('maxSizeOfThePlugin') + ' 100' + translate('fileSizeUnit'));
        }
    };

    onClickDeleteFile = () => {
        this.setState({ pluginFiles: null })
    };

    installPlugin = () => {
        const { pluginFiles } = this.state;
        const { translate } = this.props;

        Swal.fire({
            title: translate('installPlugin'),
            text: translate('installPluginInformText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: translate('installPluginCancelButtonText'),
            confirmButtonText: translate('installPluginConfirmButtonText')
        }).then((result) => {
            try {
                if (result.value) {
                    if (!pluginFiles[0]) {
                        toast.error(translate('pluginNotSelected'));
                        return;
                    }
                    this.setState({ installing: true });

                    this.addClassDisabledElement();
                    installPlugins(pluginFiles[0]).then(async res => {
                        if (res.status == 'error') {
                            this.setState({ installing: false });
                            this.removeClassDisabledElement();
                            if (res.error_message.includes('is already installed in the project')) {
                                toast.error(translate('pluginIsAlreadyInstalled'));
                            } else if (res.error_message.includes('maxFileSize exceeded')) {
                                toast.error(translate('maxSizeOfThePlugin') + ' 100' + translate('fileSizeUnit'));
                            } else if (res.error_message.includes('no such file or directory')) {
                                toast.error(translate('invalidFileStructure'));
                            } else {
                                toast.error(translate('pluginInstallError'));
                            }
                        }

                        if (res.status == "ok") {
                            await setTimeout(() => {
                                this.props.updateRoutes();
                                toast.success(translate('pluginSuccessfullyInstaled'));
                                this.setState({ installing: false, pluginFiles: null, redirect: true });
                                this.removeClassDisabledElement();
                            }, 10000);
                        }
                    })
                }
            } catch{
                this.removeClassDisabledElement();
            }
        })

    };

    removeClassDisabledElement() {
        var element = document.getElementById("root");
        element.classList.remove("disabledElement");
    }

    addClassDisabledElement() {
        var element = document.getElementById("root");
        element.classList.add("disabledElement");
    }

    render() {
        const { data, loading, error, pluginFiles, installing, redirect } = this.state;

        if (redirect) {
            this.setState({ redirect: false});
            return <Redirect push to={`/plugins`} />;
        }

        const { translate } = this.props;
        const errorMessage = error ? <div className="alert alert-light">{translate('unexpectedErrorOccurred')}</div> : null;
        const content = !error ?
            <div></div>
            : null;

        const files = pluginFiles ?
            <div className="folder-item folder-item-link p-2" key={pluginFiles[0].name}>
                <span className="link">
                    <span className="icn icn-folder-link"></span>
                    <p>{pluginFiles[0].name}</p>
                </span>
                <button className="btn btn-danger " type="button" onClick={this.onClickDeleteFile}><i className="fa fa-times"></i></button>
            </div>
            : null;

        return (
            <div className="pluginAddPage">
                <SectionHeader title={translate('pluginAddPageTitle')} />
                <div className="wrapper wrapperContent animated fadeInRight">
                    <div className="pageElementBox collapsed border-bottom pluginAddForm">
                        <div className="pageElementBoxTitle border-bottom-0">
                            <h5>{translate('additionPluginsFormMessage')}</h5>
                        </div>
                        <div className="pageElementBoxContent" style={{ display: "block" }}>
                            <div className="d-flex">
                                <div className="p-2">
                                    <Dropzone onDrop={this.onDropFiles}  multiple={false}>
                                        {({ getRootProps, getInputProps }) => (
                                            <section>
                                                <div {...getRootProps({ className: '' })}>
                                                {pluginFiles ?
                                                    <button type="button" className="btn btn-mint-green" disabled >{translate('upload')}</button> :
                                                    <button type="button" className="btn btn-mint-green">{translate('upload')}</button>}   
                                                    <input {...getInputProps()} /><br /><br />

                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </div>
                                <div className="p-2">
                                    {pluginFiles ?
                                        <button type="button" className="btn btn-dark-blue" onClick={this.installPlugin}>{translate('install')}</button>
                                        : <button type="button" className="btn btn-dark-blue" disabled>{translate('install')}</button>}
                                </div>
                            </div>

                            {files}

                            {installing ? <LinearProgress /> : null}

                        </div>
                    </div>
                    <div>
                        <span className="pluginGroupButton" >
                            <Link to={`/plugins`}> <button type="button" className="btn btn-light border button-right">{translate('cancel')}</button></Link>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        updateRoutes: state.Intl.updateRoutes
    };
};

export default connect(mapStateToProps)(withTranslate(PluginAdd));