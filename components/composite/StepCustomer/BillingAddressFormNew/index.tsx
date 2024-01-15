import { Address } from "@commercelayer/sdk"
import { useContext, KeyboardEvent } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { ShippingToggleProps } from "components/composite/StepCustomer"
import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"
import { AppContext } from "components/data/AppProvider"

interface Props {
  billingAddress: NullableType<Address>
  openShippingAddress: (props: ShippingToggleProps) => void
}

export const BillingAddressFormNew: React.FC<Props> = ({
  billingAddress,
  openShippingAddress,
}: Props) => {
  const appCtx = useContext(AppContext)

  if (!appCtx) {
    return null
  }

  const { requiresBillingInfo } = appCtx

  const handleKeyboardEvent = (e: KeyboardEvent<HTMLInputElement>) =>
    ["e", "E", "+", "-", "ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()
  

  return (
    <Wrapper>
      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="billing_address_first_name"
          resource="billing_address"
          type="text"
          value={billingAddress?.first_name || ""}
        />
        <AddressInputGroup
          required={true}
          fieldName="billing_address_last_name"
          resource="billing_address"
          type="text"
          value={billingAddress?.last_name || ""}
        />
      </Grid>
      <AddressInputGroup
        required={true}
        fieldName="billing_address_line_1"
        resource="billing_address"
        type="text"
        value={billingAddress?.line_1 || ""}
      />
      <AddressInputGroup
        fieldName="billing_address_line_2"
        resource="billing_address"
        required={false}
        type="text"
        value={billingAddress?.line_2 || ""}
      />
      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="billing_address_city"
          resource="billing_address"
          type="text"
          value={billingAddress?.city || ""}
          regex_pattern="^[a-zA-Z]+$"
        />
        <AddressInputGroup
          required={true}
          fieldName="billing_address_country_code"
          resource="billing_address"
          type="text"
          openShippingAddress={openShippingAddress}
          value={billingAddress?.country_code || ""}
        />
      </Grid>
      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="billing_address_state_code"
          resource="billing_address"
          type="text"
          value={billingAddress?.state_code || ""}
        />
        <AddressInputGroup
          required={true}
          fieldName="billing_address_zip_code"
          resource="billing_address"
          type="text"
          value={billingAddress?.zip_code || ""}
          regex_pattern="^[0-9]+$"
          // KeyDown={handleKeyboardEvent}
          title="Please Fill Valid Zip Code"
        />
      </Grid>
      <AddressInputGroup
        required={true}
        fieldName="billing_address_phone"
        resource="billing_address"
        type="text"
        value={billingAddress?.phone || ""}
        regex_pattern="^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x\/#]{1}(\d+))?\s*$"
        KeyDown={handleKeyboardEvent}
        title="Please Fill Valid Phone Number"
      />
      {requiresBillingInfo && (
        <AddressInputGroup
          fieldName="billing_address_billing_info"
          resource="billing_address"
          type="text"
          value={billingAddress?.billing_info || ""}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`mt-0`}
`

const Grid = styled.div`
  ${tw`grid lg:grid-cols-2 lg:gap-4`}
`
