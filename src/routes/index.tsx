import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { ClientPosterStudio } from "@/components/layout/ClientPosterStudio";
import { requirePlayableUser } from "@/lib/requirePlayableUser";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    return { auth: await requirePlayableUser(location.pathname) };
  },
  head: () => ({
    meta: [
      { title: "Poster Studio" },
      {
        name: "description",
        content: "Design posters with code — live TSX preview and export.",
      },
      { property: "og:title", content: "Poster Studio" },
      {
        property: "og:description",
        content: "Design posters with code — live TSX preview and export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Poster Studio" },
      {
        name: "twitter:description",
        content: "Design posters with code — live TSX preview and export.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { auth } = Route.useRouteContext();
  return (
    <AuthGate initial={auth} routerPath="/">
      <ClientPosterStudio />
    </AuthGate>
  );
}
