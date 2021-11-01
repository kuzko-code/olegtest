import React from 'react';
import { useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';


const Header = (props) => {
  const { reducerSettings: settings, menuSettings, } = useSelector((state) => state);

  const defaultTemplate = `./monochromeLimitedHeader.jsx`;
  let Template = settings.Template.header ? 
      ((require(`${settings.Template.header}`).default) || (require(`${settings.Template.header}`).default)):
      (()=><></>)

  return (
    <div>
      <Template
        menu={menuSettings}
        isLowVisionOn={props.isLowVisionOn}
        toggleLowVision={props.toggleLowVision}
        setErrorPage={props.setErrorPage}
        pageLoaded={props.pageLoaded}
      />


    </div>

  );
}
export default Header;