import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Pemilihan OSIS by SMK Metland Cibitung" },
      { name: "description", content: "Pemilihan Ketua OSIS digital yang cepat, aman, dan transparan." },
      { property: "og:title", content: "Pemilihan OSIS — SMK Metland Cibitung" },
      { property: "og:description", content: "Pemilihan Ketua OSIS digital yang cepat, aman, dan transparan." },
    ],
  }),
});
