import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  routeAction$,
  zod$,
  z,
  type DocumentHead,
  Form,
  useNavigate,
  Link,
} from "@builder.io/qwik-city";
import { LuSend } from "@qwikest/icons/lucide";
import { ID, Query } from "appwrite";
import { generate } from "random-words";
import { Footer } from "~/components/core/footer";
import { Navbar } from "~/components/core/navbar";
import { appwriteConfig, Mail, tablesDB } from "~/lib/appwrite";
import { makeCustomAddress } from "~/lib/email";
import { createExpiry } from "~/lib/utils";
import { isReservedUsername, getReservedUsernameError } from "~/lib/reserved";

export const useInitialEmail = routeAction$(
  async (v, { fail }) => {
    try {
      let address;

      if (!v.username) {
        const randomUsername = (generate(2) as string[]).join("");
        address = makeCustomAddress(randomUsername);
      } else {
        if (isReservedUsername(v.username)) {
          return fail(400, {
            success: false,
            error: getReservedUsernameError(v.username),
          });
        }

        address = makeCustomAddress(v.username);
      }

      const existingMailbox = await tablesDB.listRows({
        databaseId: appwriteConfig.db,
        tableId: appwriteConfig.mails,
        queries: [Query.equal("address", address), Query.limit(1)],
      });

      if (existingMailbox.rows.length > 0) {
        const existing = existingMailbox.rows[0];
        const now = new Date();
        const expiresAt = new Date(existing.expiresAt);

        if (expiresAt > now) {
          return fail(400, {
            success: false,
            error: "This mailbox already exists and has not expired yet.",
          });
        }

        try {
          await tablesDB.deleteRow({
            databaseId: appwriteConfig.db,
            tableId: appwriteConfig.mails,
            rowId: existing.$id,
          });
        } catch (deleteError) {
          console.error("Error deleting expired mailbox:", deleteError);
        }
      }

      const payload: Mail = {
        address: address,
        expiresAt: createExpiry(),
      };
      const promise = await tablesDB.createRow({
        databaseId: appwriteConfig.db,
        tableId: appwriteConfig.mails,
        rowId: ID.unique(),
        data: payload,
      });

      const email = promise.address;

      return {
        success: true,
        data: { email, expiresAt: promise.expiresAt },
      };
    } catch (error: any) {
      return fail(500, {
        success: false,
        error: error.message,
      });
    }
  },
  zod$({
    username: z
      .string()
      .optional()
      .refine(
        (v) => {
          if (!v) {
            return "pass";
          }
          if (v.length > 3) return v;
        },
        {
          message: "Username should be at least 3 characters long.",
        },
      ),
  }),
);

export default component$(() => {
  const action = useInitialEmail();
  const nav = useNavigate();
  const savedMailboxes = useSignal<
    Array<{ address: string; expiresAt: string }>
  >([]);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("poopmail_mailboxes");
      if (stored) {
        try {
          const mailboxes = JSON.parse(stored);
          const now = new Date();
          const validMailboxes = mailboxes.filter((m: any) => {
            const expiresAt = new Date(m.expiresAt);
            return expiresAt > now;
          });
          savedMailboxes.value = validMailboxes;
          localStorage.setItem(
            "poopmail_mailboxes",
            JSON.stringify(validMailboxes),
          );
        } catch (e) {
          console.error("Error parsing saved mailboxes:", e);
          localStorage.removeItem("poopmail_mailboxes");
        }
      }
    }
  });

  const saveMailboxToLocalStorage = $((address: string, expiresAt: string) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("poopmail_mailboxes");
      const mailboxes = stored ? JSON.parse(stored) : [];
      const exists = mailboxes.some((m: any) => m.address === address);
      if (!exists) {
        mailboxes.push({ address, expiresAt });
        localStorage.setItem("poopmail_mailboxes", JSON.stringify(mailboxes));
        savedMailboxes.value = mailboxes;
      }
    }
  });

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderError = (errorMessage: string | undefined) => {
    if (!errorMessage) return null;
    return <span class="text-red-500">{errorMessage}</span>;
  };

  return (
    <div class="flex min-h-screen w-full flex-col">
      <Navbar />
      <section class="mx-auto flex flex-1 flex-col items-center justify-center px-4">
        <div class="flex w-full flex-col space-y-4">
          <div class="flex flex-col rounded border-2 bg-[#1111]/80 p-4 sm:min-w-xl">
            <div class="mb-4">
              <h1 class="text-xl font-bold sm:text-2xl">
                Your Temporary Email Address
              </h1>
            </div>
            <Form
              onSubmit$={async (e) => {
                const rs = await action.submit(e);
                if (rs.status == 200) {
                  if (rs.value.data?.email && rs.value.data?.expiresAt) {
                    saveMailboxToLocalStorage(
                      rs.value.data.email,
                      rs.value.data.expiresAt,
                    );
                  }
                  nav(`/email/${rs.value.data?.email}`);
                }
              }}
              class="flex h-full w-full flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-start"
            >
              <div class="relative flex flex-1 flex-col">
                <label for="username" class="sr-only">
                  Enter username for your temporary email
                </label>
                <input
                  id="username"
                  name="username"
                  class="h-11 px-3 text-base sm:text-xl"
                  type="text"
                  placeholder="Enter the username"
                  aria-describedby="username-error"
                  aria-invalid={
                    !!action.value?.fieldErrors?.username ||
                    !action.value?.success
                  }
                />
                <div id="username-error" role="alert" aria-live="polite">
                  {renderError(action.value?.fieldErrors?.username)}
                  {!action.value?.success && renderError(action.value?.error)}
                </div>
              </div>

              <button
                class="flex h-11 w-full items-center justify-center p-1 transition-colors hover:bg-[#2222]/50 sm:h-12 sm:w-14"
                type="submit"
                aria-label="Create temporary mailbox"
              >
                <LuSend font-size={20} />
              </button>
            </Form>
            <div>
              <p>Temp Mail Service Your mails are public.</p>
              <ul>
                <li>Don't use it for important mails.</li>
                <li>Use it to subscribe to all unwanted services.</li>
                <li>
                  Your mails will be cleared from the database to prevent junk
                  after 24 hours.
                </li>
                <li>Please save all the data that you might need later!</li>
              </ul>
            </div>
          </div>

          {savedMailboxes.value.length > 0 && (
            <div class="flex flex-col rounded border-2 bg-[#1111]/80 p-4 sm:min-w-xl">
              <h2 class="mb-3 text-lg font-semibold sm:text-xl">
                Your Active Mailboxes
              </h2>
              <div class="space-y-2">
                {savedMailboxes.value.map((mailbox, index) => (
                  <Link
                    key={index}
                    href={`/email/${mailbox.address}`}
                    class="block min-h-15 border-2 p-3 transition-colors hover:bg-[#2222]/50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none active:bg-[#2222]/70 sm:p-4"
                    aria-label={`View mailbox ${mailbox.address}, expires in ${formatTimeRemaining(mailbox.expiresAt)}`}
                  >
                    <p class="text-sm font-semibold break-all sm:text-base">
                      {mailbox.address}
                    </p>
                    <p class="mt-1 text-xs opacity-80 sm:text-sm">
                      Expires in: {formatTimeRemaining(mailbox.expiresAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Poopmail - Free Temporary Email Service",
  meta: [
    {
      name: "description",
      content:
        "Create instant temporary email addresses. No registration required. Emails auto-delete after 24 hours. Privacy-focused disposable email by tsbin.tech.",
    },
    {
      name: "keywords",
      content:
        "temporary email, disposable email, temp mail, fake email, anonymous email, no registration email",
    },
  ],
};
