import type { Metadata } from "next";
import Link from "next/link";
import { CategoryLinks } from "@/components/CategoryLinks";
import { JsonLd } from "@/components/JsonLd";
import { PracticeCard } from "@/components/PracticeCard";
import { WORDS } from "@/data/words";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "IELTS Listening Spelling Practice: Free Online Spelling Test";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: SITE_DESCRIPTION, path: "/" });

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

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["WebApplication", "EducationalApplication"],
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript and the Web Speech API",
          inLanguage: "en",
          educationalLevel: "IELTS",
          teaches: "English spelling for the IELTS Listening test",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
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

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12">
        <section className="mx-auto mb-6 max-w-[520px] text-center sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
            IELTS Listening spelling practice
          </h1>
          <p className="mt-3 text-muted text-pretty">
            Hear a word, type it, and see exactly which letters you got wrong.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#practice"
              className="inline-flex min-h-12 items-center rounded-ctl bg-primary px-6 font-medium text-on-primary transition-colors duration-200 hover:bg-primary-hover"
            >
              Start practicing
            </a>
            <Link
              href="/words"
              className="inline-flex min-h-12 items-center rounded-ctl px-4 font-medium text-muted transition-colors duration-200 hover:text-text"
            >
              See all words
            </Link>
          </div>
        </section>

        <div id="practice" className="scroll-mt-20">
          <PracticeCard />
        </div>
      </div>

      <div className="border-t border-border bg-surface">
        <article className="mx-auto max-w-2xl px-4 py-12 leading-relaxed sm:px-6 sm:py-16">
          <h2 className="text-xl font-semibold sm:text-2xl">Why spelling costs marks in IELTS Listening</h2>
          <p className="mt-4">
            In the IELTS Listening test, a correct answer that is misspelled is marked wrong. There are no part marks.
            Many students understand the recording perfectly and still lose two or three marks to spelling, which can
            be the difference between Band 6.5 and Band 7. Regular IELTS spelling test practice with audio is the
            quickest way to win those marks back.
          </p>

          <h3 className="mt-8 text-lg font-semibold">Common mistake patterns</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
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

          <h3 className="mt-8 text-lg font-semibold">Tips for IELTS listening practice online</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Practise a little every day. Short, daily sessions build spelling memory faster than long ones.</li>
            <li>Switch accents. The test uses British, Australian and North American speakers.</li>
            <li>Use the slow button to hear each syllable, then try again at normal speed.</li>
            <li>Review your mistakes list until every word leaves it.</li>
            <li>Learn topic by topic. Words cluster around accommodation, transport, study and health.</li>
          </ul>

          <h2 className="mt-12 text-xl font-semibold sm:text-2xl">Practise IELTS commonly misspelled words by topic</h2>
          <p className="mt-3 mb-5 text-muted">
            {WORDS.length} words from the most common IELTS Listening topics.
          </p>
          <CategoryLinks />

          <h2 className="mt-12 text-xl font-semibold sm:text-2xl">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-border rounded-card border border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span
                    aria-hidden
                    className="text-xl text-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-4 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
