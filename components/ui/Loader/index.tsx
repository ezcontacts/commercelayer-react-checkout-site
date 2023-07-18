import React from "react"

const Loader = ({ isLoading }: any) => {
  console.log("isLoading", isLoading)
  return (
    <>
      {isLoading ? (
        <div className="loader">
          <div className="loader-inner" />
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default Loader
