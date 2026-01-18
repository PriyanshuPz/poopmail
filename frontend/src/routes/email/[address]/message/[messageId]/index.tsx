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

        <div class="mb-4">
          <Link
            href={`/email/${loc.params.address}`}
            class="inline-block border-2 px-4 py-2 transition-colors hover:bg-[#2222]/50"
          >
            Back to Mailbox
          </Link>
        </div>

        {message.value?.error && (
          <div class="min-w-xl rounded border-2 border-red-500 bg-[#1111]/80 p-4 text-center">
            <p class="text-lg text-red-500">Error loading message</p>
            <p class="mt-2 text-sm">{message.value.error}</p>
            <Link
              href={`/email/${loc.params.address}`}
              class="mt-4 inline-block border-2 px-4 py-2 hover:bg-[#2222]/50"
            >
              Back to Mailbox
            </Link>
          </div>
        )}

        {message.value?.success && message.value.data && (
          <div class="flex min-w-xl flex-col space-y-4">
            <div class="rounded border-2 bg-[#1111]/80 p-4">
              <h1 class="mb-4 text-2xl font-bold wrap-break-word">
                {message.value.data.subject || "(No Subject)"}
              </h1>

              <div class="mb-4 space-y-2 border-b-2 pb-4">
                <div class="grid grid-cols-1 gap-2">
                  <p class="break-all">
                    <span class="font-semibold">From:</span>{" "}
                    {message.value.data.from}
                  </p>
                  <p class="break-all">
                    <span class="font-semibold">To:</span>{" "}
                    {message.value.data.to}
                  </p>
                  <p>
                    <span class="font-semibold">Date:</span>{" "}
                    {formatDate(message.value.data.$createdAt)}
                  </p>
                </div>
              </div>

              <div class="border-2 bg-white p-4 text-black">
                {message.value.data.html ? (
                  <div dangerouslySetInnerHTML={message.value.data.html} />
                ) : message.value.data.text ? (
                  <pre class="font-sans whitespace-pre-wrap">
                    {message.value.data.text}
                  </pre>
                ) : (
                  <p class="opacity-70">No message content available.</p>
                )}
              </div>
            </div>

            <div class="rounded border-2 bg-[#1111]/80 p-4">
              <p class="text-sm opacity-80">
                This message will be automatically deleted when the mailbox
                expires.
              </p>
            </div>
          </div>
        )}

        {message.value?.success && !message.value.data && !loc.isNavigating && (
          <div class="rounded border-2 bg-[#1111]/80 p-4 text-center">
            <p class="text-lg">Message not found or has expired.</p>
            <Link
              href={`/email/${loc.params.address}`}
              class="mt-4 inline-block border-2 px-4 py-2 hover:bg-[#2222]/50"
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
