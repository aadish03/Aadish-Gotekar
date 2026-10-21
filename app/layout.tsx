import type { Metadata } from "next";
import { Syne, Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { identity } from "@/lib/content";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Hero name only: conventional letterforms with a width axis for a wide, confident set.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${identity.name} — ${identity.role}`,
  description: identity.summary,
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: identity.summary,
    type: "website",
  },
};

// Applies a saved dark preference before first paint. Light is the default,
// so the absence of a stored value leaves <html> without data-theme.
const themeInit = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${archivo.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="grain min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
