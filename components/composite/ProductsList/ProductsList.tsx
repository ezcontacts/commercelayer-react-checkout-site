import {
  getAcesssToken,
  fetchAllProducts,
  createAnDraftEmptyOrder,
  addItemToCart,
} from "components/data/service"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const ProductsList = () => {
  const [orderId, setOrdeId] = useState("")
  const [accessToken, seaccessToken] = useState("")

  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [price, setPrice] = useState<any[]>([])

  useEffect(() => {
    getAcesssToken().then(async (accessToken) => {
      fetchAllProducts(accessToken).then(async (res) => {
        setProducts(res.data)
        setPrice(res.included)

        createAnDraftEmptyOrder(accessToken).then((orderResponse) => {
          sessionStorage.setItem("OrderId", orderResponse.data.id)
          sessionStorage.setItem("accessToken", accessToken)
          seaccessToken(accessToken)
          setOrdeId(orderResponse.data.id)
        })
      })
    })
  }, [])

  const addToCart = async (item: any) => {
    const accessTokenvalue = sessionStorage.getItem("accessToken")
    const OrderIdvalue = sessionStorage.getItem("OrderId")
    const itemAttribute = {
      quantity: 1,
      name: item?.attributes?.name,
      image_url: item?.attributes?.image_url,
      _update_quantity: true,
      sku_code: item?.attributes?.code,
      metadata: item?.attributes?.metadata,
    }

    addItemToCart(itemAttribute, accessTokenvalue, OrderIdvalue).then(() => {
      alert("item added")
    })
  }

  const RenderCartItems = () => {
    return (
      <div className="flex items-center space-x-5 pb-10  flex-wrap">
        {products.map((item, index) => {
          return (
            <div
              key={index}
              className="max-w-sm  m-6  bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col h-48 text-center space-y-5 items-center p-2">
                <div className="card-image-container">
                  <img src={item?.attributes?.image_url} />
                </div>
                <div>
                  <span>{item?.attributes?.name} </span>
                </div>
              </div>

              <div className="flex flex-col items-center pb-10">
                <div className="flex mt-4 space-x-3 md:mt-6">
                  <button
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const goToCart = () => {
    // navigate("/Cart/" + orderId + "?accessToken=" + accessToken)
    window.open(
      `http://localhost:3001/${orderId}?accessToken=${accessToken} &islogged=0`
    )
  }

  return (
    <div>
      <div className="pt-10 pb-10" style={{ margin: "0 auto", width: "85%" }}>
        <button
          type="button"
          onClick={goToCart}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Go to cart
        </button>
      </div>

      <div style={{ margin: "0 auto", width: "85%" }}>
        <RenderCartItems />
      </div>
    </div>
  )
}

export default ProductsList
