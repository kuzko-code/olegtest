import React, { Component } from 'react';
import { getRubrics } from "../../services/index.js"
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TabHeader from '../main/tabHeader.jsx'
import { withMediaQuery } from '../util/withMediaQuery.js';
class AutocompleteRubrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rubrics: [],
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        this.loadingData();
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    };

    loadingData() {
        const { language } = this.props;
        getRubrics(language).then(resonses => {
            if (resonses.status != "ok") {
                this.onError();
                return;
            }

            this.setState({
                rubrics: resonses.data,
                loading: false,
                error: false,
            });
        }).catch(() => this.onError());
    }

    render() {
        const { translate } = this.props;
        var { selectedRubric, handleRubricChange, CssTextField } = this.props;
        var { rubrics, loading, error } = this.state;

        var tempRubrics = [{
            id: 0,
            title: translate('withoutRubrics')
        }, ...rubrics]

        var tempRubric = tempRubrics.filter(res => res.id == selectedRubric)[0];
        tempRubric ? tempRubric : tempRubric = null;

        const hasData = !(loading || error);
        const errorMessage = error ? <div></div> : null;
        var content = hasData & rubrics.length > 0 ?
            <div className="unstyled clearfix" id="rubrics">
                <Autocomplete id="combo-box-demo"
                    value={tempRubric}
                    autoComplete
                    options={tempRubrics}
                    getOptionLabel={option => option.title}
                    onChange={handleRubricChange}
                    renderInput={
                        params => (
                            <CssTextField
                                fullWidth label={translate('search')} variant="outlined" margin={this.props.isDesktop ? 'none' : 'dense'} {...params} />
                        )
                    } />
            </div> : <CssTextField fullWidth label={translate('search')} variant="outlined" margin={this.props.isDesktop ? 'none' : 'dense'}/>;

        return (
            <React.Fragment>
                <TabHeader title={translate('rubrics')} />
                {content}
                {errorMessage}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(withMediaQuery([
    ['isDesktop', '(min-width:768px)', {
      defaultMatches: true
    }]
  ])(AutocompleteRubrics)));