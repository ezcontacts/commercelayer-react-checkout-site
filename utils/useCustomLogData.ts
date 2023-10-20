export const saveUserActivitylogData = async (request: any) => {
  let requestBody = {
    requested_method: request.requested_method,
    cl_token: `eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRp`,
    requested_data: request.requested_data,
    response_data: request.response_data,
  }
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
