import ProductsList from "components/composite/ProductsList/ProductsList"
import { NextPage } from "next"
import { useTranslation } from "react-i18next"

const Products: NextPage = () => {
  return (
    <>
      <ProductsList />
    </>
  )
}

export default Products
