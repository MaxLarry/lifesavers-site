import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Book your student drug testing appointment with Lifesaver. Fast, easy, and stress-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
