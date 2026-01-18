import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  return (
    <footer class="flex items-center justify-between px-2 max-sm:flex-col">
      <p>&copy; 2026, Poopmail, an open-source project.</p>
      <div class="space-x-4">
        <a href="/toc">Terms of Use</a>
        <a href="/about">About</a>
      </div>
    </footer>
  );
});
