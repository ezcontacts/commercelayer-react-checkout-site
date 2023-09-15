import React from "react"
// import "./Loader.css" // Create a CSS file for styling

const LoaderComponent = () => (
  <div className="loader-container">
    <div className="loader-content">
      <div className="loader-spinner"></div>
      <div>{"Processing Please Wait ..."}</div>
      <div>
        {
          "We are processing your purchase, Please DO NOT Refresh this page. Once the transition is"
        }
      </div>
      <div>{"completed, you wil be emailed a receipt and redirected"}</div>
    </div>
  </div>
)

export default LoaderComponent
