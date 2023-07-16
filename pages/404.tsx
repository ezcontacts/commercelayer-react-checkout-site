import { NextPage } from "next"
import { useTranslation } from "react-i18next"


import { ErrorContainer } from "components/composite/ErrorContainer"
import { ErrorCode, Text } from "components/composite/ErrorContainer/styled"
import { Button, ButtonWrapper } from "components/ui/Button"
import { WrapperButton } from "components/composite/StepComplete/styled"

const Invalid: NextPage = () => {
  const { t } = useTranslation()


  return (
    <ErrorContainer>
      <img className="four-zero-four-img" src="/img/404.svg" alt="404" />
      <div className="four-zero-four-main-text">Whoops, sorry about that!</div>
      <div className="four-zero-four-sub-text">It looks like the page you're looking for no longer exists.</div>
      <button className="btn-background four-zero-four-btn" onClick={()=>alert('CONTINUE TO HOMEPAGE')}>
        CONTINUE TO HOMEPAGE
      </button>
    </ErrorContainer>
  )
}

export default Invalid
