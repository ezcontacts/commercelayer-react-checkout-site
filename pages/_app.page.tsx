import type { AppProps } from "next/app"
import "../styles/globals.css"
import "../styles/ReviewBanner.css"
// eslint-disable-next-line import/order
import { appWithTranslation } from "next-i18next"
import { OptimizelyProvider } from "@optimizely/react-sdk"

import "components/data/i18n"
import { useEffect, useState } from "react"
import optimizelyConfig from "utils/optimizely"

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props
  const [browser, setBrowser] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") setBrowser(true)
  }, [])

  const user = {
    id: "user123",
    attributes: {
      server_ip: "172.20.21.147",
      country: "India",
      city: "Bengaluru",
      region: "Karnataka",
      country_code: "IN",
      postal_code: "560002",
      continent_code: "",
      os: "Linux",
      device: "Desktop",
      browser: "Chrome",
      browser_version: "108.0.0.0",
      Guest: "1",
    },
  }
  return browser ? (
    <OptimizelyProvider optimizely={optimizelyConfig} user={user}>
      <Component {...pageProps} />
    </OptimizelyProvider>
  ) : null
}

export default appWithTranslation(CheckoutApp)
