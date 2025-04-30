import React, { Suspense } from 'react'
import { BarLoader } from "react-spinners"
const Layout = ({children}) => {
  return (
    <div className='px-5'> 
        <div className='flex items-center justify-between mb-5'>
            <h1 className='text-6xl font-bold gradient-title'>Industry Insights</h1>
        </div>
        <Suspense
                    fallback={
                    // <BarLoader className='mt-4' width={"100%"} color='gray'/>
                    <div className="text-center text-gray-500 align-middle min-h-screen flex flex-col justify-center items-center">
                    <p className="text-lg">Building Your Customized Dashboard...</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mx-auto mt-4"></div> {/* Simple spinner */}
                  </div>
                  }
                >
                  {children}
                </Suspense>
    </div>
  )
}

export default Layout
