import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // When hosted on GitHub Pages as a project site (username.github.io/<repo>/),
  // VITE base is /<repo>/ and the router must strip routes under that prefix.
  const base = import.meta.env.BASE_URL || "/";
  const basepath = base === "/" ? "/" : base.replace(/\/$/, "");

  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
