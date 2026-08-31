import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import PortTable from "../components/landing/PorTable";
import Protocols from "../components/landing/Protocols";
import OsiModel from "../components/landing/OsiModel";
import Footer from "../components/layout/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <PortTable />
      <Protocols />
      <OsiModel />
      <Footer />
    </>
  );
}

export default LandingPage;
