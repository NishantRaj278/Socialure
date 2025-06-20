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
    size={"sm"}
    variant={"secondary"}
    onClick={handleFollow}
    disabled={isLoading}
    className="w-20">
        {isLoading ? <Loader2Icon className="size-4 animate-spin"/> : "Follow"}
    </Button>
  )
}

export default FollowButton