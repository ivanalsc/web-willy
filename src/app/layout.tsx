import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { transducer } from "@/lib/fonts"



export const metadata: Metadata = {
  title: "SONGOD",
  description: "By Sergio Pérez",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={transducer.className}>
      <head>
         <link rel="stylesheet" href="https://use.typekit.net/ogk4wqu.css" />
      </head> 
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
