import type { Metadata } from "next";
import { DM_Sans, Inter_Tight } from "next/font/google";
import { SITE } from "@/lib/copy";
import VariantInitializer from "@/components/VariantInitializer";
import ScrollTrackerClient from "@/components/ScrollTrackerClient";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: "website",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${interTight.variable}`}>
      <head>
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false,anonymize_ip:true});`,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <VariantInitializer />
        <ScrollTrackerClient />
        {children}
      </body>
    </html>
  );
}
