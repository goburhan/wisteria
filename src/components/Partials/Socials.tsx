import React from 'react'

const icons = [
 
   { name: 'twit',
   url:' https://twitter.com/robiniaswap'
},
  { name: 'steem',
    url:'https://steemit.com/@robinia/posts'
   },
  
]

const Socials = () => {
  return (
    <div className="flex items-center justify-start">
      <div className="dropdown  inline-block relative">
    <button type="submit" className=" font-semibold   rounded inline-flex items-center">
    <span>
    <a href="/" target="_blank" rel="noreferrer" className="socialbg primary  w-7 flex justify-center items-center rounded-xl mr-2 hover:opacity-80 shadow-sm">
            <img src="/images/telegram.svg" alt="gobr" style={{ marginRight:2 }} width="22px"/>
     </a>
    </span>
    </button>
    <div className="dropdown-content absolute hidden text-gray-700 pt-1">
      <a className="rounded-t bg-purple-300 hover:bg-purple-600 py-2 px-4 block whitespace-no-wrap" href="https://t.me/robiniakr">
      <div className='grid grid-cols-2 place-items-center gap-6'>
      <img src="/images/korea.svg" alt="koreanflag" style={{minWidth:20}}/>
      KR
      </div>
      
        </a>
      <a className="bg-purple-300 hover:bg-purple-600 py-2 px-4 block whitespace-no-wrap" href="https://t.me/officialrobinia">
      <div className='grid grid-cols-2 place-items-center gap-6'>
      <img src="/images/usa.png" alt="usaflag" style={{minWidth:20}}/>
      EN
      </div>
      </a>
          
    </div>
  </div>
  

      {icons.map((icon) => {
        return (
          <a href={icon.url} key={icon.name} target="_blank" rel="noreferrer" className="socialbg primary h-10 w-10 flex justify-center items-center rounded-xl mr-2 hover:opacity-80 shadow-sm">
            <img src={`/images/${icon.name}.svg`} alt={icon.name} width="22px"/>
          </a>
        )
      })}
      
    </div>
    
  )
}

export default Socials
