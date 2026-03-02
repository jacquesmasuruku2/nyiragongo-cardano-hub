import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-16">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
