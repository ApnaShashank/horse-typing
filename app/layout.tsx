import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import Script from "next/script";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://horsetyping.vercel.app"),
  title: {
    default: "Horse Typing | Free Touch Typing Test & Practice",
    template: "%s | Horse Typing"
  },
  description: "Improve your touch typing with Horse Typing. Practice in English and Hindi InScript, customize virtual keyboards, track real-time WPM/accuracy, view analytics, and rank on the global leaderboard.",
  keywords: [
    "typing practice", "typing test", "hindi typing", "inscript typing", "touch typing", 
    "keyboard speed test", "typing tutor", "horse typing", "wpm test", "learn touch typing",
    "speed typing", "keyboard test", "free typing tutor", "hindi keyboard practice"
  ],
  authors: [{ name: "ApnaShashank" }],
  icons: {
    icon: "https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png",
    shortcut: "https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png",
    apple: "https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png",
  },
  openGraph: {
    title: "Horse Typing | Free Touch Typing Test & Practice",
    description: "Improve your touch typing with English and Hindi InScript support, visual keyboard guides, rich settings, and detailed analytics.",
    url: "https://horsetyping.vercel.app",
    siteName: "Horse Typing",
    images: [
      {
        url: "https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png",
        width: 512,
        height: 512,
        alt: "Horse Typing Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Horse Typing | Free Touch Typing Test & Practice",
    description: "Improve your touch typing with English and Hindi InScript support, visual keyboard guides, rich settings, and detailed analytics.",
    images: ["https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('ht_theme') === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface" suppressHydrationWarning>
        <Navbar />
        <main className="grow">{children}</main>
        <ConditionalFooter />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
