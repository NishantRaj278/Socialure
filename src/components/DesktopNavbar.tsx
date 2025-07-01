import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ModeToggle } from "./ModeToggle";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2 text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg font-medium" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2 text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg font-medium" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:bg-green-50 dark:hover:bg-[#61892F]/20 transition-all duration-200 rounded-lg font-medium" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#86c232] hover:to-[#61892F] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-lg">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
export default DesktopNavbar;