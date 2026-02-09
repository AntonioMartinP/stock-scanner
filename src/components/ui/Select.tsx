export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-9 rounded border px-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-black/10",
        props.className ?? ""
      ].join(" ")}
    />
  );
}
