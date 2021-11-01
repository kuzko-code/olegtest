import React from 'react'
import Sticky from 'react-sticky-el';
import RightPanel from "../rightPanel/index.jsx";

export const StickySidebar = (props) => {

    return  <Sticky
            topOffset={-50}
            stickyClassName={"sticky-block"}
            boundaryElement={props.boundaryElement}
            hideOnBoundaryHit={false}
        >
            <RightPanel />
        </Sticky>

}