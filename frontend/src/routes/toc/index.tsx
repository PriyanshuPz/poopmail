import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "~/components/core/footer";
import { Navbar } from "~/components/core/navbar";

export default component$(() => {
  return (
    <main class="flex min-h-screen w-full flex-col">
      <Navbar />

      <section class="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center">
        <div class="flex flex-col rounded border-2 bg-[#1111]/80 p-4">
          <span>
            This project should be used for legal purpose only. We do not store
            any email more than 24 hrs. And we do not support illegal activites
            the project is open-source and full source code is public.
          </span>
        </div>
      </section>

      <Footer />
    </main>
  );
});

export const head: DocumentHead = {
  title: "ToC | Poopmail",
  meta: [
    {
      name: "description",
      content: "A temp mail generator.",
    },
  ],
};
