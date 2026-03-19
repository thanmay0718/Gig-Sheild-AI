export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">{description}</p> : null}
    </div>
  );
}
