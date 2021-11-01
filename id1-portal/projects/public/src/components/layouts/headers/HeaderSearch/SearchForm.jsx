import React, { Component } from 'react';
import classList from 'classlist';
import { withTranslate } from 'react-redux-multilingual';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

class SeachForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textSearch: "",
            redirect: false,
            isSearchValid:true
        };
    };

    handleSearchChange = (event) => {
        this.setState({ textSearch: event.target.value });
        if(event.target.value.length>=3){
            this.setState({ isSearchValid: true });
        }
    }

    handleSearchSubmit = (event) => {
        const { textSearch } = this.state;
        let { isSearchValid } = this.state;
        textSearch.length>=3 ? isSearchValid=true : isSearchValid=false;
        this.setState({ isSearchValid: isSearchValid });
        event.preventDefault();
        if(isSearchValid){
            this.setState({ redirect: true });
        }
    }

    render() {
        const { textSearch, redirect, isSearchValid } = this.state;
        const { translate, locateForURL} = this.props;

        if (redirect) {
            this.setState({ 
                redirect: false,
                textSearch: ""
            });
            let showSearch = document.getElementById('searchToggle');
            classList(showSearch).remove('active');
            try {
                let showSearchMobile = document.getElementById('searchToggleMobile');
                classList(showSearchMobile).remove('active');
            } catch (error) {
                
            }
            return <Redirect push to={`${locateForURL}/search?key=${textSearch}`} />;
        }

        return (
            <form className="form active" id="portalSearchForm" onSubmit={this.handleSearchSubmit}>
                <div className="row">
                    <div className="col-xl-9">
                        <label>{translate('keywords')}</label>
                        <input
                            type="text"
                            name="key"
                            autoFocus={true}
                            className="text"
                            id="Search"
                            value={textSearch}
                            onChange={this.handleSearchChange}/>
                        {!isSearchValid && textSearch.length === 0 &&
                            <div className="customErrorMessage searchError">
                                <span>{translate('emptySearchTextError')}</span>
                            </div>
                        }    
                        {!isSearchValid && textSearch.length !== 0 &&
                            <div className="customErrorMessage searchError">
                                <span>{translate('searchTextMinLenghtError')}</span>
                            </div>
                        }    
                        <div id="search-error" className="search-error"></div>
                    </div>
                    <div className="col-xl-3 d-flex align-items-start">
                        <button className="btn_default yellow btn_search">{translate('find')}</button>
                    </div>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      locateForURL: `/${state.Intl.locale}`,
    };
};

export default connect(mapStateToProps)(withTranslate(SeachForm));