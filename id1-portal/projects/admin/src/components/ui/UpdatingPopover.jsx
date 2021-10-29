import React, { forwardRef, useEffect } from 'react';
import { Popover } from 'react-bootstrap';

export const UpdatingPopover = forwardRef(
  ({ popper, children, show: _, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [children, popper]);

    return (
      <Popover ref={ref} content {...props}>
        {children}
      </Popover>
    );
  }
);
