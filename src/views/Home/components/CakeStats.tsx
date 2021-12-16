import React from 'react'
import Slider from 'react-slick'

const TopSliderCard = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 750,
    autoplaySpeed: 5000,
    arrows: false,
  }

  return (
    <div className="ml-20 h-full relative" style={{ minHeight: 400 , minWidth:350 }}>
    
          <img src="/images/image-1.png" alt="trend-up" width="498,19"  />
    
      
    </div>
  )
}

export default TopSliderCard
