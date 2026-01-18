import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  return (
    <main>
      {loc.isNavigating && <p>Loading...</p>}
      <h1>User: {loc.params.address}</h1>
      <p>Current URL: {loc.url.href}</p>
    </main>
  );
});
