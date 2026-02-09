import {getTranslations} from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
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
