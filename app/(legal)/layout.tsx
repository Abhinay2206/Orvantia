import Nav from "../components/navigation/Nav";
import Footer from "../components/ui/Footer";
import CustomCursor from "../components/ui/CustomCursor";
import SmoothScroll from "../components/providers/SmoothScroll";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grain" />
      <CustomCursor />
      <SmoothScroll>
        <Nav show={true} />
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
