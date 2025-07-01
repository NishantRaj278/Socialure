"use client"

import { getProfileByUsername, getUserPostsByUserID, updateProfile } from '@/actions/profile.action';
import { getUserByClerkId, toggleFollow } from '@/actions/user.action';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { SignInButton, useUser } from '@clerk/nextjs';
import { format, set } from 'date-fns';
import { CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import React, {  useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Post = Awaited<ReturnType<typeof getUserPostsByUserID>>;


interface ProfilePageClientProps {
    user: NonNullable<User>;
    posts: NonNullable<Post>;
    likedPosts: NonNullable<Post>; 
    isFollowing: boolean;
}
function ProfilePageClient({user, posts, likedPosts, isFollowing:initialIsFollowing}:ProfilePageClientProps) {

  const {user: currentUser} = useUser();
  if(!currentUser) return;
  
  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const [dbUserId, setDbUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentDbUser = async () => {
      const result = await getUserByClerkId(currentUser.id);
      setDbUserId(result?.id ?? null);
    };
    fetchCurrentDbUser();
  }, [currentUser.id]);


  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const [editForm, setEditForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });

  const handleFollow = async () => {
    if(!currentUser || isUpdatingFollow) return;
    try{
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    }
    catch(error) {
      toast.error("Failed to update follow status");
      console.error("Error updating follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  }

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    }
    );

    const result = await updateProfile(formData);
    if(result?.success){
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  }

  const formattedDate = format(user.createdAt, "MMMM yyyy");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-gradient-to-br from-white/90 via-green-50/80 to-emerald-50/80 dark:from-[#222629]/90 dark:via-[#6b6e70]/20 dark:to-[#222629]/90 border border-[#6b6e70]/30 dark:border-[#6b6e70]/50 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-28 h-28 ring-4 ring-blue-500/20 ring-offset-4 ring-offset-background shadow-xl">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>
                <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-[#222629] via-[#61892F] to-[#222629] dark:from-white dark:via-[#86c232] dark:to-white bg-clip-text text-transparent">{user.name ?? user.username}</h1>
                <p className="text-[#61892F] dark:text-[#86c232] font-medium">@{user.username}</p>
                {user.bio && <p className="mt-3 text-[#6b6e70] dark:text-[#6b6e70] leading-relaxed max-w-sm">{user.bio}</p>}

                {/* PROFILE STATS */}
                <div className="w-full mt-6">
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50/50 via-white/50 to-teal-50/50 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50 rounded-xl p-4 border border-blue-100/30 dark:border-slate-600/30">
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{user._count.following.toLocaleString()}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Following</div>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-blue-200/50 dark:bg-slate-600/50" />
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{user._count.followers.toLocaleString()}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Followers</div>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-blue-200/50 dark:bg-slate-600/50" />
                    <div className="text-center">
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{user._count.posts.toLocaleString()}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Posts</div>
                    </div>
                  </div>
                </div>

                {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] rounded-xl">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <Button className="w-full mt-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] rounded-xl" onClick={() => setShowEditDialog(true)}>
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className={`w-full mt-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] rounded-xl ${
                      isFollowing 
                        ? "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0" 
                        : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                    }`}
                    onClick={handleFollow}
                    disabled={isUpdatingFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                {/* LOCATION & WEBSITE */}
                <div className="w-full mt-6 space-y-3 bg-gradient-to-r from-slate-50/80 via-blue-50/60 to-teal-50/80 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60 rounded-xl p-4 border border-blue-100/30 dark:border-slate-600/30">
                  {user.location && (
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                      <MapPinIcon className="size-4 mr-3 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                      <LinkIcon className="size-4 mr-3 text-teal-500 dark:text-teal-400" />
                      <a
                        href={
                          user.website.startsWith("http") ? user.website : `https://${user.website}`
                        }
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <CalendarIcon className="size-4 mr-3 text-slate-500 dark:text-slate-400" />
                    <span className="font-medium">Joined {formattedDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start bg-gradient-to-r from-white/90 via-blue-50/80 to-teal-50/90 dark:from-slate-800/90 dark:via-slate-700/80 dark:to-slate-800/90 backdrop-blur-sm border border-blue-200/30 dark:border-slate-600/30 rounded-xl p-1 shadow-lg">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
            >
              <FileTextIcon className="size-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
            >
              <HeartIcon className="size-4" />
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} dbUser={dbUserId} />)
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-teal-50/80 dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80 rounded-xl border border-blue-200/30 dark:border-slate-600/30">
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">No posts yet</div>
                  <div className="text-slate-500 dark:text-slate-500 text-sm mt-2">Posts will appear here when published</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <PostCard key={post.id} post={post} dbUser={dbUserId} 
                
                />)
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-teal-50/80 dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80 rounded-xl border border-blue-200/30 dark:border-slate-600/30">
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">No liked posts to show</div>
                  <div className="text-slate-500 dark:text-slate-500 text-sm mt-2">Liked posts will appear here</div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white/95 via-blue-50/90 to-teal-50/95 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/95 backdrop-blur-xl border border-blue-200/30 dark:border-slate-600/30 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-teal-700 dark:from-slate-100 dark:via-blue-300 dark:to-teal-300 bg-clip-text text-transparent">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Name</Label>
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Your name"
                  className="bg-white/80 dark:bg-slate-800/80 border-blue-200/50 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Bio</Label>
                <Textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="min-h-[100px] bg-white/80 dark:bg-slate-800/80 border-blue-200/50 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg shadow-sm resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Location</Label>
                <Input
                  name="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Where are you based?"
                  className="bg-white/80 dark:bg-slate-800/80 border-blue-200/50 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Website</Label>
                <Input
                  name="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="Your personal website"
                  className="bg-white/80 dark:bg-slate-800/80 border-blue-200/50 dark:border-slate-600/50 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-200/30 dark:border-slate-600/30">
              <DialogClose asChild>
                <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditSubmit} className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-lg">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ProfilePageClient