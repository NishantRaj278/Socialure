"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

function MobileNavbar() {

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2 text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-white/95 dark:bg-[#222629]/95 backdrop-blur-xl border-l border-[#6b6e70]/30 dark:border-[#6b6e70]/50">
          <SheetHeader className="border-b border-[#6b6e70]/30 dark:border-[#6b6e70]/50 pb-4">
            <SheetTitle className="text-[#222629] dark:text-white font-semibold text-lg">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-2 mt-6">
            <Button variant="ghost" className="flex items-center gap-3 justify-start text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg h-11 px-3 font-medium" asChild>
              <Link href="/" onClick={() => setShowMobileMenu(false)}>
                <HomeIcon className="w-5 h-5" />
                Home
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button variant="ghost" className="flex items-center gap-3 justify-start text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg h-11 px-3 font-medium" asChild>
                  <Link href="/notifications" onClick={() => setShowMobileMenu(false)}>
                    <BellIcon className="w-5 h-5" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg h-11 px-3 font-medium" asChild>
                  <Link href='/profile' onClick={() => setShowMobileMenu(false)}>
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                </Button>
                
                <div className="pt-4 border-t border-[#6b6e70]/30 dark:border-[#6b6e70]/50 mt-4">
                  <SignOutButton>
                    <Button variant="ghost" className="flex items-center gap-3 justify-start w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 rounded-lg h-11 px-3 font-medium">
                      <LogOutIcon className="w-5 h-5" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <div className="pt-4">
                <SignInButton mode="modal">
                  <Button className="w-full bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#86c232] hover:to-[#61892F] text-white font-medium h-11 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;