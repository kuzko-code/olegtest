import React from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import './Pagination.css'

const PaginationUI = ({ getLink, linkProps, ...props }) =>
    <div className="page-pagination">
        <Pagination
            renderItem={(item) => (
                <PaginationItem
                    component={Link}
                    to={getLink(item.page)}
                    {...item}
                    {...linkProps}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        item.onClick();
                    }}
                />)
            }
            {...props}
        />
    </div>;


PaginationUI.defaultProps = {
    getLink: (page) => `${window.location.pathname}?page=${page}`
};
export default PaginationUI;
