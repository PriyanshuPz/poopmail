import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "~/components/core/footer";
import { Navbar } from "~/components/core/navbar";
export default component$(() => {
  return (
    <main class="flex min-h-screen w-full flex-col">
      <Navbar />

      <section class="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center p-4">
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col rounded border-2 bg-[#1111]/80 p-6">
            <h1 class="mb-4 text-3xl font-bold">About Poopmail</h1>
            <p class="mb-4 text-sm opacity-90">
              Last updated: January 23, 2026
            </p>

            <div class="space-y-4">
              <p>
                Poopmail is a temporary email service that allows you to create
                disposable email addresses without registration. Perfect for
                testing, signing up for services, or avoiding spam in your
                primary inbox.
              </p>

              <p>
                This service is a subpart of <strong>tsbin.tech</strong>, a
                temporary file bin project designed to provide ephemeral digital
                resources without the hassle of permanent storage.
              </p>

              <div class="mt-6 rounded border-2 border-yellow-500/50 bg-yellow-500/10 p-4">
                <h3 class="mb-2 text-lg font-semibold text-yellow-400">
                  Project Purpose
                </h3>
                <p class="mb-3">
                  The main purpose of this project has been achieved - providing
                  a free, privacy-focused temporary email service. The core
                  functionality is complete and stable.
                </p>
                <p>
                  While the project won't be on my priority list for active
                  development, it's not abandoned.{" "}
                  <strong>Contributors are welcome!</strong> If you want to
                  contribute improvements or new features, feel free to submit
                  pull requests. Updates will be reviewed and merged by the
                  admin as time permits.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">
                  Developer & Contributors
                </h2>
                <p>
                  Poopmail is developed and maintained by{" "}
                  <a
                    href="https://github.com/PriyanshuPz"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-semibold underline transition-colors hover:text-white/80"
                  >
                    Priyanshu Pz
                  </a>
                  .
                </p>
                <p class="mt-2">
                  The project is open-source and available on{" "}
                  <a
                    href="https://github.com/PriyanshuPz/poopmail"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-semibold underline transition-colors hover:text-white/80"
                  >
                    GitHub
                  </a>
                  . <strong>Contributors are welcome!</strong> Submit your pull
                  requests for improvements, bug fixes, or new features. While
                  active development is paused, contributions will be reviewed
                  and merged.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Key Features</h2>
                <ul class="space-y-2">
                  <li>Instant temporary email addresses</li>
                  <li>No registration or signup required</li>
                  <li>24-hour automatic expiration</li>
                  <li>No data collection or tracking</li>
                  <li>Open-source and transparent</li>
                  <li>Simple, accessible interface</li>
                </ul>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Privacy First</h2>
                <p>
                  We do not collect, store, or track any personal information.
                  All mailboxes are completely temporary and will be
                  automatically deleted after 24 hours. Your emails are stored
                  only for the duration of the mailbox lifetime.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Open Source</h2>
                <p>
                  This project is open-source and available for anyone to
                  review, contribute to, or self-host. We believe in
                  transparency and community-driven development.
                </p>
                <p class="mt-2">
                  Built with modern technologies: Qwik, Appwrite, Cloudflare
                  Workers, and deployed on Vercel Edge.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Use Cases</h2>
                <ul class="space-y-2">
                  <li>Testing email functionality in applications</li>
                  <li>Signing up for newsletters without spam</li>
                  <li>One-time verifications</li>
                  <li>Avoiding unwanted marketing emails</li>
                  <li>Quick disposable communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
});

export const head: DocumentHead = {
  title: "About | Poopmail",
  meta: [
    {
      name: "description",
      content:
        "Learn about Poopmail - a temporary email service by tsbin.tech. Privacy-focused, open-source, and completely free with no data collection.",
    },
  ],
};
