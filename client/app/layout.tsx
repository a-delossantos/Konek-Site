import { Providers } from "@/lib/Providers";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav/HeaderNav";

const mont = Montserrat({ subsets: ["latin"] });

export const metadata = {
    title: "Konek",
    description: "Konek Social Media",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={mont.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
