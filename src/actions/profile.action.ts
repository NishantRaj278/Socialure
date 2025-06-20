"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUser } from "./user.action";

export async function getProfileByUsername(username: string){
    try{
        const profile = await prisma.user.findUnique({
            where:{
                username,
            },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                image: true,
                createdAt: true,
                location: true,
                website: true,
                _count:{
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    }
                }
                
            },

        })

        if(!profile) return;

        return profile;
    }
    catch(error){
        console.error("Error fetching profile:", error);
    }
}

export async function getUserPostsByUserID(userId: string){
  try {
    const posts = await prisma.post.findMany({
      where:{
        authorId: userId,
      },
      include:{
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select:{
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        Likes: {
          select: {
            userId: true,
          },
        },
        _count:{
          select:{
            comments: true,
            Likes: true,
          },
        },
      },
      orderBy:{
        createdAt: "desc",
      },
    });

    if(!posts) return [];

    return posts;
  } catch(error) {
    console.error("Error fetching user posts:", error);
  }
}

export async function getUserLikedPostsByUserID(userId: string) {
  try {
    const likedPosts = await prisma.post.findMany({
      where: {
        Likes: {
          some: {
            userId,
          },
        },
      },
      include:{
        author:{
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            },
        },
        comments:{
            include: {
                author:{
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                    createdAt: "asc",
            },
        },
        Likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            Likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likedPosts;

    }
    catch(error) {
      console.error("Error fetching liked posts:", error);
      return null;
    }
}

export async function updateProfile(FormData: FormData){
    try{
        const {userId : clerkId} = await auth();
        if(!clerkId) return {success: false, message: "User not authenticated"};

        const name = FormData.get("name") as string;
        const bio = FormData.get("bio") as string;
        const location = FormData.get("location") as string;
        const website = FormData.get("website") as string;

        const updateProfile = await prisma.user.update({
            where:{
                clerkId
            },
            data:{
                name,
                bio,
                location,
                website,
            }
        })

        if(!updateProfile) return {success: false, message: "Profile update failed"};

        revalidatePath('/profile');
        return {success: true, updateProfile};

    }
    catch(error){
        console.error("Error updating profile:", error);
    }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUser();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}