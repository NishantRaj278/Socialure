"use client"

import { getNotifications, markNotificationAsRead } from "@/actions/notification.action";
import { NotificationsSkeleton } from "@/components/NotificationsSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-5 text-red-500 fill-current" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-5 text-[#61892F] fill-current" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-5 text-[#86c232]" />;
    default:
      return null;
  }
};


function NotificationsPage() {
  const [notifications, setnotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setnotifications(data);

        const unreadIds = data.filter(n => !n.read).map(n => n.id);
        if(unreadIds.length > 0) await markNotificationAsRead(unreadIds);
        
      } catch (error) {
        toast.error("Failed to fetch notifications");
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if(isLoading) return <NotificationsSkeleton />

  return (
    <div className="space-y-6">
      <Card className="border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm">
        <CardHeader className="border-b border-[#6b6e70]/30 dark:border-[#6b6e70]/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-[#61892F] to-[#86c232] rounded-full"></div>
              <CardTitle className="text-[#222629] dark:text-white font-bold text-xl">Notifications</CardTitle>
            </div>
            <div className="flex items-center gap-2 bg-green-100 dark:bg-[#6b6e70]/50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-[#86c232] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#222629] dark:text-white font-medium">
                {notifications.filter((n) => !n.read).length} unread
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-[#6b6e70]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircleIcon className="w-8 h-8 text-[#6b6e70] dark:text-[#86c232]" />
                </div>
                <p className="text-[#6b6e70] dark:text-[#6b6e70] font-medium">No notifications yet</p>
                <p className="text-sm text-[#6b6e70] dark:text-[#6b6e70] mt-1">We'll notify you when something happens!</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b border-[#6b6e70]/20 dark:border-[#6b6e70]/30 hover:bg-green-50/50 dark:hover:bg-[#6b6e70]/10 transition-all duration-200 ${
                    !notification.read ? "bg-green-50/30 dark:bg-[#61892F]/10 border-l-4 border-l-[#86c232]" : ""
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  <Avatar className="mt-1 w-12 h-12 ring-2 ring-[#6b6e70]/30 dark:ring-[#6b6e70]/70 ring-offset-1 ring-offset-background shadow-md">
                    <AvatarImage src={notification.creator.image ?? "/avatar.png"} className="object-cover" />
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-[#6b6e70]/30 rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <span className="text-[#222629] dark:text-white font-medium">
                        <span className="font-semibold text-[#222629] dark:text-white">
                          {notification.creator.name ?? notification.creator.username}
                        </span>{" "}
                        <span className="text-[#6b6e70] dark:text-[#6b6e70]">
                          {notification.type === "FOLLOW"
                            ? "started following you"
                            : notification.type === "LIKE"
                            ? "liked your post"
                            : "commented on your post"}
                        </span>
                      </span>
                    </div>

                    {notification.post &&
                      (notification.type === "LIKE" || notification.type === "COMMENT") && (
                        <div className="pl-11 space-y-3">
                          <div className="text-sm bg-green-50/70 dark:bg-[#6b6e70]/20 rounded-xl p-4 border border-[#6b6e70]/30 dark:border-[#6b6e70]/30">
                            <p className="text-[#222629] dark:text-white font-medium leading-relaxed">{notification.post.content}</p>
                            {notification.post.image && (
                              <img
                                src={notification.post.image}
                                alt="Post content"
                                className="mt-3 rounded-lg w-full max-w-[200px] h-auto object-cover shadow-md border border-[#6b6e70]/30 dark:border-[#6b6e70]/30"
                              />
                            )}
                          </div>

                          {notification.type === "COMMENT" && notification.comment && (
                            <div className="text-sm p-4 bg-green-50/50 dark:bg-[#61892F]/20 rounded-xl border border-[#86c232]/50 dark:border-[#86c232]/30">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageCircleIcon className="w-4 h-4 text-[#61892F] dark:text-[#86c232]" />
                                <span className="text-[#61892F] dark:text-[#86c232] font-medium text-xs">Comment:</span>
                              </div>
                              <p className="text-[#222629] dark:text-white font-medium">{notification.comment.content}</p>
                            </div>
                          )}
                        </div>
                      )}

                    <div className="flex items-center gap-2 pl-11">
                      <div className="w-1 h-1 bg-[#86c232] rounded-full"></div>
                      <p className="text-sm text-[#6b6e70] dark:text-[#6b6e70] font-medium">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

}

export default NotificationsPage;