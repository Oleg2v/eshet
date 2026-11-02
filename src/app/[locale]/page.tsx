import Home from "@/components/Home";
import type { Locale } from "@/lib/types";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return pageMetadata(
    locale,
    {
      he: "אשת טורס — איזו חופשה בא לכם?",
      ru: "Ашет Турс — какой отпуск вам хочется?",
      en: "Eshet Tours — What kind of holiday are you dreaming of?",
    }[locale],
    {
      he: "הדרך לחופשה הבאה שלכם. קונספט עיצובי לאשת טורס עם מידע תיירותי להמחשה.",
      ru: "Путь к вашему следующему путешествию. Дизайн-концепция Ашет Турс с примерами туристической информации.",
      en: "A considered way to find your next holiday. Eshet Tours design concept with illustrative travel information.",
    }[locale],
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Home locale={locale} />;
}
