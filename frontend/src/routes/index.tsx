import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  zod$,
  z,
  type DocumentHead,
  Form,
  useNavigate,
} from "@builder.io/qwik-city";
import { LuSend } from "@qwikest/icons/lucide";
import { ID } from "appwrite";
import { generate } from "random-words";
import { Footer } from "~/components/core/footer";
import { Navbar } from "~/components/core/navbar";
import { appwriteConfig, Mail, tablesDB } from "~/lib/appwrite";
import { API_URL } from "~/lib/constants";
import { makeCustomAddress } from "~/lib/email";
import { createExpiry } from "~/lib/utils";

export const useInitialEmail = routeAction$(
  async (v, { fail }) => {
    try {
      let address;

      if (!v.username) {
        const randomUsername = (generate(2) as string[]).join("");
        address = makeCustomAddress(randomUsername);
      } else {
        address = makeCustomAddress(v.username);
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

      return { success: true, data: { email } };
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

  const renderError = (errorMessage: string | undefined) => {
    if (!errorMessage) return null;
    return <span class="text-red-500">{errorMessage}</span>;
  };

  return (
    <div class="flex min-h-screen w-full flex-col">
      <Navbar />
      <section class="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center">
        <div class="flex flex-col rounded border-2 bg-[#1111]/80 p-4">
          <div>
            <h3>Your Temporary Email Address</h3>
          </div>
          <Form
            onSubmit$={async (e) => {
              const rs = await action.submit(e);
              if (rs.status == 200) {
                nav(`/email/${rs.value.data?.email}`);
              }
            }}
            class="flex h-full w-full items-start justify-center space-x-1"
          >
            <div class="relative flex flex-col">
              <input
                name="username"
                class="h-11 px-2 text-xl"
                type="text"
                placeholder="Enter the username"
              />
              {renderError(action.value?.fieldErrors?.username)}
              {!action.value?.success && renderError(action.value?.error)}
            </div>

            <button
              class="h-12 w-14 items-center justify-center p-1"
              type="submit"
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
      </section>

      <Footer />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Poopmail",
  meta: [
    {
      name: "description",
      content: "A temp mail generator.",
    },
  ],
};
