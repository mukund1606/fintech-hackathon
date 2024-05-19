import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/providers";
import { TRPCReactProvider } from "@/trpc/react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "@/components/navbar/header";
import Sidebar from "@/components/navbar/sidebar";
import { getServerAuthSession } from "@/server/auth";

export const metadata = {
  title: "Nexus",
  icons: { apple: "/logo.png" },
};

export const viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1.0,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = session?.user;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#09090b" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen w-full">
        <Providers attribute="class" defaultTheme="light" enableSystem>
          <TRPCReactProvider>
            <Header user={user} />
            <div className="flex">
              {user && <Sidebar user={user} />}
              <div className="w-full p-4 md:ml-16 md:p-6">{children}</div>
            </div>
            <ReactQueryDevtools />
          </TRPCReactProvider>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
