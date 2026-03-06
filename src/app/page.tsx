import { cookies } from "next/headers";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import HowItWorks from "@/components/HowItWorks";
import WhoItsFor from "@/components/WhoItsFor";
import Mission from "@/components/Mission";
import ProofBar from "@/components/ProofBar";
import SignUpForm from "@/components/SignUpForm";
import Footer from "@/components/Footer";

// Force dynamic rendering to ensure client components work
export const dynamic = "force-dynamic";

export default function Home() {
  // Access cookies to trigger dynamic rendering
  cookies();
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <WhoItsFor />
      <Mission />
      <ProofBar />
      <SignUpForm />
      <Footer />
    </>
  );
}
