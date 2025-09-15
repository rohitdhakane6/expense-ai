import "./globals.css";
export { metadata } from "@/lib/site";
import Provider from "@/app/provider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const META_THEME_COLORS = {
    light: "#ffffff",
    dark: "#09090b",
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>

      <body className={`antialiased`} suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
