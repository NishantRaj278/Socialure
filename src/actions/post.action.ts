"use server"

import { prisma } from "@/lib/prisma";
import { getDbUser } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createPost(content:string, imageUrl:string){
    try {
        const userId = await getDbUser();
        if(!userId) return;

        const post = await prisma.post.create({
            data: {
                content,
                image: imageUrl,
                authorId: userId
            }
        })

        revalidatePath('/');
        return {success: true, post};
    } catch (error) {
        console.log("error in createpost", error);
        return {success: false, messsage: "Not able to create post"}
    }
}


export async function getPosts(){
    try{
        const posts  = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author:{
                    select:{
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                comments:{
                    include:{
                        author:{
                            select:{
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                Likes:{
                    select:{
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        Likes: true,
                    }
                }
            }
        });

        return posts;
    }
    catch (error) {
        console.log("error in getPosts", error);
        throw new Error("Not able to get posts");
    }
}

export async function toggleLike(postId: string) {
    try{
        const userId = await getDbUser();
        if(!userId) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    userId,
                    postId,
                }
            }
        });

        const post = await prisma.post.findUnique({
            where: {  
                id: postId,
            },
            select:{
                authorId: true,
            }
        });

        if(!post) throw new Error("Post not found");

        if(existingLike){
            // unlike the post
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        userId,
                        postId,
                    }
                }
            });
        } else {
            // like the post
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        postId,
                        userId,
                    }
                }),
                ...post.authorId !== userId ? [
                    prisma.notification.create({
                    data: {
                        postId,
                        userId: post.authorId,
                        creatorId: userId,
                        type: 'LIKE',
                    }
                })
                ] : [],
                
            ])

        }

        revalidatePath('/');
        return {success: true};
    }
    catch (error) {
        console.log("error in toggleLike", error);
        return {success: false, message: "Not able to toggle like"};
    }
}

export async function addcomment(postId: string, content: string){
    try{
        const userId = await getDbUser();
        if(!userId) return;
        if(!content) throw new Error("Content is required");
        const post = await prisma.post.findUnique({
            where:{
                id: postId,
            },
            select:{
                authorId: true,
            }
        })

        if(!post) throw new Error("Post not found");

        const [comment] = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    content,
                    postId,
                    authorId: userId,
                }
            });

            if(post.authorId !== userId){
                await tx.notification.create({
                    data: {
                        postId,
                        userId: post.authorId,
                        creatorId: userId,
                        type: 'COMMENT',
                        commentId: newComment.id,
                    }
                });
            }
            return [newComment];
        });

        revalidatePath('/');
        return {success: true, comment};
    }
    catch (error) {
        console.log("error in addComment", error);
        return {success: false, message: "Not able to add comment"};
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getDbUser();
        if(!userId) return;

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                authorId: true,
            }
        });

        if(!post) throw new Error("Post not found");
        if(post.authorId !== userId) throw new Error("You are not authorized to delete this post");

        await prisma.post.delete({
            where: {
                id: postId,
            }
        });

        revalidatePath('/');
        return {success: true};
    } catch (error) {
        console.log("error in deletePost", error);
        return {success: false, message: "Not able to delete post"};
    }
}