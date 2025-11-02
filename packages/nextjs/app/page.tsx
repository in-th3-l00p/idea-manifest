"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Section } from "../components/Section";
import { FeaturedProject } from "../components/dashboard/FeaturedProject";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <section>
        <h1 className="text-5xl font-bold">hello, stranger</h1>
        <p className="text-lg">turn your ideas into reality by receiving the funding you need</p>
      </section>
      <Section title="stats" subtitle="new beginning, new opportunities">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">locked in:</div>
            <div className="text-3xl font-bold">0 ETH</div>
          </div>

          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">funded:</div>
            <div className="text-3xl font-bold">0 ETH</div>
          </div>

          <div className="bg-zinc-800 rounded-md py-12 text-center border border-zinc-700 duration-300">
            <div className="text-sm">received funding:</div>
            <div className="text-3xl font-bold">0 ETH</div>
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
