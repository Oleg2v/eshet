import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container missing-page">
      <p className="eyebrow">404 · A DIFFERENT DIRECTION</p>
      <h1>הדרך הזאת עוד לא כאן.</h1>
      <p lang="ru">Такой страницы пока нет.</p>
      <p lang="en">This path isn’t here yet.</p>
      <div className="button-row">
        <Link href="/he" className="button button-dark">
          לעמוד הבית
        </Link>
        <Link href="/ru" className="button button-outline">
          На главную
        </Link>
        <Link href="/en" className="button button-outline">
          Back home
        </Link>
      </div>
    </main>
  );
}
