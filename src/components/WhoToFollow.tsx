import { getRandomUsers } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

const WhoToFollow = async () => {

  const users = await getRandomUsers();
  if(!users) return null;
  if(users.length === 0) return null;
  return (
    <Card className="border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-[#222629] dark:text-white font-bold text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-[#61892F] to-[#86c232] rounded-full"></div>
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex gap-3 items-center justify-between p-3 bg-green-50/50 dark:bg-[#6b6e70]/20 rounded-lg border border-[#6b6e70]/30 dark:border-[#6b6e70]/30 hover:bg-green-100/50 dark:hover:bg-[#6b6e70]/30 transition-colors duration-200">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="w-12 h-12 ring-2 ring-[#6b6e70]/30 dark:ring-[#6b6e70]/70 ring-offset-1 ring-offset-background shadow-md">
                    <AvatarImage src={user.image ?? "/download.jpg"} className="object-cover" />
                  </Avatar>
                </Link>
                <div className="text-sm min-w-0 flex-1">
                  <Link href={`/profile/${user.username}`} className="font-semibold text-[#222629] dark:text-white hover:text-[#61892F] dark:hover:text-[#86c232] transition-colors duration-200 cursor-pointer block truncate">
                    {user.name}
                  </Link>
                  <p className="text-[#61892F] dark:text-[#86c232] font-medium truncate">@{user.username}</p>
                  <p className="text-[#6b6e70] dark:text-[#6b6e70] text-xs font-medium">{user._count.followers} followers</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <FollowButton userId={user.id} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhoToFollow
