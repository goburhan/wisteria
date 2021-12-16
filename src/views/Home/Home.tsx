import React from 'react'
import Page from 'components/layout/Page'
import Socials from 'components/Partials/Socials'
import Divider from 'views/Farms/components/Divider'
import TopSocials from 'components/Partials/TopSocial'
import FarmStakingCard from './components/FarmStakingCard'
import TopSliderCard from './components/TopSliderCard'
import CakeStats from './components/CakeStats'
import TopFarms from './components/TopFarms'
import Announcements from './components/Announcements'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../../style/slider-dots.css'
import TokensCard from './components/TokensCard'
import Benefits from './components/Benefits'
import Partners from './components/Partners'
import Sitestat from './components/Sitestat'
import SlideImage from './components/slideimage'
import Farmlist from './components/Farmlist'
import LaunchPools from './components/LaunchPools'

const Home: React.FC = () => {
  return (
    <Page>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-12 gap-8">
          
        <div className="col-span-12 ">
            <TopSocials />
          </div>
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
            <TopSliderCard />
          </div>
          <div className="col-span-12  sm:col-span-12 md:col-span-12 lg:col-span-6">
            <CakeStats />
          </div>
          
          <div className="col-span-12  mb-20">
            <SlideImage />
          </div>
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
            <Farmlist />
          </div>
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
            <Announcements />
          </div>
          
          <div className="col-span-12  sm:col-span-12 md:col-span-12 lg:col-span-8 lg:col-start-3">
            <FarmStakingCard />
          </div>
          <div className="col-span-12 mb-10 mt-10 col-start-0">
            <Benefits />
          </div>
          
          <div className="col-span-12  col-start-0">
          <Divider />
          </div>
          
          <div className="col-span-12 mb-16 col-start-0">
            <Partners />
          </div>
         
        </div>
      </div>
    </Page>
  )
}

export default Home
