"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";


export async function syncUser(){

    try {
       const {userId} =  await auth();
       const user = await currentUser();

       if(!user || !userId) return;

        const existingUser = await prisma.user.findUnique({
            where:{
                clerkId: userId
            }
        })
        if(existingUser) return existingUser;

       const dbUser = await prisma.user.create({
        data:{
            clerkId: userId,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
            username: user.username || user.emailAddresses[0].emailAddress.split('@')[0],
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl,
        }
       })

       return dbUser;

    } catch (error) {
        console.log("Someting wrong in syncUser", error)
    }
};

export async function getUser(clerkId: string){
    return await prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count:{
                select:{
                    followers: true,
                    following: true,
                    posts: true,
                }
            }
        }
    })

};

export async function getDbUser(){
    const {userId} = await auth();
    if(!userId) return null;

    const user = await getUser(userId);
    if(!user) throw new Error("User not found");

    return user.id;
};

export async function getUserByClerkId(userId: string){
    try {
        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
            select: {
                id: true,
            }
        });

        return user;
    } catch (error) {
        console.log("Error in getUserByClerkId", error);
    }
}

export async function getRandomUsers(){

    try {

        const userId = await getDbUser();
        if(!userId) return;
        const randomUsers = await prisma.user.findMany({
        where: {
            AND: [
            {NOT: {id: userId}},
            {NOT: {followers: {some: {followerId: userId}}}} 
            ]
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
            _count: {
                select: {
                    followers: true,
                }
            } 
        },
        take: 5,    
    })

    return randomUsers;
        
    } catch (error) {
        console.log("Error in getRandomUsers", error);
        return [];
        
    }

};

export async function toggleFollow(targetId : string){
    try {
        const userId = await getDbUser();
        if(!userId) throw new Error("User not found");
        if(userId === targetId) throw new Error("You cannot follow yourself");
        const existingFollow = await prisma.follows.findUnique({
            where:{
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetId
                }
            }
        });

        if(existingFollow){
            await prisma.follows.delete({
                where:{
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetId
                    }
                }
            });
        }
        else{
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetId,
                    }
                }),
                prisma.notification.create({
                    data: { 
                        userId: targetId,
                        type: "FOLLOW",
                        creatorId: userId,
                    }
                })
            ]);
        }

        revalidatePath('/');
        return {success: true};
    } catch (error) {
        console.log("Error in toggle follow", error);
        return {success: false, error: "Something went wrong"};
    }
}

