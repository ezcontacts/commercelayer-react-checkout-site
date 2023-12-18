import { createInstance } from "@optimizely/react-sdk"

export const optimizely = createInstance({
  sdkKey: "QovWN9SQwD19hPLTsZr9f",
  datafileOptions: {
    updateInterval: 600000,
    autoUpdate: true,
    urlTemplate:
      "https://cdn.optimizely.com/datafiles/QovWN9SQwD19hPLTsZr9f.json",
  },
})
export default optimizely
