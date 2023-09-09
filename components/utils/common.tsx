export const goContinueShopping = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_PROD_ODO_URL_PATH}`
}

export const ContinueShopping = () => {
  return (
    <div
      onClick={goContinueShopping}
      className="flex items-center space-x-1 cursor-pointer"
    >
      <div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.07996"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="font-normal text-sm leading-5 text-gray-400 cursor-pointer hover:text-gray-700">
        {"Continue shopping"}
      </div>
    </div>
  )
}
