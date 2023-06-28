const ORG_URL = "https://ez-contacts.commercelayer.io"
const CLIENT_ID = "G6_HdW__2kvm7XDT99lG538G9UqGfVV-Ucm0pvqqcjI"
const SCOPE = "market:12245"

export const getAcesssToken = async () => {
  const response = await fetch(`${ORG_URL}/oauth/token`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      scope: SCOPE,
    }),
  })
  const { access_token } = await response.json()
  return access_token
}

export const createAnDraftEmptyOrder = async (accessToken: any) => {
  const response = await fetch(`${ORG_URL}/api/orders`, {
    body: `{\n  "data": {\n    "type": "orders"\n    }\n}`,
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
    method: "POST",
  })
  // setOrderId(res.data.id)
  // sessionStorage.setItem("ORDER_ID", res.data.id)
  return await response.json()
}

export const getListOfCartItems = async (accessToken: any, orderId: any) => {
  const response = await fetch(`${ORG_URL}/api/orders/${orderId}/line_items`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
  })
  return await response.json()
}

export const fetchAllProducts = async (accessToken: any) => {
  const response = await fetch(
    `${ORG_URL}/api/skus?filter[q][code_in]=&include=prices`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return await response.json()
}

export const addItemToCart = async (
  itemAttribute: any,
  accessToken: any,
  orderId: any
) => {
  fetch(`${ORG_URL}/api/line_items`, {
    body: `{"data":{"type":"line_items","attributes":${JSON.stringify(
      itemAttribute
    )},"relationships":{"order":{"data":{"type":"orders","id":"${orderId}"}}}}}`,
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
    method: "POST",
  }).then((res) => {
    //   toast.success(`Item: ${item.code} added to cart`, {
    //     position: "bottom-left",
    //   });

    return res
  })
}

export const deleteCartItem = async (accessToken: any, itemId: any) => {
  fetch(`${ORG_URL}/api/line_items/${itemId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
  }).then(() => {
    return true
  })
}

export const getOrderDetails = async (accessToken: any, orderId: any) => {
  return await fetch(`${ORG_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.api+json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

export const updateItemQuantity = (
  lineItemId: any,
  quantity: any,
  access_token: any
) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/vnd.api+json",
  }
  const body = JSON.stringify({
    data: {
      type: "line_items",
      id: lineItemId,
      attributes: {
        quantity: quantity,
      },
    },
  })
  const url = `${ORG_URL}/api/line_items/${lineItemId}`

  return fetch(url, {
    method: "PATCH",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

export const applyCoupnCode = (
  orderId: any,
  coupon_code: any,
  access_token: any
) => {
  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/vnd.api+json",
  }
  const body = JSON.stringify({
    data: {
      type: "orders",
      id: orderId,
      attributes: {
        coupon_code: coupon_code,
      },
    },
  })
  const url = `${ORG_URL}/api/orders/${orderId}`

  return fetch(url, {
    method: "PATCH",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
}
