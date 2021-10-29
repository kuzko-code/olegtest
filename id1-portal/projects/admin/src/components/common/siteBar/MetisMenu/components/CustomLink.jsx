import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import classnames from 'classnames';

class CustomLink extends React.Component {
  componentWillMount() {
    this.to = this.props.to;
    if (this.to[0] !== '/') this.to = `/${this.to}`;

    this.props.history.listen(this.onLocationChange.bind(this));
    this.onLocationChange(this.props.route);
  }
  onLocationChange(e) {
    if(e)
    if ((e.pathname || '/') === this.to) {
      this.props.activateMe();
    }
  }
  render() {
    const {
      className,
      classNameActive,
      classNameHasActiveChild,
      active,
      hasActiveChild,
      to,
      externalLink,
      hasSubMenu,
      toggleSubMenu,
      children,
    } = this.props;

    return (
      hasSubMenu || externalLink
      ? (
        <Link
          className={classnames(
            className,
            hasActiveChild && classNameHasActiveChild
          )}
          target={externalLink ? '_blank' : undefined}
          to={to}
          onClick={toggleSubMenu}
        >
          {children}
        </Link>
      )
      : (
        <Link
          className={classnames(
            className,
            active && classNameActive
          )}
          to={to}
        >
          {children}
        </Link>
      )
    );
  }
}

CustomLink.propTypes = {
  className: PropTypes.string.isRequired,
  classNameActive: PropTypes.string.isRequired,
  classNameHasActiveChild: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  hasActiveChild: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  externalLink: PropTypes.bool,
  hasSubMenu: PropTypes.bool.isRequired,
  toggleSubMenu: PropTypes.func,
  activateMe: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(CustomLink);