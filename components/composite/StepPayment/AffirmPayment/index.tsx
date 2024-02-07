import React, { useState , useContext} from 'react';
import Image from 'next/image';
import loader from 'public/img/loader.svg'
import affirmLogo from 'public/img/60x296-white.svg'
import { AppContext } from "components/data/AppProvider"
import { Order } from "@commercelayer/sdk"
import LoaderComponent from "components/utils/Loader"
import { saveUserActivitylogData } from "utils/useCustomLogData"
import useLogMetricsData from "utils/logClMetrics"
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AffirmPaymentProps {

}
// Define the functional component using TypeScript (TSX)
const AffirmPayment: React.FC<AffirmPaymentProps> = () => {
    var urlString = window?.location?.href
    var url = new URL(urlString)
    var queryParams = url?.searchParams
    var visitorId = queryParams?.get("ezref")
    const paymentToken = queryParams?.get("paymentToken")
    const { logMetrics } = useLogMetricsData()
    const ctx = useContext(AppContext);
    if (!ctx) return null
    const { getOrderFromRef } = ctx
    const [card, setCardDetails] = useState({
        cardNumber: "",
        expireDate: "",
        cvv: "",
        firstname: "",
        lastname: "",
      })
    const [isLoadingAffirm, setIsLoadingAffirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [apiCardErrorMessage, setCardErrorMessage] = useState({
      isSuccess: true,
      message: "",
    })
    const handleClick = () => {
    setIsLoadingAffirm(true);
    const itemsArray = ctx.order.line_items.filter((item: { sku_code: string; }) => item.sku_code !== null);
    const newArrayWithDefinedKeys = itemsArray.map((item:any) => ({
        display_name:item.metadata.skuDisplayName,
        sku: item.sku_code,
        unit_price: item.unit_amount_cents,
        qty: item.quantity,
        item_image_url: item.image_url,
        item_url:'https://odoo.ezcontacts.com'+item.metadata.product_url
    }));
    const checkoutObject = {
        merchant: {
            user_confirmation_url: "https://stage.checkout.ezcontacts.com/affirm/confirm",
            user_cancel_url: "https://stage.checkout.ezcontacts.com/affirm/cancel",
            user_confirmation_url_action: "POST",
            use_vcn: true,
            name: "EZ Contacts"
        },
        metadata: {
            shipping_type: ctx.shipments[0].shippingMethodName,
            mode: "modal"
        },
        items: newArrayWithDefinedKeys,
        order_id:ctx.orderId,
        shipping: {
            name: {
                full: ctx.order.shipping_address.full_name
            },
            address: {
                line1: ctx.order.shipping_address.line_1,
                line2: ctx.order.shipping_address.line_2,
                city: ctx.order.shipping_address.city,
                state: ctx.order.shipping_address.state_code,
                zipcode: ctx.order.shipping_address.zip_code,
                country: "USA"
            },
            email: ctx.emailAddress
        },
        billing: {
            name: {
                full: ctx.order.billing_address.full_name
            },
            address: {
                line1: ctx.order.billing_address.line_1,
                line2: ctx.order.billing_address.line_2,
                city: ctx.order.billing_address.city,
                state: ctx.order.billing_address.state_code,
                zipcode: ctx.order.billing_address.zip_code,
                country: "USA"
            },
            email: ctx.emailAddress
        },
        total: ctx.order.total_amount_with_taxes_cents,
        discount: 0,
        subtotal: ctx.order.subtotal_taxable_amount_cents,
        shipping_amount: ctx.order.shipping_taxable_amount_cents,
        tax_amount: ctx.order.total_tax_amount_cents,
        currency: "USD",
    };

    console.log(checkoutObject);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      affirm.checkout.open_vcn({
        success: async function(card_checkout: any) {
           console.log(card_checkout);
           setIsLoadingAffirm(false);
           setIsLoading(true);
        const logData = (eventname: string, request: any, response: any) => {
            let requestBody = {
              requested_method: eventname,
              cl_token: ctx?.accessToken,
              requested_data: request,
              response_data: response,
            }
            saveUserActivitylogData(requestBody)
          }
        const getData = (order: Order) => {
            const externalPaymentTrigger:any = document.querySelector('.chekout-wrapper .right-content .payment[data-testid=external_payments]');
            if (externalPaymentTrigger) {
            externalPaymentTrigger.click();
            }
            if (card_checkout.number !== "" && card_checkout.expiration !== "" && card_checkout.cvv !== "") {
              try {
                if (ctx?.orderId) {
                  const requestBody = {
                    data: {
                      card: {
                        number: Number(card_checkout.number),
                        expiration: card_checkout.expiration.substring(2,0) +'/'+card_checkout.expiration.substring(2),
                        cvv: Number(card_checkout.cvv)
                      },
                      order: {
                        id: ctx?.orderId,
                        attributes: order,
                      },
                      customer: {
                        email: ctx?.emailAddress,
                      },
                      attributes: {
                        payment_source_token: paymentToken,
                      },
                      visitor_id: visitorId || "",
                    },
                  }
        
                  return fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/cl/order/payment/v1/create-authorization`,
                    {
                      headers: {
                        Accept: "application/json",
                      },
                      method: "POST",
                      body: JSON.stringify(requestBody),
                    }
                  )
                    .then((response) => response.json())
                    .then((result) => {
                      if (result?.success) {
                        const res = result?.data?.payment_source_token
                        logData("onCreate-authorization", requestBody, result?.success)
                        return res
                      } else {
                        logMetrics("order_completion_failed")
                        logData("onCreate-authorization", requestBody, result)
                        setIsLoading(false)
                        if (Number(card_checkout.cvv) === 0) {
                          setCardErrorMessage({
                            isSuccess: false,
                            message: "Please enter a valid cvc.",
                          })
                        } else {
                          setCardErrorMessage({
                            isSuccess: false,
                            message: result?.data?.error?.message?.replace(
                              /\d|\(|\)/g,
                              ""
                            ),
                          })
                        }
                      }
                    })
                    .catch((error) => {
                      logMetrics("order_completion_failed")
                      if (error) setIsLoading(false)
                      setCardErrorMessage({
                        isSuccess: false,
                        message: "Unable to process the payment, please try again",
                      })
                      logData("onCreate-authorization", requestBody, error)
                    })
                    .finally(() => {
                      // setIsLoading(false)
                    })
                }
              } catch (e) {
                console.log(e)
              }
            }
          }

          const order = await getOrderFromRef()
          if (order) {
            const response = await getData(order)
            if (response) {
                const body = JSON.stringify({
                data: {
                    type: "orders",
                    id: ctx.orderId,
                    attributes: {
                    _place: true,
                    },
                },
                })

                fetch(
                `${process.env.NEXT_PUBLIC_CL_URL_PATH}/api/orders/${ctx.orderId}`,
                {
                    method: "PATCH",
                    headers: {
                    Accept: "application/vnd.api+json",
                    Authorization: `Bearer ${ctx.accessToken}`,
                    "Content-Type": "application/vnd.api+json",
                    },
                    body,
                }
                )
                .then((response) => response.json())
                .then((result) => {
                    if (result) {
                    logMetrics("order_completion_success")
                    logData(
                        "handlePlaceOrder-success-response",
                        { "orderId-": ctx.orderId },
                        result
                    )
                    console.log(Date.now(), "InTime")
                    if (ctx?.orderId) {
                        const requestBody = {
                        cl_order_id: ctx?.orderId,
                        visitor_id: visitorId ? visitorId : "",
                        checkout_token:card_checkout.checkout_token ? card_checkout.checkout_token : "",
                        }
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cl/order/reserve`, {
                        headers: {
                            Accept: "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(requestBody),
                        })
                        .then((response) => response.json())
                        .then((result) => {
                            console.log(Date.now(), "outTime")
                            localStorage.removeItem("productOrderId")
                            const res = result?.data?.order_id
                            if (res) {
                            localStorage.setItem("productOrderId", res)
                            }
                            window.location.reload()
                        })
                        .catch((error) => {
                            console.log(Date.now(), "error")
                            console.error("Error:", error)
                            window.location.reload()
                        })
                    }
                    }
                })
                .catch((error) => {
                    if (error) setIsLoading(false)
                    logMetrics("order_completion_failed")
                    logData(
                    "handlePlaceOrder-error-response",
                    { "orderId-": ctx.orderId },
                    error
                    )
                    setCardErrorMessage({
                    isSuccess: false,
                    message: "Unable to process the payment, please try again",
                    })
                })
                .finally(() => {
                    // setIsLoading(false)
                })
            }
          }
            
        },
        error: function(error_response: any) {
          console.log(error_response);
          setIsLoadingAffirm(false);
        },
        onValidationError: function(checkout_validation_error: any) {
            console.log(checkout_validation_error);
            setIsLoadingAffirm(false);
        },
      checkout_data: checkoutObject
   });
  };
  if (isLoading) {
    return <LoaderComponent />
  }
  return (
    <>
    {isLoadingAffirm &&
    <div className="affirm_loader">
        <Image src={loader.src} width={loader.width} height={loader.height} alt="Loader"/>
    </div>
    }
    <div className='affirm-payment' onClick={handleClick}>
      <Image src={affirmLogo.src} width={affirmLogo.width} height={affirmLogo.height} alt="Affirm Payment"/>
    </div>
    {!apiCardErrorMessage.isSuccess && (
        <div className="w-full pb-2 text-red-400">
        {apiCardErrorMessage?.message}
        </div>
    )}
    </>
  );
};

export default AffirmPayment;