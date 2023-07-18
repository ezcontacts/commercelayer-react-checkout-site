import type { TErrorComponent } from "@commercelayer/react-components/errors/Errors"
import GiftCardOrCouponCode from "@commercelayer/react-components/gift_cards/GiftCardOrCouponCode"
import GiftCardOrCouponForm from "@commercelayer/react-components/gift_cards/GiftCardOrCouponForm"
import GiftCardOrCouponSubmit from "@commercelayer/react-components/gift_cards/GiftCardOrCouponSubmit"
import type { Order } from "@commercelayer/sdk"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  CouponFormWrapper,
  CouponFieldWrapper,
  CouponName,
  CouponRecap,
  StyledGiftCardOrCouponRemoveButton,
  StyledGiftCardOrCouponInput,
  StyledErrors,
} from "./styled"
import { CartCouponCodeParagrap } from "styles/Cart.styles"
import { AppContext } from "components/data/AppProvider"

interface Props {
  readonly?: boolean
  setCouponOrGiftCard: (order?: Order) => Promise<void>
}

export const CouponOrGiftCard: React.FC<Props> = ({
  readonly,
  setCouponOrGiftCard,
}) => {
  const { t } = useTranslation()
  const ctx = useContext(AppContext)

  if (!ctx) return null
  const { getOrderFromRef } = ctx
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get("accessToken")

  const [codeError, setCodeError] = useState(false)
  const [discountAmountcents, setDiscountAmountcents] = useState(0)
  const [isApplyClicked, setisApplyClicked] = useState(false)

  const removeCoupnCode = () => {
    const url = `https://ez-contacts.commercelayer.io/api/orders/${orderId}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,billing_address,shipments.available_shipping_methods,shipments.stock_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location,shipments.parcels.parcel_line_items,shipping_address`

    const payload = {
      data: {
        type: "orders",
        attributes: {
          coupon_code: "",
        },
        relationships: {},
        id: orderId,
      },
    }

    fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(async (data) => {
        const order = await getOrderFromRef()
        await setCouponOrGiftCard(order)
        setTimeout(() => {
          window.location.reload()
        }, 3000)

        return data
      })
      .catch((error) => {
        setTimeout(() => {
          window.location.reload()
        }, 3000)
        console.error(error)
      })
  }

  const handleSubmit = async (
    response: {
      success: boolean
      value?: string
      order?: Order
    },
    type?: any
  ) => {
    if (!response.success) {
      setTimeout(() => {
        window.location.reload()
      }, 3000)
      return setCodeError(response.value?.length !== 0)
    }
    await setCouponOrGiftCard(response.order)

    if (response.order?.discount_amount_cents === 0) {
      if (!isApplyClicked) {
        setisApplyClicked(true)
        removeCoupnCode()
        setDiscountAmountcents(response.order?.discount_amount_cents || 0)
      } else {
        setisApplyClicked(false)
        setDiscountAmountcents(response.order?.discount_amount_cents || 0)
      }
    } else {
      setisApplyClicked(false)
      setDiscountAmountcents(response.order?.discount_amount_cents || 0)
    }
    if (type === "remove") {
      setisApplyClicked(false)
    }

    return setCodeError(false)
  }

  const classError = codeError ? "hasError" : ""

  const messages: TErrorComponent["messages"] = [
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "gift_card_or_coupon_code",
      message: t("input.mustBeValidCouponOrGiftCard"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "coupon_code",
      message: t("input.mustBeValidCoupon"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "gift_card_code",
      message: t("input.mustBeValidGiftCard"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "orders",
      field: "customer_email",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "braintree_payments",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "adyen_payments",
      message: " ",
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "paypal_payments",
      message: " ",
    },
  ]

  return (
    <>
      <div>
        <div>
          <CartCouponCodeParagrap>{"Coupons"}</CartCouponCodeParagrap>
        </div>
        <div>
          {!readonly && (
            <GiftCardOrCouponForm
              onSubmit={(response) => handleSubmit(response, "apply")}
            >
              <CouponFormWrapper>
                <div className="w-full flex space-x-2 items-center">
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4L7 4C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z"
                        stroke="#4D4D4D"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 14.75L15 8.75"
                        stroke="#4D4D4D"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9945 14.75H15.0035"
                        stroke="#292D32"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.99451 9.25H9.00349"
                        stroke="#292D32"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="w-full">
                    <StyledGiftCardOrCouponInput
                      data-test-id="input_giftcard_coupon"
                      className={`form-input ${classError} border-none`}
                      required={false}
                      placeholderTranslation={(codeType) =>
                        t(`orderRecap.${codeType}`)
                      }
                    />
                  </div>
                  <div>
                    <GiftCardOrCouponSubmit
                      data-test-id="submit_giftcard_coupon"
                      label={t("general.apply")}
                      className={`font-normal text-xs leading-5 uppercase text-red-500`}
                    />
                  </div>
                </div>
                {isApplyClicked && discountAmountcents === 0 ? (
                  <div>
                    <span className="text-xs text-red-400">
                      {"Invalid Voucher/Promo Code!"}
                    </span>
                  </div>
                ) : (
                  <StyledErrors
                    data-test-id="discount-error"
                    resource="orders"
                    messages={messages}
                  />
                )}
              </CouponFormWrapper>
            </GiftCardOrCouponForm>
          )}

          {isApplyClicked && discountAmountcents === 0 ? (
            <div></div>
          ) : (
            <GiftCardOrCouponCode
              type="coupon"
              className="inline-flex items-center"
            >
              {(props) => {
                const { hide, code, ...p } = props

                if (isApplyClicked && discountAmountcents === 0) {
                  removeCoupnCode()
                }

                return hide ? null : (
                  <CouponRecap>
                    <div
                      data-testid="code-coupon"
                      className="w-full flex justify-between"
                    >
                      <CouponName>{code}</CouponName>
                      {!readonly && (
                        <StyledGiftCardOrCouponRemoveButton
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          onClick={(response) =>
                            handleSubmit(response, "remove")
                          }
                          data-testid="remove_coupon"
                          type="coupon"
                          label="Remove"
                          className="text-color"
                        />
                      )}
                    </div>
                  </CouponRecap>
                )
              }}
            </GiftCardOrCouponCode>
          )}

          <GiftCardOrCouponCode
            type="gift_card"
            className="inline-flex items-center text-sm font-medium"
          >
            {(props) => {
              const { hide, code, ...p } = props
              return hide ? null : (
                <CouponRecap>
                  <span data-testid="code-giftcard" {...p}>
                    {code}
                    {!readonly && (
                      <StyledGiftCardOrCouponRemoveButton
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onClick={handleSubmit}
                        data-testid="remove_giftcard"
                        type="gift_card"
                        className=""
                        label="Remove"
                      />
                    )}
                  </span>
                </CouponRecap>
              )
            }}
          </GiftCardOrCouponCode>
        </div>
      </div>
    </>
  )
}
