
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

import Footer from "../components/Footer";
import Header from "./Home/header";
import BuiltTo from "./Home/BuiltTo";
import Pricing from "./Home/Pricing";

function Home() {

  return (
    <>
       {/* <body
        style={{
          backgroundColor: " var(--color-11)"
        }}> */}


        <HeaderMegaMenu />

        <Header />
        <BuiltTo />
        <Pricing />

        <Footer></Footer>
      {/* </body> */}

    </>
  );
}

export default Home;
