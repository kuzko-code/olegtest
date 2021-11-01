import React, { Suspense } from 'react';

export const getImportComponent = (props, path) => {

    console.log(path)
    const Component = path
        // ? (require(`../${path}`).default) || (() => <></>)
        ? (require(`../components/layouts/headers/template/dichromaticLimitedHeader.jsx`).default) || (() => <></>)
        // ? React.lazy(() =>
        //     import(`../${path}`)
        // )
        : () => <></>;

    return (
        <Suspense>
            <Component {...props} />
        </Suspense>
    );
};