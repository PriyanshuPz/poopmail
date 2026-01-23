import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { inject } from "@vercel/analytics";

interface AnalyticsProps {
  debug?: boolean;
  mode?: "auto" | "development" | "production";
}

export const Analytics = component$<AnalyticsProps>(
  ({ debug = false, mode = "auto" }) => {
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      inject({ mode, debug });
    });

    return null;
  },
);
