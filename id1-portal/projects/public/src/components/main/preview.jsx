import React, { Component } from "react";
import { Helmet } from "react-helmet";
import MainPage from "./index.jsx"
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