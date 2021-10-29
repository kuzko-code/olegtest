import React from 'react';
import { useSelector } from 'react-redux';
import { getAddBannerIcon } from '../../services/helpers';

const BannerIcon = ({ bannerType, classes }) => {
  const plugins = useSelector(({ reducerPlugins }) => reducerPlugins) || [];

  const DefaultIcon = getAddBannerIcon(bannerType, { classes });

  if (DefaultIcon) {
    return DefaultIcon;
  }

  const tab = plugins
    .flatMap((p) => p.tabs)
    .find((tab) => tab?.type === bannerType);

  let PluginIcon;
  try {
    PluginIcon = tab?.picture
      ? require('../../../node_modules/@material-ui/icons/' + tab.picture)
          .default
      : () => <></>;
  } catch (error) {
    console.log("Error while importing banner's icon :>> ", error);
  }

  return <PluginIcon classes={classes} />;
};

export default BannerIcon;
