import { Divide } from 'lucide-react'
import React, {Suspense} from 'react'

const mainLayout = ({children}) => {
  return (
    <div className="container mx-auto mt-24 mb-20">
                <Suspense
                    fallback={
                    // <BarLoader className='mt-4' width={"100%"} color='gray'/>
                    <div className="text-center text-gray-500 align-middle min-h-screen flex flex-col justify-center items-center">
                    <p className="text-lg">Loading your AI Learning Platform...</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mx-auto mt-4"></div> {/* Simple spinner */}
                  </div>
                  }
                >
                  {children}
                </Suspense>
    </div>
  )
}

export default mainLayout
