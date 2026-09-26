import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/kf/AppLayout";

export const Route = createFileRoute("/_app")({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
