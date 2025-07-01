import Link from "next/link"
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar"
import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user.action"

const Navbar = async () => {
    const user = await currentUser();
    if(user) await syncUser();
  return (
    <nav className="sticky top-0 w-full border-b border-[#6b6e70]/30 dark:border-[#6b6e70]/50 bg-white/80 dark:bg-[#222629]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#222629]/60 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Link href="/" className="group transition-all duration-300">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#222629] via-[#61892F] to-[#86c232] dark:from-white dark:via-[#86c232] dark:to-[#61892F] bg-clip-text text-transparent group-hover:from-[#61892F] group-hover:via-[#86c232] group-hover:to-[#61892F] dark:group-hover:from-[#86c232] dark:group-hover:via-[#61892F] dark:group-hover:to-[#86c232] transition-all duration-300 tracking-wide font-mono">
                            Socialure
                        </span>
                    </Link>
                </div>

                <DesktopNavbar />
                <MobileNavbar />
            </div>
        </div>
    </nav>
  )
}

export default Navbar