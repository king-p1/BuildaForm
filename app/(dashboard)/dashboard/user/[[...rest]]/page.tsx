// import { UserProfile } from '@clerk/nextjs'
// import React from 'react'

// const UserPage = () => {
//   return (
//     <div className='w-full justify-center items-center'>
//         <UserProfile
//           path="/dashboard/user"
          
//           routing="path"
//           appearance={{
//             elements: {
//               footer: "hidden"
//             },
//             variables:{colorPrimary:'#3371FF',
//               fontSize:'16px'
//             }
//           }}
//         />
//     </div>
//   )
// }

// export default UserPage
"use client"
import { UserProfile } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes' // Assuming you're using next-themes

const UserPage = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only run on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Define theme-based styles
  const themeAppearance = {
    variables: {
      colorBackground: resolvedTheme === 'dark' ? '#080808' : '#fefefe',
      colorText: resolvedTheme === 'dark' ? '#FFFFFF' :'#09090B',
      colorPrimary: resolvedTheme === 'dark' ? '#FFFFFF' :'#09090B', 

    },
    elements: {
      // footer: "hidden",
      card: resolvedTheme === 'dark' ? '#09090B' : '#ffffff',
      // Add other element customizations
      
    }
  }

  return (
    <div className='w-full '>
      <div className="flex justify-center items-center">

      {mounted && (
        <UserProfile
        routing="hash" // Or use path routing with a catch-all route
        appearance={themeAppearance}
        
        />
      )}
      </div>
    </div>
  )
}

export default UserPage