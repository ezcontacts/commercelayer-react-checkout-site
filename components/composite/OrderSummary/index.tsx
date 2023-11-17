import LineItemsContainer from "@ezcontacts/react-components/line_items/LineItemsContainer"
import LineItemsCount from "@ezcontacts/react-components/line_items/LineItemsCount"
import AdjustmentAmount from "@ezcontacts/react-components/orders/AdjustmentAmount"
import DiscountAmount from "@ezcontacts/react-components/orders/DiscountAmount"
import GiftCardAmount from "@ezcontacts/react-components/orders/GiftCardAmount"
import PaymentMethodAmount from "@ezcontacts/react-components/orders/PaymentMethodAmount"
import ShippingAmount from "@ezcontacts/react-components/orders/ShippingAmount"
import SubTotalAmount from "@ezcontacts/react-components/orders/SubTotalAmount"
import TaxesAmount from "@ezcontacts/react-components/orders/TaxesAmount"
import TotalAmount from "@ezcontacts/react-components/orders/TotalAmount"
import { Trans, useTranslation } from "react-i18next"

import { AppProviderData } from "components/data/AppProvider"
import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"

import { CouponOrGiftCard } from "./CouponOrGiftCard"
import { LineItemTypes } from "./LineItemTypes"

import {
  SummaryHeader,
  SummarySubTitle,
  SummaryTitle,
  AmountWrapper,
  TotalWrapper,
  AmountSpacer,
  RecapLine,
  RecapLineTotal,
  RecapLineItemTotal,
  RecapLineItem,
  Wrapper,
} from "./styled"
import { ContinueShopping } from "components/utils/common"

interface Props {
  appCtx: AppProviderData
  readonly?: boolean
}

export const OrderSummary: React.FC<Props> = ({ appCtx, readonly }) => {
  const { t } = useTranslation()
  const isTaxCalculated = appCtx.isShipmentRequired
    ? appCtx.hasBillingAddress &&
      appCtx.hasShippingAddress &&
      appCtx.hasShippingMethod
    : appCtx.hasBillingAddress

  const lineItems = !readonly ? (
    <SummaryHeader>
      <SummaryTitle data-testid="test-summary">
        {t("orderRecap.order_summary")}
      </SummaryTitle>
      <SummarySubTitle>
        <LineItemsCount
          data-testid="items-count"
          typeAccepted={LINE_ITEMS_SHOPPABLE}
        >
          {(props): JSX.Element => (
            <span data-testid="items-count">
              {t("orderRecap.cartContains", { count: props.quantity })}
            </span>
          )}
        </LineItemsCount>
      </SummarySubTitle>
    </SummaryHeader>
  ) : null
  return (
    <>
      <Wrapper data-testid="order-summary">
        <LineItemsContainer>
          <>
            {lineItems}
            {
              <>
                {LINE_ITEMS_SHOPPABLE.map((type) => (
                  <LineItemTypes type={type} key={type} />
                ))}
              </>
            }
          </>
        </LineItemsContainer>
        <TotalWrapper>
          <AmountWrapper>
            <div className="hidden">
              <CouponOrGiftCard
                readonly={readonly}
                setCouponOrGiftCard={appCtx.setCouponOrGiftCard}
              />
            </div>
            <RecapLine>
              <RecapLineItem>{t("orderRecap.Itemtotal")}</RecapLineItem>
              <SubTotalAmount className="font-normal text-sm leading-7 text-gray-400" />
            </RecapLine>
            <RecapLine>
              <DiscountAmount>
                {(props) => {
                  if (props.priceCents === 0) return <></>
                  return (
                    <>
                      <RecapLineItem>
                        {t("orderRecap.discount_amount")}
                      </RecapLineItem>
                      <div
                        className="font-normal text-sm leading-7 text-gray-400"
                        data-test-id="discount-amount"
                      >
                        {props.price}
                      </div>
                    </>
                  )
                }}
              </DiscountAmount>
            </RecapLine>
            <RecapLine>
              <AdjustmentAmount>
                {(props) => {
                  if (props.priceCents === 0) return <></>
                  return (
                    <>
                      <RecapLineItem>
                        {t("orderRecap.adjustment_amount")}
                      </RecapLineItem>
                      <div
                        className="font-normal text-sm leading-7 text-gray-400"
                        data-test-id="adjustment-amount"
                      >
                        {props.price}
                      </div>
                    </>
                  )
                }}
              </AdjustmentAmount>
            </RecapLine>
            <RecapLine>
              <ShippingAmount>
                {(props) => {
                  if (!appCtx.isShipmentRequired) return <></>
                  return (
                    <>
                      <RecapLineItem>
                        {t("orderRecap.shipping_amount")}
                      </RecapLineItem>
                      <div
                        className="font-normal text-sm leading-7 text-gray-400"
                        data-test-id="shipping-amount"
                      >
                        {!appCtx.hasShippingMethod
                          ? t("orderRecap.notSet")
                          : props.priceCents === 0
                          ? t("general.free")
                          : props.price}
                      </div>
                    </>
                  )
                }}
              </ShippingAmount>
            </RecapLine>
            <RecapLine data-test-id="payment-method-amount">
              <PaymentMethodAmount>
                {(props) => {
                  if (props.priceCents === 0) return <></>
                  return (
                    <>
                      <RecapLineItem>
                        {t("orderRecap.payment_method_amount")}
                      </RecapLineItem>
                      {props.price}
                    </>
                  )
                }}
              </PaymentMethodAmount>
            </RecapLine>
            <RecapLine>
              <TaxesAmount>
                {(props) => {
                  return (
                    <>
                      <RecapLineItem>
                        <Trans
                          i18nKey={
                            isTaxCalculated && appCtx.taxIncluded
                              ? "orderRecap.tax_included_amount"
                              : "orderRecap.tax_amount"
                          }
                          components={
                            isTaxCalculated
                              ? {
                                  style: (
                                    <span
                                      className={
                                        appCtx.taxIncluded
                                          ? "text-gray-500 font-normal"
                                          : ""
                                      }
                                    />
                                  ),
                                }
                              : {}
                          }
                        />
                      </RecapLineItem>
                      <div
                        className="font-normal text-sm leading-7 text-gray-400"
                        data-test-id="tax-amount"
                      >
                        {isTaxCalculated ? props.price : t("orderRecap.notSet")}
                      </div>
                    </>
                  )
                }}
              </TaxesAmount>
            </RecapLine>

            <GiftCardAmount>
              {(props) => {
                if (props.priceCents === 0) return <></>
                return (
                  <>
                    <RecapLineItem>
                      {t("orderRecap.giftcard_amount")}
                    </RecapLineItem>
                    <div
                      className="font-normal text-sm leading-7 text-gray-400"
                      data-test-id="giftcard-amount"
                    >
                      {props.price}
                    </div>
                  </>
                )
              }}
            </GiftCardAmount>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div className="flex items-center justify-between">
              <RecapLineItemTotal>
                {t("orderRecap.Subtotal")}
              </RecapLineItemTotal>
              <TotalAmount
                data-test-id="total-amount"
                className="text-sm font-semibold leading-7 text-gray-700"
              />
            </div>

            {/* <ReturnToCart cartUrl={appCtx.cartUrl} /> */}
          </AmountWrapper>
        </TotalWrapper>
        <div className="pl-7 pt-2">
          <ContinueShopping />
        </div>
      </Wrapper>
    </>
  )
}
