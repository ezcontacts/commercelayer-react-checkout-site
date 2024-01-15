import { OptimizelyContext } from "@optimizely/react-sdk"
import { useContext, useState, useEffect } from "react"

const useLogMetricsData = () => {
  const { optimizely } = useContext(OptimizelyContext)
  const [decision, setDecision] = useState(false)
  useEffect(() => {
    if (optimizely) {
      const result = optimizely.decide("commerce_layer")
      if (result) {
        setDecision(result.enabled)
      }
    }
  }, [optimizely])

  const logMetrics = (event: string) => {
    console.log("logMetrics", event)
    if (decision) {
      console.log("decision", decision)
      // No need to use onReady before track
      optimizely?.track(event)
    }
  }

  return { logMetrics }
}

export default useLogMetricsData
