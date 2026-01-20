import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  Link,
  DocumentHead,
} from "@builder.io/qwik-city";
import { appwriteConfig, tablesDB } from "~/lib/appwrite";
import { Navbar } from "~/components/core/navbar";
import { Footer } from "~/components/core/footer";

export const useMessage = routeLoader$(async (req) => {
  try {
    const response = await tablesDB.getRow({
      databaseId: appwriteConfig.db,
      tableId: appwriteConfig.messages,
      rowId: req.params.messageId,
    });

    const data = response;
    return { success: true, data, error: null };
  } catch (error: any) {
    console.error("Error loading message:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Failed to load message",
    };
  }
});

export default component$(() => {
  const loc = useLocation();
  const message = useMessage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div class="flex min-h-screen w-full flex-col">
      <Navbar />
      <main class="mx-auto flex max-w-4xl flex-1 flex-col p-4">
        {loc.isNavigating && <div class="text-center">Loading...</div>}

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
          <Link
            href={`/email/${loc.params.address}`}
            class="max-w-50 truncate transition-colors hover:text-white/80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none sm:max-w-xs"
            title={loc.params.address}
          >
            {loc.params.address}
          </Link>
          <span class="opacity-50">/</span>
          <span class="opacity-80">Message</span>
        </nav>

        {message.value?.error && (
          <div
            class="w-full rounded border-2 border-red-500 bg-[#1111]/80 p-4 text-center sm:p-6"
            role="alert"
          >
            <p class="text-base font-semibold text-red-500 sm:text-lg">
              Error loading message
            </p>
            <p class="mt-2 text-sm wrap-break-word">{message.value.error}</p>
            <Link
              href={`/email/${loc.params.address}`}
              class="mt-4 inline-block min-h-11 border-2 px-4 py-2 transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70"
            >
              Back to Mailbox
            </Link>
          </div>
        )}

        {message.value?.success && message.value.data && (
          <article class="flex w-full flex-col space-y-4">
            <div class="rounded border-2 bg-[#1111]/80 p-4 sm:p-6">
              <h1 class="mb-4 text-lg font-bold wrap-break-word sm:text-2xl">
                {message.value.data.subject || "(No Subject)"}
              </h1>

              <div class="mb-4 space-y-2 border-b-2 pb-4">
                <div class="grid grid-cols-1 gap-2">
                  <p class="text-sm break-all sm:text-base">
                    <span class="font-semibold">From:</span>{" "}
                    {message.value.data.from}
                  </p>
                  <p class="text-sm break-all sm:text-base">
                    <span class="font-semibold">To:</span>{" "}
                    {message.value.data.to}
                  </p>
                  <p class="text-sm sm:text-base">
                    <span class="font-semibold">Date:</span>{" "}
                    {formatDate(message.value.data.$createdAt)}
                  </p>
                </div>
              </div>

              <div
                class="overflow-auto border-2 bg-white p-3 text-black sm:p-4"
                role="article"
                aria-label="Email content"
              >
                {message.value.data.html ? (
                  <div
                    class="overflow-wrap max-w-full wrap-break-word"
                    dangerouslySetInnerHTML={message.value.data.html}
                  />
                ) : message.value.data.text ? (
                  <pre class="font-sans text-sm wrap-break-word whitespace-pre-wrap sm:text-base">
                    {message.value.data.text}
                  </pre>
                ) : (
                  <p class="opacity-70">No message content available.</p>
                )}
              </div>
            </div>

            <div class="rounded border-2 bg-[#1111]/80 p-4 sm:p-6">
              <p class="text-xs opacity-80 sm:text-sm">
                This message will be automatically deleted when the mailbox
                expires.
              </p>
            </div>
          </article>
        )}

        {message.value?.success && !message.value.data && !loc.isNavigating && (
          <div class="w-full rounded border-2 bg-[#1111]/80 p-4 text-center sm:p-6">
            <p class="text-base sm:text-lg">
              Message not found or has expired.
            </p>
            <Link
              href={`/email/${loc.params.address}`}
              class="mt-4 inline-block min-h-11 border-2 px-4 py-2 transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70"
            >
              Back to Mailbox
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const message = resolveValue(useMessage);
  const subject = message?.data?.subject || "Message";

  return {
    title: `${subject} | Poopmail`,
    meta: [
      {
        name: "description",
        content: `View email message in temporary mailbox. This message will be automatically deleted when the mailbox expires.`,
      },
    ],
  };
};
