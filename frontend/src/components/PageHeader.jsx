import React from 'react'

const PageHeader = ({title, subtitle}) => {
  return (
    <div className='bg-white min-h-[6rem] rounded-t-2xl flex flex-col justify-center px-6 border-b-1 border-[#cecece]'>
        <h1 className='text-3xl text-black font-bold'>
            {title}
        </h1>
        <p className='text-gray-muted'>{subtitle}</p>
    </div>
  )
}

export default PageHeader
