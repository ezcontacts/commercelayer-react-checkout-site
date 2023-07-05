import { NextPage } from "next"
import { useTranslation } from "react-i18next"

import { ErrorContainer } from "components/composite/ErrorContainer"
import { ErrorCode, Text } from "components/composite/ErrorContainer/styled"

const Invalid: NextPage = () => {
  const { t } = useTranslation()

  return (
    <ErrorContainer>
      <ErrorCode>404</ErrorCode>
      <Text data-testid="invalid-checkout">{t("general.invalid")}</Text>
      <span> Environment Variable: { process.env.NEXT_PUBLIC_API_URL } </span>
    </ErrorContainer>
  )
}

export default Invalid
