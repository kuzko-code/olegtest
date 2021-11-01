import React from 'react';
import { Link } from 'react-router-dom';
import isExternal from 'is-url-external';

const CustomLink = ({ url, children, className, onClick, ariaLabel }) => {
    if (url && !isExternal(url)) {
        var n = url.indexOf(window.location.host);
        if (n != -1)
            url = url.substring(n + window.location.host.length, url.length);
    }

    return (
        url ?
            isExternal(url)
                ? <a
                    href={url}
                    className={className}
                    aria-label={ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClick}
                >
                    {children}
                </a> :
                <Link
                    key={url}
                    to={url}
                    className={className}
                    aria-label={ariaLabel}
                    onClick={onClick}
                >
                    {children}
                </Link> :
            <a
                className={className}
                aria-label={ariaLabel}
                onClick={onClick}
            >
                {children}
            </a>
    )
};

export default CustomLink;