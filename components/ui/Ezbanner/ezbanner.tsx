import { AppContext } from "components/data/AppProvider"
import { useState, useEffect, useContext } from "react"
import { useSearchParams } from "react-router-dom"

export const Ezbanner: React.FC = () => {
  const ctx = useContext(AppContext)
  if (!ctx) {
    return null
  }
  const [showBanner, setShowBanner] = useState(true)
  const [searchParams] = useSearchParams()
  const islogged = searchParams.get("islogged")
  useEffect(() => {
    const bannerShownCheckout = localStorage.getItem("bannerShownCheckout")
    const checkoutUserEmail = localStorage.getItem("checkoutUserEmail")
    if (islogged !== "0") {
      if (ctx.emailAddress) {
        if (bannerShownCheckout && checkoutUserEmail === ctx.emailAddress) {
          setShowBanner(false)
        }
      }
    } else {
      if (bannerShownCheckout) {
        setShowBanner(false)
      }
    }
  }, [ctx.emailAddress, islogged])

  const handleCloseBanner = () => {
    localStorage.setItem("bannerShownCheckout", "true")
    localStorage.setItem("checkoutUserEmail", ctx.emailAddress || "")
    setShowBanner(false)
  }

  return (
    <>
    <div className="site-container">
      {showBanner && (
        <div
          className="flex items-center justify-between px-4 py-3 mb-4 text-white banner-background"
          role="alert"
        >
          <div>
            <strong className="text-xs">
              📣 We're upgrading this page to enhance your shopping experience.
            </strong>
            <span className="ml-1 text-xs">We hope you like it.</span>
          </div>
          <div className="cursor-pointer" onClick={handleCloseBanner}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="#bdd8e5"
            >
              <path
                d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z"
                fill="#bdd8e5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
                fill="#bdd8e5"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
