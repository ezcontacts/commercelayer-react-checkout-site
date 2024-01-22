import { HiStar } from "react-icons/hi"
import { LiaStarSolid } from "react-icons/lia"

const Rating = ({rating}:{rating:string}) => {
  return (
    <div className='flex items-center p-1 text-white button-checkout text-[12px]'><HiStar/>{rating}</div>
  )
}

const ReviewSiteCard = ({logo,company,rating,reviews}:{logo:string,company:string,rating:string,reviews:string }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-1'>
      <img src={logo} alt={company} />
      <div className='flex items-center text-xs gap-1'>
        <Rating rating={rating}/>
        <div className='text-tundora-300 text-[13px]'>{`(${reviews} Reviews)`}</div>
      </div>
    </div>
  )
}


export const Divider = () => {
  return (
    <div className='hidden h-24 border-l-2 md:block'></div>
  )
}


const ReviewBanner = () => {
  return (
    <div className='review-banner'>
      <div className="site-container">
      <div className='font-bold uppercase review-banner-title'>
        <div className="review-banner-title-star a"><LiaStarSolid/></div>
        Customers love us
        <div className="review-banner-title-star b"><LiaStarSolid /></div>
      </div>
      <div className='review-banner-main'>
        <ReviewSiteCard logo="/img/ResellerRatings-logo-e1656963462806 1.svg" company={'Reseller Ratings'} rating="4.7/5" reviews="10,451"/>
        <Divider/>
        <ReviewSiteCard logo="/img/602e67f57b5b5700048a4ab0 1.svg" company={'Ratings.io'} rating="4.7/5" reviews="10,451"/>
        <Divider/>
        <ReviewSiteCard logo="/img/shopper-approved-logo-2 1.svg" company={'Shopper Approved'} rating="4.7/5" reviews="10,451"/>
        <Divider/>
        <ReviewSiteCard logo="/img/Trustpilot_logo 1.svg" company={'Trustpilot'} rating="4.7/5" reviews="10,451"/>
      </div>
      </div>
    </div>
  )
}

export default ReviewBanner