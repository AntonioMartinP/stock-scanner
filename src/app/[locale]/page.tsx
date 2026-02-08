import {useTranslations} from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <main style={{padding: 24}}>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <div style={{display: "flex", gap: 12}}>
        <a href="/es">ES</a>
        <a href="/en">EN</a>
      </div>
      <div style={{marginTop: 12}}>
        <a href="/es/scanner">Go to scanner</a>
      </div>
    </main>
  );
}
