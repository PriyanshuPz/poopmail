import { component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  Link,
  DocumentHead,
} from "@builder.io/qwik-city";
import { appwriteConfig, Query, tablesDB } from "~/lib/appwrite";
import { Navbar } from "~/components/core/navbar";
import { Footer } from "~/components/core/footer";

export const useMailBox = routeLoader$(async (req) => {
  try {
    const now = new Date().toISOString();
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.db,
      tableId: appwriteConfig.mails,
      queries: [
        Query.equal("address", req.params.address),
        Query.greaterThan("expiresAt", now),
        Query.limit(1),
        Query.select([
          "address",
          "active",
          "expiresAt",
          "messages.from",
          "messages.to",
          "messages.html",
          "messages.subject",
          "messages.expiresAt",
        ]),
      ],
    });

    const data = response.rows[0];
    return { success: true, data, error: null };
  } catch (error: any) {
    console.error("Error loading mailbox:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Failed to load mailbox",
    };
  }
});

export default component$(() => {
  const loc = useLocation();
  const mailbox = useMailBox();

  useVisibleTask$(({ track }) => {
    track(() => mailbox.value);

    if (
      mailbox.value?.success &&
      mailbox.value.data &&
      typeof window !== "undefined"
    ) {
      const stored = localStorage.getItem("poopmail_mailboxes");
      const mailboxes = stored ? JSON.parse(stored) : [];

      const exists = mailboxes.some(
        (m: any) => m.address === mailbox.value.data?.address,
      );
      if (!exists) {
        mailboxes.push({
          address: mailbox.value.data.address,
          expiresAt: mailbox.value.data.expiresAt,
        });
        localStorage.setItem("poopmail_mailboxes", JSON.stringify(mailboxes));
      }
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div class="flex min-h-screen w-full flex-col">
      <Navbar />
      <main class="mx-auto flex max-w-4xl flex-1 flex-col p-4">
        <nav
          class="mb-4 flex items-center space-x-2 text-sm sm:text-base"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            class="transition-colors hover:text-white/80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
          >
            Home
          </Link>
          <span class="opacity-50">/</span>
          <span class="opacity-80">Mailbox</span>
        </nav>

        {loc.isNavigating && <div class="text-center">Loading...</div>}

        {mailbox.value?.error && (
          <div
            class="w-full rounded border-2 border-red-500 bg-[#1111]/80 p-4 text-center sm:p-6"
            role="alert"
          >
            <p class="text-base font-semibold text-red-500 sm:text-lg">
              Error loading mailbox
            </p>
            <p class="mt-2 text-sm wrap-break-word">{mailbox.value.error}</p>
            <Link
              href="/"
              class="mt-4 inline-block min-h-11 border-2 px-4 py-2 transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70"
            >
              Go to Home
            </Link>
          </div>
        )}

        {mailbox.value?.success && mailbox.value.data && (
          <div class="flex w-full flex-col space-y-4">
            <div class="rounded border-2 bg-[#1111]/80 p-4 sm:p-6">
              <h1 class="mb-4 text-xl font-bold sm:text-2xl">Mailbox</h1>
              <div class="space-y-2 sm:space-y-3">
                <div class="wrap-break-word">
                  <span class="block text-sm font-semibold sm:inline sm:text-base">
                    Address:
                  </span>{" "}
                  <span class="text-sm sm:text-lg">
                    {mailbox.value.data.address}
                  </span>
                </div>
                <p class="text-sm sm:text-base">
                  <span class="font-semibold">Expires in:</span>{" "}
                  {getTimeRemaining(mailbox.value.data.expiresAt)}
                </p>
                <p class="text-xs opacity-80 sm:text-sm">
                  Expiry date: {formatDate(mailbox.value.data.expiresAt)}
                </p>
              </div>
              <div class="mt-4 border-t-2 pt-4">
                <p class="text-xs opacity-90 sm:text-sm">
                  This mailbox will automatically expire in 24 hours. All
                  messages will be permanently deleted.
                </p>
              </div>
            </div>

            <div class="rounded border-2 bg-[#1111]/80 p-4 sm:p-6">
              <h2 class="mb-4 text-lg font-bold sm:text-xl">Messages</h2>

              {mailbox.value.data.messages &&
              mailbox.value.data.messages.length > 0 ? (
                <div class="space-y-3" role="list" aria-label="Email messages">
                  {mailbox.value.data.messages.map(
                    (message: any, index: number) => (
                      <Link
                        key={index}
                        href={`/email/${loc.params.address}/message/${message.$id}`}
                        class="block min-h-20 border-2 p-3 no-underline transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70 sm:p-4"
                        role="listitem"
                        aria-label={`Read message: ${message.subject || "No Subject"} from ${message.from}`}
                      >
                        <div class="space-y-1">
                          <p class="text-base font-semibold wrap-break-word sm:text-lg">
                            {message.subject || "(No Subject)"}
                          </p>
                          <p class="text-xs break-all sm:text-sm">
                            <span class="opacity-80">From:</span> {message.from}
                          </p>
                          <p class="text-xs break-all sm:text-sm">
                            <span class="opacity-80">To:</span> {message.to}
                          </p>
                          <p class="text-xs opacity-70">
                            {formatDate(message.$createdAt)}
                          </p>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              ) : (
                <div class="border-2 p-4 text-center opacity-70 sm:p-6">
                  <p class="text-sm sm:text-base">No messages yet.</p>
                  <p class="mt-2 text-xs wrap-break-word sm:text-sm">
                    Messages sent to {mailbox.value.data.address} will appear
                    here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {mailbox.value?.success && !mailbox.value.data && !loc.isNavigating && (
          <div class="w-full rounded border-2 bg-[#1111]/80 p-4 text-center sm:p-6">
            <p class="text-base sm:text-lg">
              Mailbox not found or has expired.
            </p>
            <Link
              href="/"
              class="mt-4 inline-block min-h-11 border-2 px-4 py-2 transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70"
            >
              Create New Mailbox
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  const address = params.address;
  return {
    title: `Mailbox: ${address} | Poopmail`,
    meta: [
      {
        name: "description",
        content: `View messages for temporary email address ${address}. Messages automatically expire after 24 hours.`,
      },
    ],
  };
};
