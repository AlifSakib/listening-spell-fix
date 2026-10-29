import type { Metadata } from "next";
import Link from "next/link";
import { ClearData } from "@/components/ClearData";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";

const TITLE = "Why Spelling Matters in IELTS Listening";
const DESCRIPTION =
  "How spelling affects your IELTS Listening score, the words candidates get wrong most often, and how to use this free spelling practice app to stop losing easy marks.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/about" });

const FAQ = [
  {
    q: "Does spelling matter in IELTS Listening?",
    a: "Yes. An answer is only marked correct if it is spelled correctly. A misspelled word scores zero, even if you heard it perfectly.",
  },
  {
    q: "Can I use American spelling in IELTS?",
    a: "Yes. Both British and American spellings are accepted, as long as you are consistent. This app accepts both, for example colour and color, or centre and center.",
  },
  {
    q: "Do capital letters matter in IELTS Listening?",
    a: "No. Answers are not case-sensitive, so you can write in all capitals or all lower case. This app ignores capitals too.",
  },
  {
    q: "Which accents are used in the IELTS Listening test?",
    a: "You will hear a range of English accents, mainly British, Australian, North American and New Zealand. Switch between UK, US and AU voices here to get used to them.",
  },
  {
    q: "How many words should I practise each day?",
    a: "Twenty focused words a day is a good start. Set your own daily goal from the ring at the top of the page, and review your mistakes regularly.",
  },
  {
    q: "Does the app work offline?",
    a: "Yes. After your first visit you can install it on your phone and practise without an internet connection. Your progress is saved on your device.",
  },
];

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 leading-relaxed sm:px-6 sm:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

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

      <h2 className="mt-10 text-xl font-semibold">Common spelling traps</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>
          <strong className="font-medium">Double letters:</strong> accommodation, committee, necessary, questionnaire.
        </li>
        <li>
          <strong className="font-medium">Silent letters:</strong> Wednesday, February, government, environment.
        </li>
        <li>
          <strong className="font-medium">Vowel sounds that hide:</strong> library, temperature, vegetable, separate.
        </li>
        <li>
          <strong className="font-medium">British endings:</strong> centre, colour, organise, catalogue. American
          spellings are also accepted, but stay consistent.
        </li>
        <li>
          <strong className="font-medium">ie or ei:</strong> receipt, believe, foreign, science.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Practice tips</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Practise a little every day. Short, daily sessions build spelling memory faster than long ones.</li>
        <li>Switch accents. The test uses British, Australian and North American speakers.</li>
        <li>Use the slow button to hear each syllable, then try again at normal speed.</li>
        <li>Review your mistakes list until every word leaves it.</li>
        <li>
          Learn topic by topic, starting with{" "}
          <Link href="/practice/homes" className="text-primary underline underline-offset-4">
            homes and accommodation
          </Link>{" "}
          and <Link href="/practice/days-and-months" className="text-primary underline underline-offset-4">
            days and months
          </Link>
          , or see <Link href="/topics" className="text-primary underline underline-offset-4">all topics</Link>.
        </li>
      </ul>

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
      <ClearData />

      <h2 className="mt-10 text-xl font-semibold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-card border border-border">
        {FAQ.map((f) => (
          <details key={f.q} className="group px-5">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
              <h3>{f.q}</h3>
              <span aria-hidden className="text-xl text-muted transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center rounded-ctl bg-primary px-6 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
      >
        Start practicing
      </Link>
    </article>
  );
}
