import PaymentSource from "@ezcontacts/react-components/payment_source/PaymentSource"
import PaymentSourceBrandIcon from "@ezcontacts/react-components/payment_source/PaymentSourceBrandIcon"
import PaymentSourceBrandName from "@ezcontacts/react-components/payment_source/PaymentSourceBrandName"
import PaymentSourceDetail from "@ezcontacts/react-components/payment_source/PaymentSourceDetail"
import { useContext, useEffect, useState } from "react"
import { useTranslation, Trans } from "react-i18next"

import { OrderSummary } from "components/composite/OrderSummary"
import { PaymentContainer } from "components/composite/StepPayment/PaymentContainer"
import { AppContext } from "components/data/AppProvider"
import { Base } from "components/ui/Base"
import { Button } from "components/ui/Button"
import { CustomAddress } from "components/ui/CustomerAddressCard"
import { FlexContainer } from "components/ui/FlexContainer"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"
import { getTranslations } from "components/utils/payments"

import { CheckIcon } from "./CheckIcon"
import {
  AddressContainer,
  Bottom,
  Main,
  Recap,
  RecapBox,
  RecapCol,
  RecapCustomer,
  RecapItem,
  RecapItemDescription,
  RecapItemTitle,
  RecapSummary,
  RecapTitle,
  Title,
  Top,
  Text,
  Wrapper,
  WrapperButton,
} from "./styled"
import { SupportMessage } from "./SupportMessage"
import { goContinueShopping } from "components/utils/common"
import { saveUserActivitylogData } from "utils/useCustomLogData"
import OrderProcessLoading from "components/utils/orderProcessLoading"

interface Props {
  logoUrl?: string
  companyName: string
  supportEmail?: string
  supportPhone?: string
  orderNumber: number
}

export const StepComplete: React.FC<Props> = ({
  logoUrl,
  companyName,
  supportEmail,
  supportPhone,
  orderNumber,
}) => {
  const { t } = useTranslation()
  const ctx = useContext(AppContext)

  if (!ctx) return null
 // const productOrderId = localStorage?.getItem("productOrderId") || orderNumber
  const handleClick = () => {
    let requestBody = {
      requested_method: "Continue click",
      cl_token: ctx?.accessToken,
      requested_data: ctx.orderId,
      response_data: "OK",
    }
    saveUserActivitylogData(requestBody)
    ctx?.returnUrl && (document.location.href = ctx?.returnUrl)
  }

  return (
    <Base>
      <Top>
        <Wrapper>
          <div>
            <Logo
              logoUrl={logoUrl}
              companyName={companyName}
              className="mb-10 md:self-auto"
            />
          </div>
          <Main>
            <div className="p-8">
              <CheckIcon />
            </div>
            <Title>{t("stepComplete.title")}</Title>
            <Text
              data-testid="complete-checkout-summary"
              className="text-gray-400"
            >
              <Trans
                i18nKey={"stepComplete.description"}
                values={{ orderNumber: orderNumber }}
                components={{
                  WrapperOrderId: <strong className="text-black" />,
                }}
              />
            </Text>
            <SupportMessage
              supportEmail={supportEmail}
              supportPhone={supportPhone}
            />

            {ctx?.returnUrl && (
              <WrapperButton>
                <Button
                  data-testid="button-continue-to-shop"
                  onClick={handleClick}
                >
                  {t("stepComplete.continue")}
                </Button>

                {""}
              </WrapperButton>
            )}
          </Main>
        </Wrapper>
      </Top>
      <Bottom>
        <Wrapper>
          <Recap>
            <RecapSummary>
              <RecapTitle>{t("stepComplete.summary_title")}</RecapTitle>
              <OrderSummary appCtx={ctx} readonly />
            </RecapSummary>
            <RecapCustomer>
              <RecapTitle>{t("stepComplete.customer_title")}</RecapTitle>
              <RecapCol>
                <RecapItemTitle>{t("stepComplete.email")}</RecapItemTitle>
                <RecapItem>{ctx.emailAddress}</RecapItem>
              </RecapCol>
              <RecapCol>
                <AddressContainer className="lg:!grid-cols-1 xl:!grid-cols-2">
                  <div data-testid="billing-address-recap">
                    <RecapItemTitle>
                      {t("stepComplete.billed_to")}
                    </RecapItemTitle>
                    <RecapBox>
                      <CustomAddress
                        firstName={ctx.billingAddress?.first_name}
                        lastName={ctx.billingAddress?.last_name}
                        city={ctx.billingAddress?.city}
                        line1={ctx.billingAddress?.line_1}
                        line2={ctx.billingAddress?.line_2}
                        zipCode={ctx.billingAddress?.zip_code}
                        stateCode={ctx.billingAddress?.state_code}
                        countryCode={ctx.billingAddress?.country_code}
                        phone={ctx.billingAddress?.phone}
                        addressType="billing"
                        id={ctx.billingAddress?.id}
                      />
                    </RecapBox>
                  </div>
                  <>
                    {ctx.isShipmentRequired && (
                      <div data-testid="shipping-address-recap">
                        <RecapItemTitle>
                          {t("stepComplete.ship_to")}
                        </RecapItemTitle>
                        <RecapBox>
                          <CustomAddress
                            firstName={ctx.shippingAddress?.first_name}
                            lastName={ctx.shippingAddress?.last_name}
                            city={ctx.shippingAddress?.city}
                            line1={ctx.shippingAddress?.line_1}
                            line2={ctx.shippingAddress?.line_2}
                            zipCode={ctx.shippingAddress?.zip_code}
                            stateCode={ctx.shippingAddress?.state_code}
                            countryCode={ctx.shippingAddress?.country_code}
                            phone={ctx.shippingAddress?.phone}
                            addressType="shipping"
                            id={ctx.shippingAddress?.id}
                          />
                        </RecapBox>
                      </div>
                    )}
                  </>
                </AddressContainer>
              </RecapCol>

              <RecapCol data-testid="payment-recap">
                <RecapItemTitle>{t("stepComplete.payment")}</RecapItemTitle>
                {ctx.isPaymentRequired ? (
                  <RecapBox>
                    <FlexContainer className="font-bold text-md">
                      <PaymentContainer>
                        <PaymentSource readonly>
                          <PaymentSourceBrandIcon className="mr-2" />
                          <PaymentSourceBrandName className="mr-1">
                            {({ brand }) => {
                              if (ctx.isCreditCard) {
                                return (
                                  <Trans i18nKey="stepPayment.endingIn">
                                    {brand}
                                    <PaymentSourceDetail
                                      className="ml-1 font-normal"
                                      type="last4"
                                    />
                                  </Trans>
                                )
                              }
                              return <>{getTranslations(brand, t)}</>
                            }}
                          </PaymentSourceBrandName>
                        </PaymentSource>
                      </PaymentContainer>
                    </FlexContainer>
                  </RecapBox>
                ) : (
                  <RecapItemDescription>
                    {t("stepComplete.free_payment")}
                  </RecapItemDescription>
                )}
              </RecapCol>
            </RecapCustomer>
          </Recap>
          {/* <Footer /> */}
        </Wrapper>
      </Bottom>
    </Base>
  )
}
