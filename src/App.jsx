
import MiladNavbar from "./components/MiladNavbar";
import "./index.css";

export default function App() {
  return (
    <main className="milad-page" id="home">
      <MiladNavbar />

      <section className="milad-intro">
        <p className="milad-intro-label">
          WELCOME TO MILAD NEXUS
        </p>

        <h1>
          Explore the <span>Future.</span>
        </h1>

        <p className="milad-intro-description">
          Technology, AI & creativity — all in one place.
        </p>
      </section>
    </main>
  );
}