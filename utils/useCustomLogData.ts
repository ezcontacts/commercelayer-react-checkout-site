export const saveUserActivitylogData = async (request: any) => {
  var urlString = window?.location?.href
  var url = new URL(urlString)
  var queryParams = url?.searchParams
  var visitorId = queryParams?.get("ezref")
  const IP = localStorage.getItem("IP")
  let requestBody = {
    requested_method: request.requested_method,
    cl_token: request.cl_token,
    requested_data: request.requested_data,
    response_data: request.response_data,
    ip_address: IP || "",
    visitor_id: visitorId || "",
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
