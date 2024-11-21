import React from 'react'
import { ModeToggle } from '../themes/theme-toggler'
import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import logo from '@/public/buildaform-1.png'
import Link from 'next/link'

// Add this import
import dynamic from 'next/dynamic'

// Create a client-side only version of the navbar content
const NavbarContent = () => {
  return (
    <div className="flex gap-3 items-center">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle/>
    </div>
  )
}

// Wrap the content with dynamic import and SSR disabled
const ClientNavbarContent = dynamic(() => Promise.resolve(NavbarContent), {
  ssr: false
})

export const Navbar = () => {
  return (
    <nav className='w-full p-3 flex items-center justify-between'>
      <Link href={'/'}>
        <Image alt='logo' src={logo} width={70} height={70}/>
      </Link>
      <ClientNavbarContent />
    </nav>
  )
}