import { getProfileByUsername, getUserLikedPostsByUserID, getUserPostsByUserID, isFollowing } from "@/actions/profile.action";
import ProfilePageClient from "@/app/profile/[username]/ProfilePageClient";
import { notFound } from "next/navigation";

export const generateMetadata = async ({params} : {params: {username : string}}) => {
    const user = await getProfileByUsername(params.username);
    if(!user) return;

    return {
        title: `${user.name} (@${user.username}) - Profile`,
        description: `Profile page of ${user.name} (@${user.username}).`,
    };
}

async function ProfilePage({params} : {params: {username: string}}) {
    const user = await getProfileByUsername(params.username);
    if(!user) notFound();

    const [userPosts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPostsByUserID(user.id),
        getUserLikedPostsByUserID(user.id),
        isFollowing(user.id),
    ]);


  return <ProfilePageClient 
    user={user}
    posts={userPosts || []}
    likedPosts={likedPosts || []}
    isFollowing={isCurrentUserFollowing}
    />
}

export default ProfilePage;