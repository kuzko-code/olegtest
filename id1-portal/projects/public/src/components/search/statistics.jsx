import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../redux/search/actions.js';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

const Statistics = ({ items, props }) => {
  const { translate } = props;
  var tempitems = items.sort(function (a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    if (x < y) { return -1; }
    if (x > y) { return 1; }
    return 0;
  });

  function filterByCount(item) {
    if (parseInt(item.count) != 0) {
      return true;
    }
    return false;
  }
  tempitems = tempitems.filter(filterByCount);

  return (
    <div className="list-group">
      <div href="#" className="list-group-item">
        <div className="mb-3 mt-1"><strong>{translate('searchStatistics')}</strong></div>
        <table className="table-borderless">
          <tbody>
            {tempitems.length > 0 ? tempitems.map(item =>
              <React.Fragment key={item.id}>
                <tr>
                  <td>
                    {<Link className="link-tatistics btn m-2" to={`${item.query}`}>{item.id}</Link>}
                  </td>
                  <td>
                    <div className="statistics-count">
                      <strong>{item.count}</strong>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ) : <tr>
                <td>
                  <div className="statistics-count">
                    <strong>{translate('nothingFound')}</strong>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.reducerSearch,
  };
};

export default connect(mapStateToProps, actions)(withTranslate(Statistics));