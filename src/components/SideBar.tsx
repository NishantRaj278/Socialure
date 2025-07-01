import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUser } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

const SideBar = async () => {
    const authUser = await currentUser();
    if(!authUser) return <NotAuthenticatedUser />

    const user = await getUser(authUser.id);
    if(!user) return null;

  return (
    <div className="sticky top-20">
      <Card className="border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm hover:shadow-xl hover:shadow-[#61892F]/20 dark:hover:shadow-[#222629]/50 transition-all duration-500 group relative">
        {/* Elegant hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#61892F]/3 via-[#86c232]/3 to-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center group/profile transition-all duration-300"
            >
              <div className="relative">
                <Avatar className="w-20 h-20 ring-2 ring-slate-200/70 dark:ring-slate-600/70 ring-offset-2 ring-offset-background transition-all duration-300 group-hover/profile:ring-blue-300/80 dark:group-hover/profile:ring-blue-600/80 shadow-md hover:shadow-lg group-hover/profile:scale-105">
                  <AvatarImage src={user.image || "/avatar.png"} className="object-cover" />
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover/profile:text-blue-600 dark:group-hover/profile:text-blue-400 transition-colors duration-200">{user.name}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">@{user.username}</p>
              </div>
            </Link>

            {user.bio && (
              <div className="mt-4 p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/30 w-full">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div className="w-full">
              <Separator className="my-4 bg-slate-200/50 dark:bg-slate-700/50" />
              <div className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                <div className="text-center">
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{user._count.followers}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Followers</p>
                </div>
                <Separator orientation="vertical" className="bg-slate-300 dark:bg-slate-600 h-8" />
                <div className="text-center">
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{user._count.following}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Following</p>
                </div>
              </div>
              <Separator className="my-4 bg-slate-200/50 dark:bg-slate-700/50" />
            </div>

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center text-slate-600 dark:text-slate-400 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                <MapPinIcon className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">{user.location || "No location set"}</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                <LinkIcon className="w-4 h-4 mr-3 shrink-0 text-blue-600 dark:text-blue-400" />
                {user.website ? (
                  <a href={`${user.website}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 truncate font-medium" target="_blank">
                    {user.website}
                  </a>
                ) : (
                  <span className="font-medium">No website added</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const NotAuthenticatedUser = () => {
    return(
        <div className="sticky top-20">
          <Card className="border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm hover:shadow-xl hover:shadow-[#61892F]/20 dark:hover:shadow-[#222629]/50 transition-all duration-500 group relative">
            {/* Elegant hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#61892F]/3 via-[#86c232]/3 to-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
            
            <CardHeader className="relative z-10 text-center pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#222629] via-[#61892F] to-[#222629] dark:from-white dark:via-[#86c232] dark:to-white bg-clip-text text-transparent">Welcome to Socialure!</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-center space-y-4">
                <p className="text-[#6b6e70] dark:text-[#6b6e70] mb-6 font-medium leading-relaxed">
                  Join our community to share your thoughts, connect with others, and explore amazing content.
                </p>
                <div className="space-y-3">
                  <SignInButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#61892F]/90 hover:to-[#86c232]/90 text-white font-medium h-11 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full border border-[#6b6e70]/50 dark:border-[#6b6e70]/70 text-[#222629] dark:text-[#6b6e70] hover:text-[#61892F] dark:hover:text-[#86c232] hover:border-[#61892F]/50 dark:hover:border-[#86c232]/50 font-medium h-11 rounded-lg transition-all duration-200 hover:scale-105" variant="outline">
                      Create Account
                    </Button>
                  </SignUpButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    )
}

export default SideBar;