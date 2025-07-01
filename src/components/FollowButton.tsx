"use client"

import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button"
import { useState } from "react";
import { toggleFollow } from "@/actions/user.action";
import toast from "react-hot-toast";


const FollowButton = ({userId} : {userId: string}) => {
    const [isLoading, setisLoading] = useState(false);
    const handleFollow = async () => {
        try{
            setisLoading(true);
            await toggleFollow(userId);
            toast.success("Followed successfully");
        }
        catch (error) {
            console.log("Error in FollowButton", error);
            toast.error("Not able to follow user");
        }
        finally {
            setisLoading(false);
        }
    }

  return (
    <Button
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className={`transition-all duration-200 rounded-lg font-medium h-8 px-4 ${
        isLoading
          ? "bg-[#6b6e70]/50 dark:bg-[#6b6e70]/30 text-[#6b6e70] dark:text-[#6b6e70] cursor-not-allowed"
          : "bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#86c232] hover:to-[#61892F] text-white hover:scale-105 shadow-md hover:shadow-lg"
      }`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-xs">Loading...</span>
        </span>
      ) : (
        <span className="text-sm font-semibold">Follow</span>
      )}
    </Button>
  )
}

export default FollowButton