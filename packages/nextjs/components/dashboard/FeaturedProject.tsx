"use client";

type FeaturedProjectProps = {
  imageSrc: string;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
};

export const FeaturedProject = ({ imageSrc, title, description, className, onClick }: FeaturedProjectProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-zinc-800 rounded-md border border-zinc-700 duration-300 relative cursor-pointer overflow-hidden ${className ?? ""}`}
    >
      <img src={imageSrc} alt="project image" className="w-full h-full object-cover rounded-md" />
      <div className="absolute bottom-0 left-0 p-2 bg-black/20 rounded-bl-lg rounded-tr-lg text-left max-w-[70%] w-full">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs m-0!">{description}</p>
      </div>
    </button>
  );
};

export default FeaturedProject;


