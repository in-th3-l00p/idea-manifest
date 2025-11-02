"use client";

import type { NextPage } from "next";
import { Section } from "../components/Section";
import { FeaturedProject } from "../components/dashboard/FeaturedProject";
import { QuickAccess, type QuickAccessItem } from "../components/dashboard/QuickAccess";
import { BanknotesIcon, ChatBubbleLeftRightIcon, FolderIcon, LockClosedIcon, UserIcon, UsersIcon } from "@heroicons/react/20/solid";

const Home: NextPage = () => {
  return (
    <>
      <section>
        <h1 className="text-5xl font-bold">hello, stranger</h1>
        <p className="text-lg">turn your ideas into reality by receiving the funding you need</p>
      </section>

      <Section title="quick access" subtitle="get to the ecosystem's features">
        <QuickAccess
          items={[
            { key: "lock", label: "lock", icon: <LockClosedIcon className="size-10 text-secondary" />, href: "/lock" },
            { key: "fund", label: "fund", icon: <BanknotesIcon className="size-10 text-secondary" />, href: "/fund" },
            { key: "projects", label: "projects", icon: <FolderIcon className="size-10 text-secondary" />, href: "/projects" },
            { key: "people", label: "people", icon: <UsersIcon className="size-10 text-secondary" />, href: "/people" },
            { key: "chat", label: "chat", icon: <ChatBubbleLeftRightIcon className="size-10 text-secondary" />, href: "/chat" },
            { key: "profile", label: "profile", icon: <UserIcon className="size-10 text-secondary" />, href: "/profile" },
          ] as QuickAccessItem[]}
        />
      </Section>

      <Section title="stats" subtitle="new beginning, new opportunities">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">locked in:</div>
            <div className="text-3xl font-bold text-secondary">0 GLM</div>
          </div>

          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">funded:</div>
            <div className="text-3xl font-bold text-secondary">0 GLM</div>
          </div>

          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">received funding:</div>
            <div className="text-3xl font-bold text-secondary">0 GLM</div>
          </div>
        </div>
      </Section>

      <Section title="featured" subtitle="see the latest and greatest projects">
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] lg:grid-rows-3 gap-2">
          <FeaturedProject
            className="lg:row-span-3"
            imageSrc="https://cdnb.artstation.com/p/assets/images/images/030/362/979/large/dawid-znaj-2020-09-17-19-44-04-window.jpg?1600365543"
            title="project name"
            description="description"
          />
          <FeaturedProject
            imageSrc="https://cdnb.artstation.com/p/assets/images/images/030/362/979/large/dawid-znaj-2020-09-17-19-44-04-window.jpg?1600365543"
            title="project name"
            description="description"
          />
          <FeaturedProject
            imageSrc="https://cdnb.artstation.com/p/assets/images/images/030/362/979/large/dawid-znaj-2020-09-17-19-44-04-window.jpg?1600365543"
            title="project name"
            description="description"
          />
          <FeaturedProject
            imageSrc="https://cdnb.artstation.com/p/assets/images/images/030/362/979/large/dawid-znaj-2020-09-17-19-44-04-window.jpg?1600365543"
            title="project name"
            description="description"
          />
        </div>
      </Section>
    </>
  );
};

export default Home;
