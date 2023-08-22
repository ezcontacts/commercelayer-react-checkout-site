import { useEffect } from "react"
import * as amplitude from "@amplitude/analytics-node"
import { track } from "@amplitude/analytics-node"

const devplopment = "d9ae2cf47f40637fc9dff9e23d3ffc99"

const useAmplitude = (config = {}) => {
  useEffect(() => {
    amplitude.init(devplopment, {
      flushQueueSize: 50,
      flushIntervalMillis: 20000,
    })
  }, [devplopment, config])

  const logEvent = (eventName: any, properties = {}) => {
    track(eventName, undefined, {
      user_id: "manju@ezcontacts.com",
    })
  }

  return { logEvent }
}

export default useAmplitude
