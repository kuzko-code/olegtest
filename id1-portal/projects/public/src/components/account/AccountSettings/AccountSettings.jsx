import React, { useState, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import BreadcrumbsUI from '../../pages/BreadcrumbsUI.jsx';
import PersonalDataForm from '../PersonalDataForm/PersonalDataForm.jsx';

import { deleteUser } from '../../../services/auth-api-service.js';
import { resetBearerToken } from '../../../services/auth-service.js';

import './AccountSettings.css';

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const AccountSettings = ({ translate, history }) => {
  const pluginsSettings = useSelector(({ reducerPlugins }) => reducerPlugins);
  const themeColor = useSelector(
    ({ reducerSettings }) => reducerSettings.Layout.selectedColorTheme[2]
  );
  const useStyles = makeStyles({
    root: {
      borderRadius: 2,
    },

    indicator: { backgroundColor: themeColor },
  });
  const classes = useStyles();
  let myCabinetTabs = [];
  if (pluginsSettings && pluginsSettings.length) {
    pluginsSettings.forEach(plug => {
      if(plug && plug.myCabinetTabs && plug.myCabinetTabs.length){
        myCabinetTabs = [...myCabinetTabs, ...plug.myCabinetTabs.map(tab => {
          tab.pluginName = plug.name;
          return tab;
        })]
      }
    });
  }
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChooseTab = (event, newValue) => {
    setCurrentTabIdx(newValue);
  };

  const handleSignOut = () => {
    resetBearerToken();
    history.push('/');
  };

  const handleDialogOpen = () => setIsDialogOpen(true);

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      handleDialogClose();
      handleSignOut();
    } catch (error) {
      console.error('Error while deleting the user: ', error);
    }
  };

  const pluginComponentPath =
    myCabinetTabs[currentTabIdx - 1] &&
    myCabinetTabs[currentTabIdx - 1].viewOfTab;
  const pluginName =
    myCabinetTabs[currentTabIdx - 1] &&
    myCabinetTabs[currentTabIdx - 1].pluginName;
  const PluginComponent = pluginComponentPath && pluginName
    ? React.lazy(() => import(`../../../plugins/${pluginName}${pluginComponentPath}`))
    : () => <></>;

  return (
    <>
      <div className="row align-items-center px-3">
        <div className="col-6">
          <BreadcrumbsUI
            breadcrumbsArray={[]}
            curentPageTitle={translate('personalAccount')}
          />
        </div>
        <div className="col-6 text-right">
          <IconButton
            classes={{
              root: classes.root,
            }}
            onClick={handleDialogOpen}
          >
            <DeleteForeverIcon className="mr-2" />
            <span className="accountSettings__editBtnText">
              {translate('deleteAccount')}
            </span>
          </IconButton>
          <IconButton
            classes={{
              root: classes.root,
            }}
            onClick={handleSignOut}
          >
            <ExitToAppIcon className="mr-2" />
            <span className="accountSettings__editBtnText">
              {translate('exit')}
            </span>
          </IconButton>
        </div>
      </div>
      <div className="row m-0">
        <div className="col-md-4 col-lg-3 accountSettings__sideMenuWrapper">
          <Tabs
            orientation="vertical"
            value={currentTabIdx}
            onChange={handleChooseTab}
            aria-label="Account settings menu"
            classes={{
              indicator: classes.indicator,
            }}
          >
            <Tab
              label={
                <div className="mr-auto pl-2">
                  <AccountCircleIcon className="pr-1" />
                  <span className="accountSettings__menuItemText">
                    {translate('personalData')}
                  </span>
                </div>
              }
              {...a11yProps(0)}
            />
            {myCabinetTabs.map(({ translateName }, idx) => (
              <Tab
                key={translateName}
                label={
                  <div className="mr-auto pl-2">
                    <ListAltIcon className="pr-1" />
                    <span className="accountSettings__menuItemText">
                      {translate(translateName)}
                    </span>
                  </div>
                }
                {...a11yProps(idx + 1)}
              />
            ))}
          </Tabs>
        </div>
        <div className="col-md-8 col-lg-9">
          <div className="p-3 mb-3 border">
            {currentTabIdx === 0 && <PersonalDataForm />}
            {
              <Suspense>
                <PluginComponent />
              </Suspense>
            }
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {translate('wantDeleteAccount')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {translate('deleteAccountConfirmationMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {translate('cancel')}
          </Button>
          <Button onClick={handleDeleteAccount} color="primary" autoFocus>
            {translate('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withRouter(withTranslate(AccountSettings));
