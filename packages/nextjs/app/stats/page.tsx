import { Section } from "../../components/Section";

export default function Page() {
  return (
    <Section title="stats" subtitle="ecosystem metrics and insights">
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
  );
}


