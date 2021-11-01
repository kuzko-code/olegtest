import React from 'react';
import { useSelector } from 'react-redux';

const Footer = (props) => {

  const { reducerSettings: settings, } = useSelector((state) => state);
  const defaultTemplate = './template/defaultFooter.jsx';
  let Template = <></>;

  try {
    //  Template = (require(`${settings.Template.footer}`).default);/
    Template = (require(`${defaultTemplate}`).default);

  } catch (error) {
    console.error(error)
    Template = (require(`${defaultTemplate}`).default);
  }

  return (
    <Template/>
  )
}
export default Footer;