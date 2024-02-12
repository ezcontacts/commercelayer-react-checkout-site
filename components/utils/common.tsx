export const goContinueShopping = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`
}

export const ContinueShopping = () => {
  return (
    <div
      onClick={goContinueShopping}
      className="flex items-center justify-center cursor-pointer button-primary space-x-1 "
      className="flex items-center cursor-pointer space-x-1"
    >
      <div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.07996"
            stroke="#fff"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-sm font-normal cursor-pointer text-white-400 leading-5 hover:text-white-700">
        {"Continue shopping"}
      </div>
    </div>
  )
}
