import { Base } from "components/ui/Base"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"

import { Wrapper, LogoWrapper, FullLogo, Main, Error } from "./styled"
import { Logo } from "components/ui/Logo"

export const ErrorContainer = ({ children }: { children: ChildrenType }) => {
  return (
    <Base>
      <Container>
        <Wrapper>
          <LogoWrapper>
            <Logo
              logoUrl={'/img/logo.svg'}
              companyName={'EzContacts'}
            />
          </LogoWrapper>
          <Main>
            {children}
          </Main>
        </Wrapper>
      </Container>
    </Base>
  )
}
