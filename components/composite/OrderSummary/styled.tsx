import styled from "styled-components"
import tw from "twin.macro"

export const Wrapper = styled.div``
export const SummaryHeader = styled.div`
  ${tw`mb-5`}
`
export const SummaryTitle = styled.h2`
  ${tw`text-xl text-black font-semibold`}
`
export const SummarySubTitle = styled.p`
  ${tw`text-gray-400`}
`
export const TotalWrapper = styled.div`
  ${tw`flex flex-row`}
`
export const AmountWrapper = styled.div`
  ${tw`flex flex-col flex-1`}
`
export const AmountSpacer = styled.div`
  ${tw`hidden lg:flex lg:flex-85`}
`
export const RecapLine = styled.div`
  ${tw`flex flex-row justify-between py-0.5 text-black`}

  &:empty {
    ${tw`hidden`}
  }
`
export const RecapLineItem = styled.p`
  ${tw`font-normal text-sm leading-7 text-gray-400`}
`
export const RecapLineTotal = styled(RecapLine)`
  ${tw`border-t border-gray-400 mt-7 pt-6`}
`
export const RecapLineItemTotal = styled(RecapLineItem)`
  ${tw` font-semibold text-sm leading-7 text-gray-700`}
`
