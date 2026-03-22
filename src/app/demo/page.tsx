import { cookies } from "next/headers";
import DemoPage from "@/components/DemoPage";

// Force dynamic rendering to ensure client components work
export const dynamic = "force-dynamic";

export default function Demo() {
  // Access cookies to trigger dynamic rendering
  cookies();
  return <DemoPage />;
}
