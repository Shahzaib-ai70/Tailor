type DemoNoticeProps = {
  title?: string;
  description: string;
};

export function DemoNotice({
  title = "Important Notice",
  description,
}: DemoNoticeProps) {
  return (
    <div className="border border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.08)] px-5 py-4 text-sm leading-6 text-[rgba(46,16,101,0.8)]">
      <p className="font-medium uppercase tracking-[0.24em] text-[var(--color-gold)]">
        {title}
      </p>
      <p className="mt-2">{description}</p>
    </div>
  );
}

