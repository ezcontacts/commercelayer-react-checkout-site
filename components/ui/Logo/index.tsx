import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  logoUrl?: string
  companyName: string
  className?: string
}

export const Logo: React.FC<Props> = ({ logoUrl, companyName, className }) => {
  const goContinueShopping = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`
  }

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        onClick={goContinueShopping}
        alt={companyName}
        className={className}
      />
    )
  }
  return (
    <Label onClick={goContinueShopping} className={className}>
      {companyName}
    </Label>
  )
}

const Image = styled.img`
  ${tw`w-60 max-w-full mb-5 md:mb-10 cursor-pointer`}
`

const Label = styled.h1`
  ${tw`mb-5 md:mb-12 font-extrabold uppercase tracking-wide text-xl text-black cursor-pointer`}
`
