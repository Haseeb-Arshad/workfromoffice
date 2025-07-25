import type { Metadata } from "next";
import { Itim } from "next/font/google";
import "@/presentation/styles/globals.css";
import JotaiProvider from "@/providers/JotaiProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

const font = Itim({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://workfromoffice.com"),
  title: "Work from Office | Award-Winning app for Focus & Productivity",
  description:
    "Virtual office environment designed for deep focus and remote work productivity. All-in-one workspace with integrated to-do lists, timers, notepads, music, and ambience for distraction-free work.",
  openGraph: {
    images: "/metadata/wfo-og.png",
    title: "Work from Office",
    description:
      "Virtual office environment designed for deep focus and remote work productivity. All-in-one workspace with integrated to-do lists, timers, notepads, music, and ambience for distraction-free work.",
    url: "https://workfromoffice.com",
    siteName: "Work from Office",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: "/metadata/wfo-og.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <JotaiProvider>{children}</JotaiProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
