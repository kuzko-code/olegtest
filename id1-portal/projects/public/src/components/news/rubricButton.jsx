import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

export class RubricButton extends Component {
    render() {
        const { rubric, translate, locateForURL } = this.props;
        return (
            <div>
                {rubric ? <Link className="post-cat"  to={`${locateForURL}/newslist?rubric=${rubric.id}`}>{rubric.title}</Link> :
                <Link className="post-cat" to={`${locateForURL}/newslist?rubric=0`}> {translate('withoutRubrics')}</Link>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      locateForURL: `/${state.Intl.locale}`,
    };
  };
  
  export default connect(mapStateToProps)(withTranslate(RubricButton));