import "@adyen/adyen-web/dist/adyen.css"
import {
  PaymentSourceBrandName,
  PaymentSourceDetail,
  PaymentSource,
  PaymentSourceBrandIcon,
} from "@ezcontacts/react-components"
import { PaymentMethod as PaymentMethodType } from "@commercelayer/sdk"
import classNames from "classnames"
import { useContext, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { AccordionContext } from "components/data/AccordionProvider"
import { AppContext } from "components/data/AppProvider"
import { StepContainer } from "components/ui/StepContainer"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"
import { CheckoutCustomerPayment } from "./CheckoutCustomerPayment"
import { CheckoutPayment } from "./CheckoutPayment"
import { PaymentSkeleton } from "./PaymentSkeleton"
import useAmplitude from "utils/getAmplitude"
import useLogMetricsData from "utils/logClMetrics"

export type THandleClick = (params: {
  payment?: PaymentMethodType | Record<string, any>
  paymentSource?: Record<string, any>
}) => void

interface HeaderProps {
  className?: string
  step: number
  info?: string
}

export const StepHeaderPayment: React.FC<HeaderProps> = ({ step }) => {
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const { logEvent } = useAmplitude()
  if (!appCtx || !accordionCtx) {
    return null
  }

  const { hasPaymentMethod, isPaymentRequired, isCreditCard } = appCtx

  const { t } = useTranslation()

  useEffect(() => {
    logEvent("cl_checkout_step3_view", {
      buttonName: "Submit",
      properties: {
        userId: "manju45kk@gmail.com",
      },
    })
  }, [])

  const recapText = () => {
    if (!isPaymentRequired) {
      return t("stepPayment.notRequired")
    }
    if (!hasPaymentMethod || accordionCtx.status === "edit") {
      return t("stepPayment.methodUnselected")
    }

    return (
      <>
        <div className="flex">
          <PaymentSource readonly loader={<PaymentSkeleton />}>
            <PaymentSourceBrandIcon className="mr-2" />
            <PaymentSourceBrandName className="mr-1">
              {({ brand }) => {
                if (isCreditCard) {
                  return (
                    <Trans i18nKey="stepPayment.endingIn">
                      {brand}
                      <PaymentSourceDetail className="ml-1" type="last4" />
                    </Trans>
                  )
                }
                return <>{brand}</>
              }}
            </PaymentSourceBrandName>
          </PaymentSource>
        </div>
      </>
    )
  }

  return (
    <StepHeader
      stepNumber={step}
      status={accordionCtx.status}
      label={t("stepPayment.title")}
      info={recapText()}
      onEditRequest={accordionCtx.setStep}
    />
  )
}

interface PaymentHeaderProps {
  onSelectPayment?: any
}

export const StepPayment: React.FC<PaymentHeaderProps> = ({
  onSelectPayment,
}: any) => {
  const { logMetrics } = useLogMetricsData()

  const { logEvent } = useAmplitude()
  const appCtx = useContext(AppContext)
  const accordionCtx = useContext(AccordionContext)
  const [hasMultiplePaymentMethods, setHasMultiplePaymentMethods] =
    useState(false)
  const [autoSelected, setAutoselected] = useState(false)
  const [hasTitle, setHasTitle] = useState(true)

  const { t } = useTranslation()

  // if (!appCtx || !appCtx.hasShippingMethod) {
  // this exit on shippingMethod is causing an error in useEffect to enable button
  if (!appCtx || !accordionCtx) {
    return null
  }

  useEffect(() => {
    // If single payment methods and has multiple payment methods, we hide the label of the box
    if (autoSelected && hasMultiplePaymentMethods) {
      setHasTitle(false)
    }
  }, [autoSelected, hasMultiplePaymentMethods])

  const { isGuest, isPaymentRequired, setPayment } = appCtx

  const selectPayment: THandleClick = async ({ payment, paymentSource }) => {
    console.log("proceed_to_payment", "proceed_to_payment")
    logMetrics("proceed_to_payment")
    if (paymentSource?.payment_methods?.paymentMethods?.length > 1) {
      setHasMultiplePaymentMethods(true)
    }
    setPayment({ payment: payment as PaymentMethodType })

    onSelectPayment(payment?.name)
    logEvent("cl_checkout_step3_continue_click", {
      buttonName: "Submit",
      properties: {
        userId: "manju45kk@gmail.com",
      },
    })
  }

  const autoSelectCallback = async () => {
    setAutoselected(true)
  }

  return (
    <StepContainer
      className={classNames({
        current: accordionCtx.isActive,
        done: !accordionCtx.isActive,
      })}
    >
      <StepContent>
        <>
          {accordionCtx.isActive && (
            <div>
              {isPaymentRequired ? (
                isGuest ? (
                  <CheckoutPayment
                    selectPayment={selectPayment}
                    autoSelectCallback={autoSelectCallback}
                    hasTitle={hasTitle}
                  />
                ) : (
                  <CheckoutCustomerPayment
                    selectPayment={selectPayment}
                    autoSelectCallback={autoSelectCallback}
                    hasTitle={hasTitle}
                  />
                )
              ) : (
                <p className="text-sm text-gray-400">
                  {t("stepPayment.amountZero")}
                </p>
              )}
            </div>
          )}
        </>
      </StepContent>
    </StepContainer>
  )
}
