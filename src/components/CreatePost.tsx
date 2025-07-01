"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
    const {user} = useUser();
    const [content, setcontent] = useState("");
    const [imageUrl, setimageUrl] = useState("");
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [isPosting, setisPosting] = useState(false);

    const handleSubmit = async () => {
      if(!content.trim() && !imageUrl) return;
      setisPosting(true);
      try {
        const result = await createPost(content, imageUrl);
        if(result?.success){
          toast.success("Post created successfully");
          setcontent("");
          setShowImageUpload(false);
          setimageUrl("");
        }
      } catch (error) {
        console.log("not able to create post", error);
        toast.error("Not able to create post. Try Again.")
      } finally {
        setisPosting(false);
      }
    }
  return (
    <Card className="mb-6 border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 shadow-lg bg-gradient-to-br from-white via-green-50/80 to-emerald-50/60 dark:from-[#222629] dark:via-[#222629]/95 dark:to-[#6b6e70]/20 backdrop-blur-sm hover:shadow-xl hover:shadow-[#61892F]/20 dark:hover:shadow-[#222629]/50 transition-all duration-500 group relative">
      {/* Elegant hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#61892F]/3 via-[#86c232]/3 to-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-[#6b6e70]/30 dark:border-[#6b6e70]/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-[#61892F] to-[#86c232] rounded-full"></div>
              <span className="font-semibold text-[#222629] dark:text-white">Create Post</span>
            </div>
            <span className="text-sm text-[#6b6e70] dark:text-[#6b6e70] font-medium">Share your thoughts with the world</span>
          </div>

          {/* Main Input Area */}
          <div className="flex space-x-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-[#6b6e70]/30 dark:ring-[#6b6e70]/70 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-[#86c232]/80 dark:hover:ring-[#86c232]/80 shadow-md hover:shadow-lg hover:scale-105">
                <AvatarImage src={user?.imageUrl || "/avatar.png"} />
              </Avatar>
            </div>
            
            <div className="flex-1 relative">
              <Textarea
                placeholder="What's happening? Share your thoughts..."
                className="min-h-[100px] resize-none border border-[#6b6e70]/30 dark:border-[#6b6e70]/30 focus-visible:border-[#86c232] focus-visible:ring-2 focus-visible:ring-[#86c232]/30 dark:focus-visible:ring-[#86c232]/30 p-4 text-[#222629] dark:text-white rounded-xl bg-green-50/50 dark:bg-[#6b6e70]/20 backdrop-blur-sm transition-all duration-300 placeholder:text-[#6b6e70] dark:placeholder:text-[#6b6e70] font-medium"
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                disabled={isPosting}
              />
              {/* Character counter */}
              <div className="absolute bottom-3 right-3 text-xs text-[#6b6e70] dark:text-[#6b6e70] bg-white/90 dark:bg-[#222629]/90 px-2 py-1 rounded-full border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 font-medium">
                {content.length}/500
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          {(showImageUpload || imageUrl) && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <div className="border-2 border-dashed border-[#86c232]/50 dark:border-[#86c232]/50 rounded-xl p-6 bg-green-50/30 dark:bg-[#61892F]/20 backdrop-blur-sm transition-all duration-300 hover:border-[#86c232]/70 dark:hover:border-[#86c232]/70 hover:bg-green-50/50 dark:hover:bg-[#61892F]/30">
                <ImageUpload
                  endpoint="postImage"
                  value={imageUrl}
                  onChange={(url) => {
                    setimageUrl(url);
                    if (!url) setShowImageUpload(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-green-50/60 dark:bg-[#6b6e70]/20 rounded-xl border border-[#6b6e70]/30 dark:border-[#6b6e70]/30">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`text-[#6b6e70] dark:text-[#6b6e70] hover:text-[#61892F] hover:bg-green-50 dark:hover:bg-[#61892F]/20 rounded-lg transition-all duration-200 h-9 px-3 font-medium ${
                  showImageUpload ? 'bg-green-50 dark:bg-[#61892F]/30 text-[#61892F] dark:text-[#86c232]' : ''
                }`}
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                {showImageUpload ? 'Hide Photo' : 'Add Photo'}
              </Button>
              
              {/* Post Stats */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#6b6e70] dark:text-[#6b6e70]">
                <div className="w-1 h-1 bg-[#86c232] rounded-full"></div>
                <span className="font-medium">Public post</span>
              </div>
            </div>
            
            <Button
              className={`relative overflow-hidden rounded-lg px-6 py-2 font-semibold transition-all duration-300 h-10 ${
                (!content.trim() && !imageUrl) || isPosting 
                  ? 'bg-[#6b6e70]/50 dark:bg-[#6b6e70]/30 text-[#6b6e70] dark:text-[#6b6e70] cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#61892F] to-[#86c232] hover:from-[#86c232] hover:to-[#61892F] text-white shadow-md hover:shadow-lg hover:scale-105'
              }`}
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="size-4 animate-spin" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendIcon className="size-4" />
                  Share Post
                </span>
              )}
            </Button>
          </div>

          {/* Quick Tips */}
          {!content && !imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-[#61892F]/30 dark:to-[#86c232]/30 rounded-lg border border-[#86c232]/50 dark:border-[#86c232]/30 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#61892F] rounded-full animate-pulse"></div>
                <span className="text-sm text-[#61892F] dark:text-[#86c232] font-medium">
                  💡 Tip: Share your ideas, photos, or ask questions to engage with the community!
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost