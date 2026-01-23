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
            <h1 class="mb-4 text-3xl font-bold">Terms and Conditions</h1>

            <div class="space-y-4">
              <p class="text-sm opacity-90">Last updated: January 18, 2026</p>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">
                  1. Service Description
                </h2>
                <p>
                  Poopmail is a temporary email service provided as part of
                  tsbin.tech. The service creates disposable email addresses
                  that automatically expire after 24 hours.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">2. Legal Use Only</h2>
                <p>
                  This service must be used for legal purposes only. We do not
                  support or condone any illegal activities. Users are
                  responsible for ensuring their use complies with all
                  applicable laws and regulations.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">
                  3. Privacy and Analytics
                </h2>
                <p>
                  We do not collect, store, or track any personal information
                  about our users. We do not use cookies for tracking purposes.
                  Your privacy is paramount.
                </p>
                <p class="mt-3">
                  We use Vercel Analytics for fair use monitoring only. This
                  helps us implement rate limiting to ensure service quality and
                  detect/report abuse or malicious activity. Analytics data is
                  minimal, anonymized, and used solely to maintain service
                  stability and prevent misuse. No personal information is
                  collected through analytics.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">4. Temporary Storage</h2>
                <p>
                  All mailboxes and their associated emails are temporary and
                  will be automatically deleted after 24 hours from creation. We
                  do not store emails beyond this period. Users should save any
                  important information before the mailbox expires.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">
                  5. Public Nature of Service
                </h2>
                <p>
                  All emails received through this service should be considered
                  public. Do not use Poopmail for sensitive, confidential, or
                  important communications. This service is intended for
                  temporary, non-critical use cases only.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">6. No Warranty</h2>
                <p>
                  This service is provided "as is" without any warranties. We do
                  not guarantee uninterrupted service, email delivery, or data
                  preservation. Use at your own risk.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">7. Prohibited Uses</h2>
                <ul class="space-y-2">
                  <li>Illegal activities or fraud</li>
                  <li>Harassment or spam</li>
                  <li>Impersonation or identity theft</li>
                  <li>Circumventing security measures</li>
                  <li>Any activity that violates applicable laws</li>
                </ul>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">8. Open Source</h2>
                <p>
                  This project is open-source and the full source code is
                  publicly available. You are free to review, fork, and
                  self-host the service according to the project's license
                  terms.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">
                  9. Service Modifications
                </h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue the
                  service at any time without prior notice. We are not liable
                  for any consequences resulting from service changes or
                  interruptions.
                </p>
              </div>

              <div class="mt-6 border-t-2 pt-4">
                <h2 class="mb-3 text-xl font-semibold">10. Contact</h2>
                <p>
                  For questions or concerns regarding these terms, please visit
                  the project's repository or contact through the official
                  tsbin.tech channels.
                </p>
              </div>

              <div class="mt-6 rounded border-2 bg-[#2222]/50 p-4">
                <p class="text-sm">
                  By using Poopmail, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms and
                  Conditions.
                </p>
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
  title: "Terms and Conditions | Poopmail",
  meta: [
    {
      name: "description",
      content:
        "Terms and Conditions for Poopmail temporary email service. Privacy-focused, no data collection, 24-hour automatic deletion.",
    },
  ],
};
