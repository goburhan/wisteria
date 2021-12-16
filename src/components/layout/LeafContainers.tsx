import React, { FC } from 'react'

const LeafContainers: FC = () => {
  return (
    <>
      <div
        style={{ width: 298, height: 116, position: 'fixed', top: 0, left: '0%' }}
        className="hidden md:block"
      >
        <img src="/images/top-leaf.svg" alt="leaf" />
      </div>

      <div
        style={{
          width: 201,
          height: 114,
          position: 'absolute',
          top: '45%',
          right: 0,
        }}
        className="square"
      >
        <img src="/images/butterfly.svg" alt="leaf" />
      </div>
    </>
  )
}

export default LeafContainers
