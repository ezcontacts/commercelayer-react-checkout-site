import { NextPage } from "next"
import { useTranslation } from "react-i18next"


import { ErrorContainer } from "components/composite/ErrorContainer"
import { ErrorCode, Text } from "components/composite/ErrorContainer/styled"
import { Button, ButtonWrapper } from "components/ui/Button"
import { WrapperButton } from "components/composite/StepComplete/styled"

const Invalid: NextPage = () => {
  const { t } = useTranslation()

  const handleGoBack = () => {
    window.history.back()
  }

  const handleClickContacts =() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/contact-lenses`
  }

  const handleClickSunglasses = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/sunglasses`
  }


  return (
    <ErrorContainer>
      <img className="four-zero-four-img" src="/img/404.svg" alt="404" />
      <div className="four-zero-four-main-text">Whoops, sorry about that!</div>
      <div className="four-zero-four-sub-text">It looks like the page you're looking for no longer exists.</div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className="btn-background four-zero-four-btn uppercase" onClick={handleClickContacts}>
          Shop contacts
        </button>
        <button className="btn-background four-zero-four-btn uppercase" onClick={handleClickSunglasses}>
          Shop Sunglasses 
        </button>
      </div>

    </ErrorContainer>
  )
}

export default Invalid
