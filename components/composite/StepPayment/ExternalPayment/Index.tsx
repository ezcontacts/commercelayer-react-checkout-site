import { useState } from "react"
import { useContext } from "react"
import { AppContext } from "components/data/AppProvider"
import { Order } from "@commercelayer/sdk"
import { Button } from "components/ui/Button"
import { number as validate, cvv as cvvNumber } from "card-validator"

export const ExternalPaymentCard = ({ paymentToken }: any) => {
  const ctx = useContext(AppContext)

  const [cardNumberErrorMessage, setErrorMessage] = useState({
    message: "",
    isValid: true,
  }) as any

  const [cvverrorMessage, setcvverrorMessage] = useState({
    message: "",
    isValid: true,
  }) as any

  const [expireDateerrorMessage, setexpireDateerrorMessage] = useState({
    message: "",
    isValid: true,
  }) as any

  const [apiCardErrorMessage, setCardErrorMessage] = useState({
    isSuccess: true,
    message: "",
  })

  const [CardNumberonBlurShowError, setCardNumberonBlurShowError] =
    useState(false)

  const [cvvOnBlurShowError, setcvvOnBlurShowError] = useState(false)

  const [expiredateBlurShowError, setExpiredateBlurShowError] = useState(false)

  if (!ctx) return null
  const { getOrderFromRef } = ctx
  const [card, setCardDetails] = useState({
    cardNumber: "",
    expireDate: "",
    cvv: "",
    firstname: "",
    lastname: "",
  })

  const onKeyCardKeyDown = (e: any) => {
    if ([69, 187, 188, 189, 190].includes(e.keyCode)) {
      e.preventDefault()
    }
    console.log(e.keyCode)
  }

  const handlePlaceOrder = async (event: any) => {
    const order = await getOrderFromRef()
    if (order) {
      event.preventDefault()
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
            body: body,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            if (result) {
              window.location.reload()
            }
          })
          .catch((error) => {
            if (error)
              setCardErrorMessage({
                isSuccess: false,
                message: "Internal server error",
              })
          })
      }
    }
  }

  const getData = (order: Order) => {
    const cardNumber = card?.cardNumber?.split(" ").join("")

    if (cardNumber !== "" && card?.expireDate !== "" && card.cvv !== "") {
      if (ctx?.orderId) {
        const requestBody = {
          data: {
            card: {
              number: Number(cardNumber),
              expiration: card.expireDate,
              cvv: Number(card.cvv),
              firstname: card.firstname,
              lastname: card.lastname,
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
              return res
            } else {
              if (Number(card.cvv) === 0) {
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
            if (error)
              setCardErrorMessage({
                isSuccess: false,
                message: "Internal server error",
              })
          })
      }
    }
  }

  const onChangeCreditCardNumber = (event: any) => {
    const input = event.target.value
    const formattedInput = input.replace(/\s/g, "")

    // Validate input length
    if (formattedInput.length > 16) {
      return
    }

    // Validate numeric input
    if (!/^\d*$/.test(formattedInput)) {
      return
    }

    const formattedNumber = formattedInput.replace(/(\d{4})(?=\d)/g, "$1 ") // Add space after every 4 digits

    setCardDetails({
      ...card,
      cardNumber: formattedNumber,
    })

    const validationResult = validate(formattedInput)

    if (CardNumberonBlurShowError) {
      if (formattedInput) {
        let message = "Please enter a valid card number"
        if (formattedInput.length < 15) {
          message = "Please enter at least 15 digits."
        }
        setErrorMessage({
          message: message,
          isValid: validationResult.isValid,
        })
      } else {
        setErrorMessage({
          message: "",
          isValid: true,
        })
      }
    }
  }

  const onBlurCreditCardNumber = (event: any) => {
    const valArray = event.target.value.split(" ").join("").split("")
    if (valArray.length === 17) return

    const input = event.target.value
    // should accept only numeric values
    const formattedInput = input.replace(/\s/g, "")
    if (!/^\d*$/.test(formattedInput)) {
      return
    }

    const formattedNumber = event.target.value
      .replace(/\s/g, "") // Remove existing spaces
      .replace(/(\d{4})(?=\d)/g, "$1 ") // Add space after every 4 digits

    setCardDetails({
      ...card,
      cardNumber: formattedNumber,
    })

    const validationResult = validate(formattedNumber)

    if (event.target.value) {
      setCardNumberonBlurShowError(true)
      let message = "Please enter a valid card number"
      if (valArray.length < 15) {
        message = "Please enter at least 15 digits."
      }
      setErrorMessage({
        message: message,
        isValid: validationResult.isValid,
      })
    } else {
      setErrorMessage({
        message: "",
        isValid: true,
      })
    }
  }

  const onSelectCVVCardDetails = (event: any) => {
    const valArray = event.target.value.split(" ").join("").split("")
    if (valArray.length === 6) return
    const { name, value } = event.target
    setCardDetails({
      ...card,
      [name]: value,
    })
    const validationResult = cvvNumber(event.target.value, 4)
    if (cvvOnBlurShowError) {
      if (event.target.value) {
        let message = "Please enter a valid cvc"
        if (valArray.length < 4 || valArray.length > 4) {
          message =
            "Please enter the 3 or 4 digit security code from your card."
        }
        setcvverrorMessage({
          message: message,
          isValid: validationResult.isPotentiallyValid,
        })
      } else {
        setcvverrorMessage({
          message: "",
          isValid: true,
        })
      }
    }
  }

  const onBlurCVVCardDetails = (event: any) => {
    const valArray = event.target.value.split(" ").join("").split("")
    if (valArray.length === 5) return // Exit if CVV length is 4
    const { name, value } = event.target
    setCardDetails({
      ...card,
      [name]: value,
    })
    let isValid = true
    if (event.target.value) {
      let message = "Please enter a valid CVC"
      if (valArray.length !== 3 && valArray.length !== 4) {
        message = "Please enter the 3 or 4 digit security code from your card."
        isValid = false
      }
      setcvvOnBlurShowError(true)
      setcvverrorMessage({
        message: message,
        isValid: isValid,
      })
    } else {
      setcvverrorMessage({
        message: "",
        isValid: true,
      })
    }
  }

  const onSelectExporeDateCardDetails = (event: any) => {
    let { name, value } = event.target

    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, "")

    // Add leading zero if necessary
    if (value.length === 1 && parseInt(value) > 1) {
      value = "0" + value
    }

    // Insert a forward slash after the first two characters
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    setCardDetails({
      ...card,
      [name]: value,
    })

    let isValid = true
    if (expiredateBlurShowError) {
      if (value) {
        let message = "Please enter a valid expiry date"
        if (
          value === "0" ||
          value === "00" ||
          value === "00/0" ||
          value === "00/00"
        ) {
          message = "Please enter a valid expiry date"
          isValid = false
        }
        setcvvOnBlurShowError(true)
        setexpireDateerrorMessage({
          message: message,
          isValid: isValid,
        })
      } else {
        setexpireDateerrorMessage({
          message: "",
          isValid: true,
        })
      }
    }
  }

  const onBlurSelectExporeDateCardDetails = (event: any) => {
    let { name, value } = event.target

    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, "")

    // Add leading zero if necessary
    if (value.length === 1 && parseInt(value) > 1) {
      value = "0" + value
    }

    // Insert a forward slash after the first two characters
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    setCardDetails({
      ...card,
      [name]: value,
    })

    let isValid = true

    let message = "Please enter a valid expiry date"
    if (
      value === "0" ||
      value === "00" ||
      value === "00/0" ||
      value === "00/00"
    ) {
      message = "Please enter a valid expiry date"
      isValid = false
    }

    setExpiredateBlurShowError(true)
    setexpireDateerrorMessage({
      message: message,
      isValid: isValid,
    })
  }

  const formatExpirationDate = (date: any) => {
    let formattedDate = date.replace(/[^0-9]/g, "") // Remove any non-numeric characters

    if (formattedDate.length > 2) {
      formattedDate = formattedDate.slice(0, 2) + "/" + formattedDate.slice(2) // Insert a forward slash after the first two characters
    }

    return formattedDate
  }

  const onSelectCardNames = (event: any) => {
    const { name, value } = event.target
    setCardDetails({
      ...card,
      [name]: value,
    })
  }

  return (
    <>
      <div className="flex flex-wrap w-full p-5">
        {!apiCardErrorMessage.isSuccess && (
          <div className="w-full pb-2 text-red-400">
            {apiCardErrorMessage?.message}
          </div>
        )}

        <div className="w-full">
          <label className="relative w-full flex flex-col">
            <span className="font-semibold text-sm leading-5 text-gray-700 mb-3">
              Card number
            </span>
            <input
              className="rounded-md peer pl-12 pr-2 py-2 input-border placeholder-gray-300"
              type="text"
              name="cardNumber"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              value={card?.cardNumber}
              onChange={(event) => onChangeCreditCardNumber(event)}
              onBlur={(event) => onBlurCreditCardNumber(event)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </label>
        </div>

        {!cardNumberErrorMessage.isValid && (
          <div className="pt-5 pb-5 text-red-400">
            {(cardNumberErrorMessage.message as any) || ""}
          </div>
        )}

        <div className="flex gap-5 pt-5 pb-5">
          <div>
            <div>
              <label className="relative flex-1 flex flex-col">
                <span className="font-semibold text-sm leading-5 text-gray-700 mb-3">
                  Expiry date
                </span>
                <input
                  type="text"
                  name="expireDate"
                  className="rounded-md peer pl-12 pr-2 py-2 input-border placeholder-gray-300"
                  value={formatExpirationDate(card?.expireDate)}
                  onChange={onSelectExporeDateCardDetails}
                  onKeyDown={(event) =>
                    onBlurSelectExporeDateCardDetails(event)
                  }
                  maxLength={5}
                  placeholder="MM/YY"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
            </div>
            {!expireDateerrorMessage.isValid && (
              <div className="pt-2 pb-2 text-red-400">
                {(expireDateerrorMessage.message as any) || ""}
              </div>
            )}
          </div>
          <div>
            <div>
              <label className="relative flex-1 flex flex-col">
                <span className="flex items-center gap-3 mb-3 font-semibold text-sm leading-5 text-gray-700">
                  CVC/CVV
                  <span className="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </span>
                <input
                  className="rounded-md peer pl-12 pr-2 py-2 border-2 input-border  placeholder-gray-200"
                  type="number"
                  value={card?.cvv}
                  name="cvv"
                  placeholder="&bull;&bull;&bull;"
                  onChange={(event) => onSelectCVVCardDetails(event)}
                  onKeyDown={(event) => onKeyCardKeyDown(event)}
                  onBlur={(event) => onBlurCVVCardDetails(event)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </label>
            </div>
            {!cvverrorMessage.isValid && (
              <div className="pt-2 pb-2 text-red-400">
                {(cvverrorMessage.message as any) || ""}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-5 pt-5 pb-5 w-full">
          <div className="w-1/2">
            <div>
              <label className="relative flex-1 flex flex-col">
                <span className="font-semibold text-sm leading-5 text-gray-700 mb-3">
                  First name
                </span>
                <input
                  type="text"
                  name="firstname"
                  className="rounded-md peer pl-5 pr-2 py-2 input-border placeholder-gray-300"
                  value={card?.firstname}
                  onChange={(event) => onSelectCardNames(event)}
                  placeholder="First name"
                />
              </label>
            </div>
          </div>
          <div className="w-1/2">
            <div>
              <label className="relative flex-1 flex flex-col">
                <span className="flex items-center gap-3 mb-3 font-semibold text-sm leading-5 text-gray-700">
                  Last name
                </span>
                <input
                  className="rounded-md peer pl-5 pr-2 py-2 border-2 input-border  placeholder-gray-200"
                  type="text"
                  value={card?.lastname}
                  name="lastname"
                  placeholder="Last name"
                  onChange={(event) => onSelectCardNames(event)}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="btn-background"
        disabled={
          !expireDateerrorMessage.isValid ||
          !cardNumberErrorMessage.isValid ||
          !cvverrorMessage.isValid ||
          card?.cardNumber === "" ||
          card?.expireDate === "" ||
          card.cvv === ""
        }
        onClick={handlePlaceOrder}
      >
        {"PLACE ORDER"}
      </Button>
    </>
  )
}
