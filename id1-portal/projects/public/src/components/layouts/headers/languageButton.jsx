import React from 'react';
import { useDispatch } from 'react-redux';
import { IntlActions } from 'react-redux-multilingual';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import TranslateIcon from '@material-ui/icons/Translate';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

export default function LanguageButton(props) {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        var locale = event.currentTarget.dataset.lang;
        var language = props.Intl.languagesOnSite.filter(lang => lang.value === locale);
        if (language.length > 0 & locale != props.Intl.locale) {
            props.history.push("/" + locale);
            dispatch(IntlActions.setLocale(locale));
        }
        setAnchorEl(null);
    };

    var language = [];
    if (props.Intl.languagesOnSite.length > 2) {
        language = props.Intl.languagesOnSite.filter(lang => { if (lang.value === props.Intl.locale) return lang });
    } else {
        language = props.Intl.languagesOnSite.filter(lang => { if (lang.value != props.Intl.locale) return lang });
    }

    return (
        <React.Fragment>

            {props.Intl.languagesOnSite.length > 2 ? <div className="d-flex justify-content-start align-items-center">
                <TranslateIcon className="actionsHeaderIcon changeLangIcon" />
                <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                    {language[0].label}
                    <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                </Button>
                <Menu
                    id="fade-menu-language"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}>
                    {props.Intl.languagesOnSite.map(res =>
                        <MenuItem key={res.value} data-lang={res.value} onClick={handleClose}>{res.label}</MenuItem>)}
                </Menu>
            </div> :
                props.Intl.languagesOnSite.length == 2 ?
                    <div className="d-flex justify-content-start">
                        <TranslateIcon className="actionsHeaderIcon changeLangIcon" />
                        <div>
                            <IconButton data-lang={language[0].value} onClick={handleClose}>
                                {language[0].label}
                            </IconButton>
                        </div>
                    </div> : null}
        </React.Fragment>
    );
}