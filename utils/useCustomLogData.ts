export const saveUserActivitylogData = async (requestBody: any) => {
  console.log("requestBody", requestBody)

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/cl/saveClUserTempLogs`, {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result?.success) {
        const res = result?.data
        return res
      } else {
      }
    })
    .catch((error) => {
      console.log("error", error)
    })
}
