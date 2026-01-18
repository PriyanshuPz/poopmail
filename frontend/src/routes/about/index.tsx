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

            <div class="space-y-4">
              <p>
                Poopmail is a temporary email service that allows you to create
                disposable email addresses for testing, signing up for services,
                or avoiding spam in your primary inbox.
              </p>

              <p>
                This service is a subpart of <strong>tsbin.tech</strong>, a
                temporary file bin project designed to provide ephemeral digital
                resources without the hassle of permanent storage.
              </p>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Key Features</h2>
                <ul class="space-y-2">
                  <li>• Instant temporary email addresses</li>
                  <li>• No registration or signup required</li>
                  <li>• 24-hour automatic expiration</li>
                  <li>• No data collection or tracking</li>
                  <li>• Open-source and transparent</li>
                  <li>• Simple, accessible interface</li>
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
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">Use Cases</h2>
                <ul class="space-y-2">
                  <li>• Testing email functionality in applications</li>
                  <li>• Signing up for newsletters without spam</li>
                  <li>• One-time verifications</li>
                  <li>• Avoiding unwanted marketing emails</li>
                  <li>• Quick disposable communication</li>
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
