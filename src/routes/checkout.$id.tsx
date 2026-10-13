import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/invoice/$id",
      params: { id: params.id },
    });
  },
  component: CheckoutRedirect,
});

function CheckoutRedirect() {
  return null;
}
