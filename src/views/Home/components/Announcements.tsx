import React from 'react'
import { Timeline } from 'react-twitter-widgets'

const Announcements = () => {
  return (
    <>
      <div className="text-2xl text-purple-900 mb-2 ">Announcements</div>

    <div className="rbs-card relative xxxl ">
      
           <Timeline
            dataSource={{
            sourceType: 'profile',
            screenName: 'robiniaswap',
          }}
          options={{
            height: '327',
            chrome: 'noheader, nofooter , transparent , noborders , noscrollbar',
            width: '100%',


          }

        }

        />
    </div>
    </>
  )
}

export default Announcements
