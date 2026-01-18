import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, Link } from "@builder.io/qwik-city";
import { appwriteConfig, Query, tablesDB } from "~/lib/appwrite";
import { Navbar } from "~/components/core/navbar";
import { Footer } from "~/components/core/footer";

export const useMailBox = routeLoader$(async (req) => {
  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.db,
    tableId: appwriteConfig.mails,
    queries: [
      Query.equal("address", req.params.address),
      Query.greaterThan("expiresAt", new Date().toISOString()),
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
  return data;
});

export default component$(() => {
  const loc = useLocation();
  const mailbox = useMailBox();

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
        {loc.isNavigating && <div class="text-center">Loading...</div>}

        {mailbox.value && (
          <div class="flex flex-col space-y-4">
            <div class="rounded border-2 bg-[#1111]/80 p-4">
              <h1 class="mb-2 text-2xl font-bold">Mailbox</h1>
              <div class="space-y-2">
                <p class="text-lg break-all">
                  <span class="font-semibold">Address:</span>{" "}
                  {mailbox.value.address}
                </p>
                <p>
                  <span class="font-semibold">Expires in:</span>{" "}
                  {getTimeRemaining(mailbox.value.expiresAt)}
                </p>
                <p class="text-sm opacity-80">
                  Expiry date: {formatDate(mailbox.value.expiresAt)}
                </p>
              </div>
              <div class="mt-4 border-t-2 pt-4">
                <p class="text-sm opacity-90">
                  This mailbox will automatically expire in 24 hours. All
                  messages will be permanently deleted.
                </p>
              </div>
            </div>

            <div class="rounded border-2 bg-[#1111]/80 p-4">
              <h2 class="mb-4 text-xl font-bold">Messages</h2>

              {mailbox.value.messages && mailbox.value.messages.length > 0 ? (
                <div class="space-y-3">
                  {mailbox.value.messages.map((message: any, index: number) => (
                    <Link
                      key={index}
                      href={`/email/${loc.params.address}/message/${message.$id}`}
                      class="block border-2 p-3 transition-colors hover:bg-[#2222]/50"
                    >
                      <div class="space-y-1">
                        <p class="text-lg font-semibold">
                          {message.subject || "(No Subject)"}
                        </p>
                        <p class="text-sm">
                          <span class="opacity-80">From:</span> {message.from}
                        </p>
                        <p class="text-sm">
                          <span class="opacity-80">To:</span> {message.to}
                        </p>
                        <p class="text-xs opacity-70">
                          {formatDate(message.$createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div class="border-2 p-4 text-center opacity-70">
                  <p>No messages yet.</p>
                  <p class="mt-2 text-sm">
                    Messages sent to {mailbox.value.address} will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!mailbox.value && !loc.isNavigating && (
          <div class="rounded border-2 bg-[#1111]/80 p-4 text-center">
            <p class="text-lg">Mailbox not found or has expired.</p>
            <Link
              href="/"
              class="mt-4 inline-block border-2 px-4 py-2 hover:bg-[#2222]/50"
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
