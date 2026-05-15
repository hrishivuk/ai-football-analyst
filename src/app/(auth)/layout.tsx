/** Do not statically prerender auth pages — avoids Supabase URL errors during `next build`. */
export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
