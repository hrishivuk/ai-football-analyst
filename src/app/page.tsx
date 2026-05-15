import { redirect } from "next/navigation";

/** Avoid Supabase on `/` — middleware handles auth; prevents 500 when env is unset on Vercel. */
export default function Home() {
  redirect("/login");
}
