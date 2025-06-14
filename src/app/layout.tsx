import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lifesaver Drug Testing | Student Booking",
  description: "Book your student drug testing appointment with Lifesaver. Fast, easy, and stress-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
