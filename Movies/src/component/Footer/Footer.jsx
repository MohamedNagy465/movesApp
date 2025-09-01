import React from 'react'

export default function Footer() {
  return (
    <div className='bg-gray-900 text-white shadow-md '>
      <div className="container py-6">
        <p className="text-lg text-center ">
          © {new Date().getFullYear()} Mahmoud Nagi. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
