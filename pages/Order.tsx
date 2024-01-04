import { NextPage } from "next"
import dynamic from "next/dynamic"

import CheckoutSkeleton from "components/composite/CheckoutSkeleton"
import { RetryError } from "components/composite/RetryError"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"

const DynamicCheckoutContainer: any = dynamic(
  () => import("components/composite/CheckoutContainer"),
  {
    loading: function LoadingSkeleton() {
      return <CheckoutSkeleton />
    },
  }
)
const DynamicCheckout: any = dynamic(
  () => import("components/composite/Checkout"),
  {
    loading: function LoadingSkeleton() {
      return <CheckoutSkeleton />
    },
  }
)

CheckoutSkeleton.displayName = "Skeleton Loader"

const Order: NextPage = () => {
  var urlString = window?.location?.href
  var url = new URL(urlString)
  var queryParams = url?.searchParams
  //To get the value of the parameter
  var itemOrderNumber = queryParams?.get("itemOrderNumber")
  const { settings, retryOnError, isLoading } = useSettingsOrInvalid()
  if (isLoading || (!settings && !retryOnError)) return <CheckoutSkeleton />

  if (!settings) {
    if (retryOnError) {
      return <RetryError />
    }
    return <RetryError />
  }

  return (
    <DynamicCheckoutContainer settings={settings}>
      <DynamicCheckout
        logoUrl={settings.logoUrl}
        orderNumber={itemOrderNumber}
        companyName={settings.companyName}
        supportEmail={settings.supportEmail}
        supportPhone={settings.supportPhone}
        termsUrl={settings.termsUrl}
        privacyUrl={settings.privacyUrl}
      />
    </DynamicCheckoutContainer>
  )
}

export default Order
