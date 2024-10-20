import "./globals.css";
import Providers from "./Providers";
import Navbar from "./componets/Navbar";
import Search from "./componets/Search";
import Footer from "./componets/Footer";


export const metadata = {
  title: "Movies",
  description: "This is movies web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Providers >
        <Navbar />
        <Search /> 
        {children}
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
