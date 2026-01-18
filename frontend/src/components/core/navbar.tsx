import { component$ } from "@builder.io/qwik";
import { LuExternalLink } from "@qwikest/icons/lucide";

export const Navbar = component$(() => {
  return (
    <nav class="flex items-center justify-between p-2 text-xl">
      <a class="underline-offset-2 hover:underline" href="/">
        Poopmail
      </a>
      <a
        class="flex items-start space-x-1 underline-offset-2 hover:underline"
        href="https://github.com/PriyanshuPz/poopmail"
      >
        Star on Github <LuExternalLink font-size={16} />
      </a>
    </nav>
  );
});
