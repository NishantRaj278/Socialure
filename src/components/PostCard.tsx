"use client"

import { addcomment, deletePost, getPosts, toggleLike } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import {formatDistanceToNow} from "date-fns";
import { Button } from "./ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number];

const PostCard = ({post, dbUser, 
  // isOwnProfile
}: {post : Post; dbUser: string | null; 
  // isOwnProfile: boolean
}) => {
    const {user} = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking , setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.Likes.some((like) => like.userId === dbUser));
    const [optimisticLikes , setOptimisticLikes] = useState(post._count.Likes);
    const [showComments, setShowComments] = useState(false);

        
    const handleLike = async () => {
        if(isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked((prev) => !prev);
            setOptimisticLikes((prev) => hasLiked ? prev - 1 : prev + 1);
            await toggleLike(post.id);
        } catch (error) {
            setOptimisticLikes(post._count.Likes);
            setHasLiked(post.Likes.some((like) => like.userId === dbUser));
            console.log("Error in PostCard", error);
        }
        finally{
            setIsLiking(false);
        }
    }

    const handleAddComment = async () => {
        if(isCommenting || !newComment.trim()) return;
        try {
            setIsCommenting(true);
            const result = await addcomment(post.id, newComment);
            if(result?.success){
                toast.success("Comment added successfully");
                setNewComment("");
            }
        } catch (error) {
            console.log("Error in handleAddComment", error);
            toast.error("Not able to add comment");
        } finally {
            setIsCommenting(false);
        }
    }

    const handleDeletePost = async () => {
        if(isDeleting) return;
        try {
            setIsDeleting(true);
            const result = await deletePost(post.id);
            if(result?.success) {
                toast.success("Post deleted successfully");
            }
            else throw new Error(result?.message || "Not able to delete post");
        } catch (error) {
            console.log("Error in handleDeletePost", error);
            toast.error("Not able to delete post");
        } finally {
            setIsDeleting(false);
        }
    }

  return (
    <Card className="overflow-hidden border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm hover:shadow-xl hover:shadow-[#61892F]/20 dark:hover:shadow-[#222629]/50 transition-all duration-500 hover:scale-[1.005] group relative">
      {/* Elegant hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#61892F]/5 via-[#86c232]/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="space-y-5">
          {/* Post Header */}
          <div className="flex space-x-3">
            <Link href={`/profile/${post.author.username}`} className="relative group/avatar">
              <Avatar className="size-12 transition-all duration-300 hover:scale-110 ring-2 ring-[#6b6e70]/30 dark:ring-[#6b6e70]/70 ring-offset-2 ring-offset-background hover:ring-[#86c232]/80 dark:hover:ring-[#86c232]/80 shadow-md hover:shadow-lg">
                <AvatarImage src={post.author.image ?? "/avatar.png"} className="object-cover" />
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="font-semibold text-[#222629] dark:text-white hover:text-[#61892F] dark:hover:text-[#86c232] transition-colors duration-200"
                    >
                      {post.author.name}
                    </Link>
                    <span className="text-[#6b6e70] dark:text-[#6b6e70] font-normal">•</span>
                    <Link 
                      href={`/profile/${post.author.username}`}
                      className="text-sm text-[#61892F] dark:text-[#86c232] hover:text-[#86c232] dark:hover:text-[#86c232]/80 transition-colors duration-200 font-medium"
                    >
                      @{post.author.username}
                    </Link>
                  </div>
                  <span className="text-sm text-[#6b6e70] dark:text-[#6b6e70] font-medium">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </span>
                </div>
                
                {/* Delete Button */}
                {dbUser === post.author.id && (
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDeletePost} />
                  </div>
                )}
              </div>
              
              {/* Post Content */}
              {post.content && (
                <div className="mt-4 p-4 bg-green-50/70 dark:bg-[#6b6e70]/20 rounded-xl border border-[#6b6e70]/30 dark:border-[#6b6e70]/30 transition-colors duration-200">
                  <p className="text-[#222629] dark:text-white leading-relaxed font-medium text-[15px]">{post.content}</p>
                </div>
              )}
            </div>
          </div>

          {/* POST IMAGE */}
          {post.image && (
            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group/image border border-[#6b6e70]/30 dark:border-[#6b6e70]/30">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover/image:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#222629]/10 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          {/* INTERACTION BUTTONS */}
          <div className="flex items-center justify-between p-4 bg-green-50/80 dark:bg-[#6b6e70]/20 rounded-xl border border-[#6b6e70]/30 dark:border-[#6b6e70]/30">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`group/like transition-all duration-200 hover:scale-105 rounded-lg h-10 px-3 ${
                    hasLiked 
                      ? "text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50" 
                      : "text-[#6b6e70] dark:text-[#6b6e70] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  }`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <div className="flex items-center gap-2">
                    <HeartIcon className={`size-5 ${hasLiked ? "fill-current" : ""} group-hover/like:scale-110 transition-transform duration-200`} />
                    <span className="font-medium">{optimisticLikes}</span>
                  </div>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#6b6e70] dark:text-[#6b6e70] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 rounded-lg h-10 px-3"
                  >
                    <div className="flex items-center gap-2">
                      <HeartIcon className="size-5" />
                      <span className="font-medium">{optimisticLikes}</span>
                    </div>
                  </Button>
                </SignInButton>
              )}

              {/* Comment Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`group/comment transition-all duration-200 hover:scale-105 rounded-lg h-10 px-3 ${
                  showComments 
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50" 
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                }`}
                onClick={() => setShowComments((prev) => !prev)}
              >
                <div className="flex items-center gap-2">
                  <MessageCircleIcon
                    className={`size-5 group-hover/comment:scale-110 transition-transform duration-200 ${
                      showComments ? "fill-current" : ""
                    }`}
                  />
                  <span className="font-medium">{post.comments.length}</span>
                </div>
              </Button>
            </div>

            {/* Engagement Stats */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span>{optimisticLikes + post.comments.length} interactions</span>
              </div>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          {showComments && (
            <div className="space-y-4 p-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/30 animate-in slide-in-from-top-2 duration-300">
              {/* Comments Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                <MessageCircleIcon className="size-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Comments ({post.comments.length})</span>
              </div>

              <div className="space-y-3">
                {/* DISPLAY COMMENTS */}
                {post.comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className="flex space-x-3 p-3 bg-white/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/30 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.4s ease-out forwards'
                    }}
                  >
                    <Avatar className="size-8 ring-1 ring-slate-200 dark:ring-slate-600">
                      <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{comment.author.name}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">@{comment.author.username}</span>
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed break-words text-slate-800 dark:text-slate-100 font-medium">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD COMMENT SECTION */}
              {user ? (
                <div className="flex space-x-3 p-4 bg-green-50/60 dark:bg-[#6b6e70]/20 rounded-lg border border-[#6b6e70]/30 dark:border-[#6b6e70]/30">
                  <Avatar className="size-8 ring-1 ring-[#86c232]/50 dark:ring-[#86c232]/50">
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Write a thoughtful comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none border-[#6b6e70]/50 dark:border-[#6b6e70]/30 focus:border-[#86c232] focus:ring-2 focus:ring-[#86c232]/30 dark:focus:ring-[#86c232]/30 bg-white/80 dark:bg-[#222629]/50 transition-all duration-200 rounded-lg"
                      disabled={isCommenting}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6b6e70] dark:text-[#6b6e70] font-medium">
                        {newComment.length}/280 characters
                      </span>
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        className={`transition-all duration-200 rounded-lg ${
                          !newComment.trim() || isCommenting
                            ? "bg-[#6b6e70]/50 dark:bg-[#6b6e70]/30 text-[#6b6e70] dark:text-[#6b6e70] cursor-not-allowed"
                            : "bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#86c232] hover:to-[#61892F] text-white hover:scale-105 shadow-md"
                        }`}
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Posting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <SendIcon className="size-4" />
                            Comment
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100/50 dark:bg-slate-800/30">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200 border-slate-400 dark:border-slate-500 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                      <LogInIcon className="size-4" />
                      Sign in to join the conversation
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
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
    </Card>
  );
}

export default PostCard