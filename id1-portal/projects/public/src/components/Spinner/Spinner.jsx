import React from 'react';

export default function Spinner() {
    return (
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-border" style={{ color: "var(--theme-color)" }}>
            </div>
        </div>
    );
}