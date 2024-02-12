import styled from "styled-components"
import tw from "twin.macro"

export const Container = ({ children }: { children?: ChildrenType }) => (
  <Fluid className="chekout-wrapper">{children}</Fluid>
)

const Fluid = styled.div`
  ${tw`container `}
`
