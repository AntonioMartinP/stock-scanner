import Link from "next/link";
import {getTranslations} from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <main style={{padding: 24}}>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <div style={{marginTop: 12}}>
        <Link href="/scanner">{t("goToScanner")}</Link>
      </div>
    </main>
  );
}
