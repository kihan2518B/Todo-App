import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

export default function Navbar() {
    return (
        <div className='w-full h-20 flex justify-center items-center bg-gray-900'>
            <div id='logo' className="w-full flex items-center justify-start pl-5">
                <Image
                    src={"/svg/logo-no-background.svg"}
                    alt='SR Industries'
                    width={100}
                    height={20}
                />
            </div>
            <div id="user-Icon" className='w-full flex items-center justify-end pr-5'>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </div>
    )
}
