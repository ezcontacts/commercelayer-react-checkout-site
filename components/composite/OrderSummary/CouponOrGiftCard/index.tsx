import {
  GiftCardOrCouponCode,
  GiftCardOrCouponSubmit,
  GiftCardOrCouponForm,
} from "@ezcontacts/react-components"
import { useState } from "react"
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

interface Props {
  readonly?: boolean
  setCouponOrGiftCard: () => Promise<void>
}

export const CouponOrGiftCard: React.FC<Props> = ({
  readonly,
  setCouponOrGiftCard,
}) => {
  const { t } = useTranslation()
  const [couponCodeValue, setcouponCodeValue] = useState("")
  const [codeError, setCodeError] = useState(false)

  const handleSubmit = async (response: {
    success: boolean
    value?: string
  }) => {
    if (!response.success) {
      return setCodeError(response.value?.length !== 0)
    }
    await setCouponOrGiftCard()
    return setCodeError(false)
  }

  const classError = codeError ? "hasError" : ""

  const messages: any = [
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
        <CartCouponCodeParagrap>{"Coupons"}</CartCouponCodeParagrap>
      </div>
      <div>
        {!readonly && (
          <GiftCardOrCouponForm onSubmit={handleSubmit}>
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
                    onChange={(e) => setcouponCodeValue(e.target.value)}
                  />
                </div>
                <div>
                  <GiftCardOrCouponSubmit
                    data-test-id="submit_giftcard_coupon"
                    label={t("general.apply")}
                    // className={`w-auto -ml-px relative inline-flex items-center space-x-2 px-8 py-3 text-xs font-extrabold text-contrast bg-primary border border-transparent rounded-r-md hover:opacity-80 focus:outline-none`}
                    className={`font-normal text-xs leading-5 uppercase text-red-500 ${
                      couponCodeValue.trim() === ""
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  />
                </div>
              </div>
              <StyledErrors
                data-test-id="discount-error"
                resource="orders"
                messages={messages}
              />
            </CouponFormWrapper>
          </GiftCardOrCouponForm>
        )}

        <GiftCardOrCouponCode
          type="coupon"
          className="inline-flex items-center"
        >
          {(props): any => {
            const { hide, code, ...p } = props
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
                      onClick={(response) => handleSubmit(response)}
                      data-testid="remove_coupon"
                      type="coupon"
                      label="Remove"
                      className="text-color border-none"
                    />
                  )}
                </div>
              </CouponRecap>
            )
          }}
        </GiftCardOrCouponCode>

        {/* <GiftCardOrCouponCode
          type="gift_card"
          className="inline-flex items-center text-sm font-medium"
        >
          {(props): any => {
            const { hide, code, ...p } = props
            return hide ? null : (
              <CouponRecap>
                <span data-test-id="code-giftcard" {...p}>
                  {code}
                  {!readonly && (
                    <StyledGiftCardOrCouponRemoveButton
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      onClick={handleSubmit}
                      data-test-id="remove_giftcard"
                      type="gift_card"
                      className=""
                      label="Remove"
                    />
                  )}
                </span>
              </CouponRecap>
            )
          }}
        </GiftCardOrCouponCode> */}
      </div>
    </>
  )
}
