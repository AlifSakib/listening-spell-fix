import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Why Spelling Matters in IELTS Listening | IELTS Spelling Practice",
  description:
    "How spelling affects your IELTS Listening score, and how to use this free spelling practice app to stop losing easy marks.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 leading-relaxed sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        Why spelling matters in IELTS Listening
      </h1>
      <p className="mt-4">
        In the Listening test you write what you hear: names, places, dates, numbers and everyday nouns. The examiner
        only accepts answers that are spelled correctly. There is no half mark for a word that is nearly right, so a
        single missing letter in <em>accommodation</em> costs exactly as much as not answering at all.
      </p>
      <p className="mt-4">
        The good news is that the same words come up again and again. Days, months, transport, study vocabulary and
        housing appear in almost every test. Learn to spell these few hundred words under listening conditions and you
        protect marks you have already earned.
      </p>

      <h2 className="mt-10 text-xl font-semibold">How to use the app</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5">
        <li>
          Press <strong className="font-medium">Play</strong> to hear a word. Use <strong className="font-medium">Slow</strong>{" "}
          to hear it again more slowly.
        </li>
        <li>Type the word and press Enter. Capital letters don&apos;t matter.</li>
        <li>
          If it&apos;s wrong, you&apos;ll see the correct spelling with the wrong, missing and extra letters highlighted.
        </li>
        <li>Choose a UK, US or Australian accent to train your ear for the voices in the test.</li>
        <li>
          Stuck? Press <strong className="font-medium">Hint</strong> to see the first letter and the word length. Hinted
          answers don&apos;t count toward your streak.
        </li>
        <li>
          Every misspelled word goes to <Link href="/mistakes" className="text-primary underline underline-offset-4">your mistakes list</Link>.
          Spell it correctly twice in a row to clear it.
        </li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold">British or American spelling?</h2>
      <p className="mt-4">
        IELTS accepts both. This app uses British spelling as the main answer and also accepts the American form, such as
        <em> colour</em> or <em>color</em>. In the real test, pick one style and use it throughout.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Your data</h2>
      <p className="mt-4">
        There are no accounts. Your streak, daily goal and mistakes are saved only in this browser. Install the app to
        practise offline.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center rounded-ctl bg-primary px-6 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
      >
        Start practicing
      </Link>
    </article>
  );
}
