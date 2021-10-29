import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { ClickAwayListener } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ChatIcon from '@material-ui/icons/Chat';
import CloseIcon from '@material-ui/icons/Close';
import smoothscroll from 'smoothscroll-polyfill';

import CustomLink from '../util/CustomLink.jsx';
import { getUsefullLinks } from '../../services';
import '../../../public/style/floatMenu.css';

const FloatMenu = () => {
  const language = useSelector((state) => state.Intl.locale);

  const [showScroll, setShowScroll] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    getUsefullLinks(language)
      .then(({ data, status, error_message }) => {
        if (status !== 'ok') {
          console.log('Error :>> ', error_message);
          return;
        }
        setMenuData(data.settings_object);
      })
      .catch((error) => console.log('Error :>> ', error));
    smoothscroll.polyfill();
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, []);

  const checkScrollTop = () => {
    if (window.pageYOffset > 100) {
      !showScroll && setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setIsMenuShown((state) => !state);
  };

  const closeMenu = () => {
    setIsMenuShown(false);
  };

  return (
    <div className="floatMenu__wrapper">
      {isMenuShown && (
        <ClickAwayListener onClickAway={closeMenu}>
          <div className="floatMenu__menuWrapper">
            <button
              className="floatMenu__button floatMenu__button-close"
              onClick={closeMenu}
            >
              <CloseIcon className="floatMenu__iconDark" fontSize="small" />
            </button>
            <ul className="floatMenu__menu">
              {menuData.map((item) => (
                <li
                  className="floatMenu__menuItem"
                  key={shortid.generate()}
                  onClick={closeMenu}
                >
                  <CustomLink url={item.url} className="floatMenu__link">
                    {item.title}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </ClickAwayListener>
      )}
      <div>
        {showScroll && (
          <button
            aria-label="go to top"
            className="floatMenu__button floatMenu__button-large"
            onClick={scrollTop}
          >
            <ArrowUpwardIcon
              fontSize="large"
              className="floatMenu__iconWhite"
            />
          </button>
        )}
        {Array.isArray(menuData) && menuData.length > 0 && (
          <div className="floatMenu__buttonMenuWrapper">
            <div className="floatMenu__button-animated" />
            <button
              aria-label="float menu"
              className="floatMenu__button floatMenu__button-large"
              onClick={toggleMenu}
            >
              <ChatIcon className="floatMenu__iconWhite floatMenu__iconChat" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatMenu;
