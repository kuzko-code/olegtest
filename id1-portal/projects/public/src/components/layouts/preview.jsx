import React, { Component } from "react";
import { Helmet } from "react-helmet";
import MainPage from "../../pages/Main/index.jsx"
export class Preview extends Component {

  render() {
    return (
      <>
        <Helmet>

          <style rel>
            {
            `#body { pointer-events: none; }`
            }
          </style>
        </Helmet>
        <MainPage />
      </>
    );
  }
}
export default Preview;