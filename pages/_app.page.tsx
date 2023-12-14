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

  return browser ? (
    <OptimizelyProvider optimizely={optimizelyConfig} userId="1235">
      <Component {...pageProps} />
    </OptimizelyProvider>
  ) : null
}

export default appWithTranslation(CheckoutApp)
