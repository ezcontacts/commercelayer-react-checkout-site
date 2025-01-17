import { useEffect } from "react"
import * as amplitude from "@amplitude/analytics-node"
import { track } from "@amplitude/analytics-node"
import { NextResponse } from "next/server"
const devplopment = "d9ae2cf47f40637fc9dff9e23d3ffc99"

const useAmplitude = (config = {}) => {
  useEffect(() => {
    amplitude.init(devplopment, {
      flushQueueSize: 50,
      flushIntervalMillis: 20000,
    })
  }, [devplopment, config])

  const logEvent = (eventName: any, properties: any) => {
    const countrname = localStorage.getItem("CountryName")
    track(eventName, undefined, {
      user_id: properties?.properties?.userId
        ? properties?.properties?.userId
        : "87897876757",
      country: countrname ? countrname : "USA",
      platform: "web",
    }).promise.then((result) => {
      debugger
      result.event // {...} (The final event object sent to Amplitude)
      result.code // 200 (The HTTP response status code of the request.
      result.message // "Event tracked successfully" (The response message)
    })
  }

  return { logEvent }
}

export default useAmplitude
