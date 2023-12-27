import type { AppProps } from "next/app"
import "../styles/globals.css"
import "../styles/ReviewBanner.css"
import { useEffect, useState } from "react"
import { appWithTranslation } from "next-i18next"
import { OptimizelyProvider } from "@optimizely/react-sdk"
import "components/data/i18n"
import optimizelyConfig from "utils/optimizely"

const getIp = async () => {
  const response = await fetch("https://api.ipify.org?format=json")
  const data = await response.json()
  const userResponse = await fetch(`https://ipapi.co/${data.ip}/json`)
  const userData = await userResponse.json()
  localStorage.setItem("CountryName", userData.country_name)
  return {
    ip: data.ip,
    country: userData.country_name,
    city: userData.city,
    region: userData.region,
    country_code: userData.country_code,
    postal: userData.postal,
    continent_code: userData.continent_code,
  }
}

const createUser = async () => {
  var urlString = window?.location?.href
  var url = new URL(urlString)
  var queryParams = url?.searchParams
  var visitorId = queryParams?.get("ezref")

  const userLocation = await getIp()
  return {
    id: visitorId ? visitorId : "user123",
    attributes: {
      logged_in: "true",
      server_ip: userLocation.ip,
      country: userLocation.country,
      city: userLocation.city,
      region: userLocation.region,
      country_code: userLocation.country_code,
      postal_code: userLocation.postal,
      continent_code: userLocation.continent_code,
      os: "windows",
      device: "desktop",
      Guest: "1",
    },
  }
}

function CheckoutApp(props: AppProps) {
  const { Component, pageProps } = props
  const [browser, setBrowser] = useState(false)
  const [user, setUser] = useState(null) as any
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await createUser()
      setUser(userData)
      setBrowser(true)
    }

    if (typeof window !== "undefined") {
      fetchUser()
    }
  }, [])

  if (!browser || !user) {
    return null
  }

  console.log("user", user)

  return (
    <OptimizelyProvider optimizely={optimizelyConfig} user={user}>
      <Component {...pageProps} />
    </OptimizelyProvider>
  )
}

export default appWithTranslation(CheckoutApp)
