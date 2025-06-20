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
     <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's in your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-2 text-base "
              value={content}
              onChange={(e) => setcontent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4 w-50">
              <ImageUpload
                
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setimageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2 cursor-pointer" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost