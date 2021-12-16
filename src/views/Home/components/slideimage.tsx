import React, { useEffect, useCallback, useState } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'

export interface FarmsProps {
  tokenMode?: boolean
}

const SlideImage: React.FC<FarmsProps> = (farmsProps) => {
  

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 250,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    responsive: [
      
        {
        breakpoint: 1140,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <>
        
      
    <div className="grid  grid-cols-1 gap-20">
    <Slider  {...sliderSettings}>
          
          <div className='gap-20'>
            <img src="/images/3.png" className=" rounded-2xl " width='350' alt='1' />
          </div>
          <div>
            <img src="/images/2.png" className=" rounded-2xl " width='350' alt='1' />
          </div>
          <div>
            <img src="/images/1.png" className=" rounded-2xl"  width='350' alt='1' />
          </div>
          
         

    </Slider>

    </div>

    

    </>
  )
}

export default SlideImage
