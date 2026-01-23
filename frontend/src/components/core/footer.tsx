import { component$ } from "@builder.io/qwik";
import moment from "moment";

const buildTime = import.meta.env.PUBLIC_BUILD_TIME || new Date().toISOString();
const commitHash = import.meta.env.VERCEL_GIT_COMMIT_SHA || "unknown";

export const Footer = component$(() => {
  const timeAgo = moment(buildTime).fromNow();

  return (
    <footer class="flex items-center justify-between px-2 py-4 text-sm max-sm:flex-col max-sm:gap-2">
      <div class="flex flex-col max-sm:text-center">
        <p>&copy; 2026, Poopmail, an open-source project.</p>
        <p class="text-xs opacity-70">
          Built {timeAgo} •{" "}
          <a
            href={`https://github.com/PriyanshuPz/poopmail/commit/${commitHash}`}
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline"
          >
            {commitHash.slice(0, 7)}
          </a>
        </p>
      </div>
      <div class="space-x-4">
        <a href="/toc" class="hover:underline">
          Terms of Use
        </a>
        <a href="/about" class="hover:underline">
          About
        </a>
      </div>
    </footer>
  );
});
