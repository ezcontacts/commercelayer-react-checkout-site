import { PaymentMethodsContainer } from "@ezcontacts/react-components"
import { useTranslation } from "react-i18next"
import { useContext } from "react"
import { AppContext } from "components/data/AppProvider"
import { GTMContext } from "components/data/GTMProvider"
import { useSearchParams } from "react-router-dom"
import { ExternalPaymentCard } from "../ExternalPayment/Index"
import useAmplitude from "utils/getAmplitude"

interface Props {
  children: JSX.Element[] | JSX.Element
}

export const PaymentContainer = ({ children }: Props) => {
  const [searchParams] = useSearchParams()
  const paymentToken = searchParams.get("paymentToken")
  const ctx = useContext(AppContext)
  const gtmCtx = useContext(GTMContext)
  const { logEvent } = useAmplitude()
  if (!ctx) return null

  const { t } = useTranslation()

  const checkoutReturnUrl = `${
    window.location.href.split("?")[0]
  }?paymentReturn=true`

  const onSelectPlaceOrder = () => {
    logEvent("cl_checkout_complete_click ", {
      buttonName: "Submit",
      properties: {
        userId: "manju45kk@gmail.com",
      },
    })
  }

  return (
    <PaymentMethodsContainer
      config={{
        checkoutComPayment: {
          success_url: checkoutReturnUrl,
          failure_url: checkoutReturnUrl,
          options: {
            style: {
              base: {
                padding: "10px",
                border: "1px solid #E6E7E7",
                borderRadius: "0.25rem",
                transition: "border 0.5s ease-out",
                fontSize: "16px",
              },
              valid: {
                color: "#1FDA8",
              },
              invalid: {
                color: "#FF656B",
              },
              placeholder: {
                base: {
                  color: "#DBDCDC",
                  fontFamily: "monospace",
                },
                focus: {
                  color: "#101111",
                },
              },
            },
          },
        },

        externalPayment: {
          show: true,
          payment_source_token: paymentToken || "",
          customComponent: () => {
            return (
              <>
                <div>
                  <ExternalPaymentCard
                    paymentToken={paymentToken}
                    onSelectPlaceOrder={onSelectPlaceOrder}
                  />
                </div>
              </>
            )
          },
        },
      }}
    >
      {children}
    </PaymentMethodsContainer>
  )
}
