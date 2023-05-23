import { HeaderNav } from "@/components/HeaderNav/HeaderNav";
import { GlobalContextProvider } from "@/lib/ContextProvider";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <GlobalContextProvider>
                <HeaderNav />
                {children}
            </GlobalContextProvider>
        </section>
    );
}
