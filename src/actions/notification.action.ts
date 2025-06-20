"use server"

import { prisma } from "@/lib/prisma";
import { getDbUser } from "./user.action";

export const getNotifications = async () => {
    try{
        const userId = await getDbUser();
        if(!userId) return [];

        const notifications = await prisma.notification.findMany({
            where:{
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        image: true,
                    },
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
        })

        return notifications;
    }
    catch(error) {
        console.error("Error fetching notifications:", error);
        throw error; 
    }
}

export const markNotificationAsRead = async (notificationIds: string[]) => {
    try {
        const userId = await getDbUser();
        if (!userId) throw new Error("User not authenticated");

        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notificationIds,
                }
            },
            data: {
                read: true,
            },
        });

        return {success : true};
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

