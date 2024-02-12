import { Address, AddressField } from "@ezcontacts/react-components"
import { Address as AddressCollection } from "@commercelayer/sdk"
import { AppContext } from "components/data/AppProvider"
import { useContext } from "react"
interface AddressCardProps {
  addressType: "shipping" | "billing"
  addresses?: AddressCollection[]
  deselect: boolean
  onSelect?: (address: AddressCollection) => void
}

export const CustomerAddressCard: React.FC<AddressCardProps> = ({
  addressType,
  addresses,
  deselect,
  onSelect,
}) => {
  const dataTestId =
    addressType === "billing"
      ? "customer-billing-address"
      : "customer-shipping-address"
  const appCtx = useContext(AppContext)
  if (!appCtx) {
    return null
  }
  return (
    <Address
      data-testid={dataTestId}
      // addresses={addresses}
      className={`text-black p-3 rounded border ${
        onSelect && "hover:border-red-600 cursor-pointer"
      } transition duration-200 ease-in`}
      selectedClassName="!border-2 border-red-600 shadow-md bg-gray-50"
      deselect={deselect}
      onSelect={(address) =>{ 
        onSelect && onSelect(address as AddressCollection)
        if(addressType === 'billing'){
          localStorage.setItem(
            "save_billing_address_id",
            `${address.id}`
          )
        }
        if(addressType === 'shipping'){
          localStorage.setItem(
            "save_shipping_address_id",
            `${address.id}`
          )
        }


      }}
      disabledClassName="opacity-50 cursor-not-allowed"
    >
      {
        <AddressField>
          {({ address }) => (
            <>
            {/* {console.log(address)} */}
            <CustomAddress
              firstName={address.first_name}
              lastName={address.last_name}
              city={address.city}
              line1={address.line_1}
              line2={address.line_2}
              zipCode={address.zip_code}
              stateCode={address.state_code}
              countryCode={address.country_code}
              phone={address.phone}
              addressType={addressType}
              id={address.id}
            />
            </>
          )}
        </AddressField>
      }
    </Address>
  )
}

interface AddressProps {
  firstName: NullableType<string>
  lastName: NullableType<string>
  city: NullableType<string>
  line1: NullableType<string>
  line2: NullableType<string>
  zipCode: NullableType<string>
  stateCode: NullableType<string>
  countryCode: NullableType<string>
  phone: NullableType<string>
  addressType: NullableType<string>
  id:string | undefined
}

export const CustomAddress = ({
  firstName,
  lastName,
  city,
  line1,
  line2,
  zipCode,
  stateCode,
  countryCode,
  phone,
  addressType,
  id,
}: AddressProps) => (
  <div id={`${addressType}_${id}`}>
    <p className="font-bold text-md" data-testid={`fullname_${addressType}`}>
      {firstName} {lastName}
    </p>
    <p
      className="text-sm text-gray-500"
      data-testid={`full_address_${addressType}`}
    >
      {[line1, line2].join(", ")}
      <br />
      {zipCode} {city} - {stateCode} ({countryCode})
      <br />
      {phone}
    </p>
  </div>
)