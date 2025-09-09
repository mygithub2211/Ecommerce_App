/*import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700&display=swap');
  body{
    background-color:#eee;
    padding:0;
    margin:0;
    font-family:"Poppins", sans-serif;
  }
`


export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}*/


// pages/_app.js (or app/layout.js if using App Router)
import { createGlobalStyle } from "styled-components";
import { Poppins } from "next/font/google";
import { CartContextProvider } from "@/components/CartContext";

// ✅ Load only the weights you need
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: "Poppins", sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <main className={poppins.className}>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </main>
  );
}
