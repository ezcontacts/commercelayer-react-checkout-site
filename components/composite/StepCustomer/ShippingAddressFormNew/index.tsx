import { Address } from "@commercelayer/sdk"
import { Fragment, KeyboardEvent } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AddressInputGroup } from "components/composite/StepCustomer/AddressInputGroup"

interface Props {
  shippingAddress: NullableType<Address>
}

const handleKeyboardEvent = (e: KeyboardEvent<HTMLInputElement>) =>
  ["e", "E", "=", "ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()

export const ShippingAddressFormNew: React.FC<Props> = ({
  shippingAddress,
}: Props) => {
  return (
    <Fragment>
      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="shipping_address_first_name"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.first_name || ""}
        />

        <AddressInputGroup
          required={true}
          fieldName="shipping_address_last_name"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.last_name || ""}
        />
      </Grid>

      <AddressInputGroup
        required={true}
        fieldName="shipping_address_line_1"
        resource="shipping_address"
        type="text"
        value={shippingAddress?.line_1 || ""}
      />

      <AddressInputGroup
        fieldName="shipping_address_line_2"
        resource="shipping_address"
        required={false}
        type="text"
        value={shippingAddress?.line_2 || ""}
      />

      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="shipping_address_city"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.city || ""}
          regex_pattern="^[a-zA-Z]+(?:\s[a-zA-Z]+)?$"
        />

        <AddressInputGroup
          required={true}
          fieldName="shipping_address_country_code"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.country_code || ""}
        />
      </Grid>

      <Grid>
        <AddressInputGroup
          required={true}
          fieldName="shipping_address_state_code"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.state_code || ""}
        />

        <AddressInputGroup
          required={true}
          fieldName="shipping_address_zip_code"
          resource="shipping_address"
          type="text"
          value={shippingAddress?.zip_code || ""}
          regex_pattern="^\d{5}(-?\d{4})?$"
          KeyDown={handleKeyboardEvent}
          title="Please enter valid 5-digit or 9-digit Zip Code"
        />
      </Grid>

      <AddressInputGroup
        required={true}
        fieldName="shipping_address_phone"
        resource="shipping_address"
        type="text"
        value={shippingAddress?.phone || ""}
        regex_pattern="^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x\/#]{1}(\d+))?\s*$"
        KeyDown={handleKeyboardEvent}
        title="Please Fill Valid Phone Number"
      />
    </Fragment>
  )
}

const Grid = styled.div`
  ${tw`grid lg:grid-cols-2 lg:gap-4`}
`
