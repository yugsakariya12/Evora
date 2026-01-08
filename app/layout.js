import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ConvexClientProvider } from "./convexclientprovider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "evora",
  description: "Discover and create amazing events...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>

    <body
  className="bg-gradient-to-br from-gray-950 via-zinc-900 to-stone-900 text-white"
>
 <ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
>
  

          <ClerkProvider
  appearance={{ theme: dark }}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/"
  afterSignUpUrl="/"
>

          <ConvexClientProvider>
  <main className="relative min-h-screen container mx-auto pt-40 md:pt-32">
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" >
      <div className="absolute top-0 left-1/4 w-50 h-50 bg-pink-600/20 rouded-full blur-3xl"/>
      <div className="absolute bottom-0 right-1/4 w-50 h-50 bg-orange-600/20 rouded-full blur-3xl"/>
    </div>
<Header/>
    <div className="relative z-10 min-h-[70vh]">
  {children}
</div>
<Toaster position="top-center" richColors/>
  </main>
 </ConvexClientProvider>
  </ClerkProvider>
 </ThemeProvider>

</body>

    </html>
  );
}
