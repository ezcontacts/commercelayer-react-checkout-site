import styled from "styled-components"
import tw from "twin.macro"

export const Container = ({ children }: { children?: ChildrenType }) => (
  <Fluid>{children}</Fluid>
)

const Fluid = styled.div`
  ${tw`container `}
`
