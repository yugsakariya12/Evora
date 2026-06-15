"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import {BarLoader} from "react-spinners"
import { useStoreUser } from "@/app/hooks/use-store-user";
import { Building, Plus, Ticket } from "lucide-react";
import { useOnboarding } from "@/app/hooks/use-onboarding";
import OnboardingModal from "./onboarding-modal";
import SearchLocationBar from "./search-location-bar";
import UpgradeModal from "./upgrade-modal";
import { Badge } from "lucide-react";
import { Crown } from "lucide-react";



const Header = () => {

  const {showOnboarding,handleOnboardingComplete,handleOnboardingSkip}=useOnboarding()

const {has} =useAuth()
const hasPro=has?.({plan:"pro"})

const [showUpgradeModel,setshowUpgradeModel]=useState(false);
 const {isLoading}= useStoreUser()
  return (<>
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        bg-black/60
        backdrop-blur-xl
        border-b border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/final.png"
            alt="logo"
            width={500}
            height={500}
            className="h-11 w-auto"
          />

{hasPro && (
  <div className="ml-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
    <div className="flex h-4 w-4 items-center justify-center rounded bg-white/20">
      <Crown className="h-3 w-3" />
    </div>
    <span>Pro</span>
  </div>
)}



        </Link>


   <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
          </div>
        <div className="flex items-center gap-3">
            {!hasPro&&(<Button  variant={"ghost"} size="sm" onClick={()=>setshowUpgradeModel(true)} >Pricing</Button>)}


              <Button asChild className={"mr-2"} variant={"ghost"} size="sm" ><Link href="/explore">Explore</Link></Button>
          <SignedIn>
            <Button size="sm" asChild className="flex gap-2 mr-4 "><Link href="/create-event"><Plus className="w-4 h-4"/><span className="hidden sm:inline">Create Event</span></Link></Button>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link label="My Tickets" labelIcon={<Ticket size={16}/>}  href="/my-tickets"></UserButton.Link >
                <UserButton.Link label="My Events" labelIcon={<Building size={16} />} href="/my-events"></UserButton.Link>
                <UserButton.Action label="manageAccount"/>
              </UserButton.MenuItems>
            </UserButton>

          </SignedIn>

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </div>

 <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
        </div>

      {isLoading&&(<div className="absolute bottom-0 left-0 w-full" >
        <BarLoader width={"100%"} color="#a855f7"/>
      </div>)}
    </nav>

<OnboardingModal
isOpen={showOnboarding}
onClose={handleOnboardingSkip}
onComplete={handleOnboardingComplete}
/>

<UpgradeModal isOpen={showUpgradeModel}
onClose={()=>setshowUpgradeModel(false)}
trigger='header'

/>
  </>
  );
};

export default Header;
