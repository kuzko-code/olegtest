import { connect } from 'react-redux';
import Container from '../components/Container.jsx';

const mapStateToProps = (store, ownProps) => ({
  items: (
    store[ownProps.reduxStoreName]
      .content[ownProps.reduxUid]
      .filter(item => item.parentId === ownProps.itemId)
  ),
});

export default connect(mapStateToProps)(Container);
