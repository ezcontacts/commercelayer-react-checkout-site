import CustomerContainer from "@ezcontacts/react-components/customers/CustomerContainer"
import OrderContainer from "@ezcontacts/react-components/orders/OrderContainer"
import PlaceOrderContainer from "@ezcontacts/react-components/orders/PlaceOrderContainer"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { CheckoutSkeleton } from "components/composite/CheckoutSkeleton"
import { MainHeader } from "components/composite/MainHeader"
import { OrderSummary } from "components/composite/OrderSummary"
import { StepComplete } from "components/composite/StepComplete"
import {
  StepCustomer,
  StepHeaderCustomer,
} from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import {
  StepPayment,
  StepHeaderPayment,
} from "components/composite/StepPayment"
import { PaymentContainer } from "components/composite/StepPayment/PaymentContainer"
import StepPlaceOrder from "components/composite/StepPlaceOrder"
import {
  StepShipping,
  StepHeaderShipping,
} from "components/composite/StepShipping"
import { AccordionProvider } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Accordion, AccordionItem } from "components/ui/Accordion"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"
import ReviewBanner from "../ReviewBanner"
import useAmplitude from "utils/getAmplitude"
import { saveUserActivitylogData } from "utils/useCustomLogData"

interface Props {
  logoUrl?: string
  orderNumber: number
  companyName: string
  supportEmail?: string
  supportPhone?: string
  termsUrl?: string
  privacyUrl?: string
}

const Checkout: React.FC<Props> = ({
  logoUrl,
  orderNumber,
  companyName,
  supportEmail,
  supportPhone,
  termsUrl,
  privacyUrl,
}) => {
  const [paymentType, setPaymentType] = useState("")
  const ctx = useContext(AppContext)
  const { logEvent } = useAmplitude()
  const { query } = useRouter()

  useEffect(() => {
    const storedCountryName = localStorage.getItem("CountryName")

    if (!storedCountryName) {
      // Fetch user's IP address from a service like ipify.org
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          const userIP = data.ip
          localStorage.setItem("IP", userIP)
          // Fetch country information from ipapi API
          fetch(`https://ipapi.co/${userIP}/json/`)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.country_name) {
                localStorage.setItem("CountryName", data.country_name)
              }
            })
            .catch((error) =>
              console.error("Error fetching country information:", error)
            )
        })
        .catch((error) => console.error("Error fetching user IP:", error))
    } else {
      // Country name is already in local storage
      // You might want to compare and update if necessary
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          const userIP = data.ip

          fetch(`https://ipapi.co/${userIP}/json/`)
            .then((response) => response.json())
            .then((data) => {
              if (
                data &&
                data.country_name &&
                data.country_name !== storedCountryName
              ) {
                localStorage.setItem("CountryName", data.country_name)
                logEvent("cl_checkout_view", {
                  buttonName: "Submit",
                  properties: {
                    userId: ctx?.emailAddress
                      ? ctx?.emailAddress
                      : "8363683783838",
                  },
                })
              }
            })
            .catch((error) =>
              console.error("Error fetching country information:", error)
            )
        })
        .catch((error) => console.error("Error fetching user IP:", error))
    }
    let requestBody = {
      requested_method: "View Checkout",
      cl_token: ctx?.accessToken,
      requested_data: { "orderId-": ctx?.orderId },
      response_data: "OK",
    }
    saveUserActivitylogData(requestBody)

    logEvent("cl_procceed_checkout_click", {
      buttonName: "Submit",
      properties: {
        userId: "8363683783838",
      },
    })
  }, [])

  let paypalPayerId = ""
  let checkoutComSession = ""
  let redirectResult = ""

  if (query.PayerID) {
    paypalPayerId = query.PayerID as string
  }

  if (query.redirectResult) {
    redirectResult = query.redirectResult as string
  }

  if (query["cko-session-id"]) {
    checkoutComSession = query["cko-session-id"] as string
  }

  const { activeStep, lastActivableStep, setActiveStep, steps } =
    useActiveStep()

  const getStepNumber = (stepName: SingleStepEnum) => {
    return steps.indexOf(stepName) + 1
  }

  if (!ctx || ctx.isFirstLoading) {
    return <CheckoutSkeleton />
  }

  const onSelectPayment = (name: any) => {
    setPaymentType(name)
  }
  const renderComplete = () => {
    return (
      <StepComplete
        logoUrl={logoUrl}
        companyName={companyName}
        supportEmail={supportEmail}
        supportPhone={supportPhone}
        orderNumber={orderNumber}
      />
    )
  }

  const renderSteps = () => {
    return (
      <CustomerContainer isGuest={ctx.isGuest}>
        <LayoutDefault
          aside={
            <Sidebar className="sidebar-border-right">
              <Logo
                logoUrl={logoUrl}
                companyName={companyName}
                className="hidden md:block"
              />
              <SummaryWrapper>
                <OrderSummary appCtx={ctx} />
              </SummaryWrapper>
              {/* <Footer /> */}
            </Sidebar>
          }
          main={
            <div>
              <Logo
                logoUrl={logoUrl}
                companyName={companyName}
                className="block md:hidden"
              />
              <MainHeader orderNumber={orderNumber} />
              <StepNav
                steps={steps}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                lastActivable={lastActivableStep}
              />
              <Accordion>
                <AccordionProvider
                  activeStep={activeStep}
                  lastActivableStep={lastActivableStep}
                  setActiveStep={setActiveStep}
                  step="Customer"
                  steps={steps}
                  isStepDone={ctx.hasShippingAddress && ctx.hasBillingAddress}
                >
                  <AccordionItem
                    index={1}
                    header={
                      <StepHeaderCustomer step={getStepNumber("Customer")} />
                    }
                  >
                    <StepCustomer className="mb-6" step={1} />
                  </AccordionItem>
                </AccordionProvider>
                <>
                  {ctx.isShipmentRequired && (
                    <AccordionProvider
                      activeStep={activeStep}
                      lastActivableStep={lastActivableStep}
                      setActiveStep={setActiveStep}
                      step="Shipping"
                      steps={steps}
                      isStepRequired={ctx.isShipmentRequired}
                      isStepDone={ctx.hasShippingMethod}
                    >
                      <AccordionItem
                        index={2}
                        header={
                          <StepHeaderShipping
                            step={getStepNumber("Shipping")}
                          />
                        }
                      >
                        <StepShipping className="mb-6" step={2} />
                      </AccordionItem>
                    </AccordionProvider>
                  )}
                </>
                <AccordionProvider
                  activeStep={activeStep}
                  lastActivableStep={lastActivableStep}
                  setActiveStep={setActiveStep}
                  step="Payment"
                  steps={steps}
                  isStepRequired={ctx.isPaymentRequired}
                  isStepDone={ctx.hasPaymentMethod}
                >
                  <PaymentContainer>
                    <PlaceOrderContainer
                      options={{
                        paypalPayerId,
                        checkoutCom: { session_id: checkoutComSession },
                        adyen: {
                          redirectResult,
                        },
                      }}
                    >
                      <AccordionItem
                        index={3}
                        header={
                          <StepHeaderPayment step={getStepNumber("Payment")} />
                        }
                      >
                        <div className="mb-6">
                          <StepPayment onSelectPayment={onSelectPayment} />
                        </div>
                        {paymentType !== "External Payment" ? (
                          <StepPlaceOrder
                            isActive={
                              activeStep === "Payment" ||
                              activeStep === "Complete"
                            }
                            termsUrl={termsUrl}
                            privacyUrl={privacyUrl}
                          />
                        ) : (
                          <div />
                        )}
                      </AccordionItem>
                    </PlaceOrderContainer>
                  </PaymentContainer>
                </AccordionProvider>
              </Accordion>
            </div>
          }
        />
      </CustomerContainer>
    )
  }

  return (
    <OrderContainer orderId={ctx.orderId} fetchOrder={ctx.getOrder as any}>
      {ctx.isComplete ? renderComplete() : renderSteps()}
      <ReviewBanner />
    </OrderContainer>
  )
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-20 lg:pr-10 lg:pt-10 xl:pl-48`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
export default Checkout
