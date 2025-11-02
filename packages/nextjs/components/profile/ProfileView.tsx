"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ProfileData = {
  username: string;
  name: string;
  bio: string;
  website?: string;
  avatarUrl: string;
  posts: string[];
  stats: { posts: number; followers: number; following: number };
};

export const ProfileView = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: "stranger",
    name: "Hello Stranger",
    bio: "Turning ideas into reality with community-backed funding.",
    website: "https://example.com",
    avatarUrl: "https://picsum.photos/seed/avatar/300/300",
    posts: Array.from({ length: 9 }).map((_, i) => `https://picsum.photos/seed/post-${i + 1}/600/600`),
    stats: { posts: 9, followers: 0, following: 0 },
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openEdit = () => dialogRef.current?.showModal();

  const handleUpdate = (formData: FormData) => {
    const name = String(formData.get("name") || profile.name);
    const username = String(formData.get("username") || profile.username);
    const bio = String(formData.get("bio") || profile.bio);
    const website = String(formData.get("website") || profile.website || "");
    const avatarUrl = String(formData.get("avatarUrl") || profile.avatarUrl);
    setProfile(prev => ({ ...prev, name, username, bio, website, avatarUrl }));
    dialogRef.current?.close();
  };

  return (
    <div className="w-full space-y-6">
      <div className="card card-border bg-base-100">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="avatar">
              <div className="w-28 h-28 rounded-full ring-2 ring-secondary/40">
                <Image src={profile.avatarUrl} alt="avatar" width={112} height={112} />
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold m-0!">{profile.username}</h2>
                  <p className="text-sm opacity-70 m-0!">{profile.name}</p>
                </div>
                <div className="join">
                  <button className="btn btn-sm join-item" onClick={openEdit}>Edit profile</button>
                  <a className="btn btn-sm btn-ghost join-item" href={profile.website ?? "#"} target="_blank" rel="noreferrer">Website</a>
                </div>
              </div>
              <div className="stats stats-horizontal mt-4">
                <div className="stat">
                  <div className="stat-title">Posts</div>
                  <div className="stat-value text-secondary text-2xl">{profile.stats.posts}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Followers</div>
                  <div className="stat-value text-secondary text-2xl">{profile.stats.followers}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Following</div>
                  <div className="stat-value text-secondary text-2xl">{profile.stats.following}</div>
                </div>
              </div>
              <p className="mt-3 m-0!">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {profile.posts.map((src, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden">
            <Image src={src} alt={`post-${idx + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit profile</h3>
          <form
            className="mt-4 space-y-3"
            action={(formData: FormData) => {
              handleUpdate(formData);
            }}
          >
            <label className="input">
              <span className="label">Name</span>
              <input name="name" defaultValue={profile.name} placeholder="Your name" />
            </label>
            <label className="input">
              <span className="label">Username</span>
              <input name="username" defaultValue={profile.username} placeholder="username" />
            </label>
            <label className="input">
              <span className="label">Website</span>
              <input name="website" defaultValue={profile.website} placeholder="https://" />
            </label>
            <label className="input">
              <span className="label">Avatar URL</span>
              <input name="avatarUrl" defaultValue={profile.avatarUrl} placeholder="https://" />
            </label>
            <label className="floating-label">
              <textarea name="bio" defaultValue={profile.bio} className="input" placeholder=" " />
              <span>Bio</span>
            </label>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Save</button>
              <form method="dialog">
                <button className="btn btn-ghost">Cancel</button>
              </form>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProfileView;


