import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({ 
  subsets: ["latin"] , 
  variable : '--font-work-sans', 
  weight: ['400', '600', '700']

});

export const metadata: Metadata = {
  title: "Minimalist Figma",
  description: "A minimalist figma project using Fabric.js & Liveblocks for Realtime Collab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} text-white bg-[#020817]`}>
        <Room>
          {children}
        </Room>
        
      </body>
    </html>
  );
}
