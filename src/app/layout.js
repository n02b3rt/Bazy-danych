import localFont from "next/font/local";
import "../styles/globals.scss";


export const metadata = {
  title: "Magazyn",
  description: "Projekt na przedmiot Bazy danych",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={``}>
        {children}
      </body>
    </html>
  );
}
