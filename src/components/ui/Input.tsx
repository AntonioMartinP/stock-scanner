export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-9 w-full rounded border px-3 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-black/10",
        props.className ?? ""
      ].join(" ")}
    />
  );
}
