
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

import Footer from "../components/Footer";
import Header from "./Home/Header";
import BuiltTo from "./Home/BuiltTo";
import Pricing from "./Home/Pricing";
import Frequently from "./Home/Frequently";
import Questions from "./Home/Questions";

function Home() {

  return (
    <>
      <body
        style={{
          backgroundColor: " var(--color-11)"
        }}
      >


        <HeaderMegaMenu />

        <Header />
        <BuiltTo />
        <Pricing />
        <Frequently />
        <Questions />
        <Footer />
      </body>

    </>
  );
}

export default Home;
