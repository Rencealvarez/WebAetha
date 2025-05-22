import React, { useEffect } from "react";
import "../styles/BundlesOfRights.css";
import BundlesOfRightsNavbar from "../components/BundlesOfRightsNavbar";
import bg33 from "../assets/images/36.png";
import DidYouKnowCard from "../components/DidYouKnowCard";

const BundlesOfRights = () => {
  useEffect(() => {
    setTimeout(() => {
      const heroSection = document.getElementById("rights-header");
      if (heroSection) {
        window.scrollTo({
          top: heroSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  return (
    <div className="bundles-page">
      <BundlesOfRightsNavbar />
      <section className="rights-header text-center" id="rights-header">
        <h1>36</h1>
        <h2>
          Specific Rights under Four Bundles of Rights for the Indigenous
          Cultural Communities/Indigenous People (ICCs/IPs) of the Philippines
        </h2>
      </section>
      <div className="bundles-content">
        <div className="content-left">
          <h3 id="ancestral-domains">
            RIGHTS TO ANCESTRAL DOMAINS/LANDS (Sections 4-12)
          </h3>
          <ul>
            <li>1. Right of ownership.</li>
            <li>2. Right to develop lands and natural resources.</li>
            <li>3. Right to stay in territories.</li>
            <li>4. Right in case of displacement.</li>
            <li>5. Right to regulate entry of migrants.</li>
            <li>6. Right to safe and clean air and water.</li>
            <li>7. Right to claim parts of reservation.</li>
            <li>8. Right to resolve conflict.</li>
            <li>9. Right to transfer land/property.</li>
            <li>10. Right to redemption of all transferred to a non-IP.</li>
          </ul>
        </div>
        <div className="content-right">
          <img
            src={bg33}
            style={{ width: "500px", height: "300px" }}
            alt="Ancestral Domains"
            className="img-fluid"
          />
        </div>
      </div>

      <div className="bundles-content">
        <div className="content-left">
          <h3 id="self-governance">
            RIGHT TO SELF-GOVERNANCE AND EMPOWERMENT (Sections 13-20)
          </h3>
          <ul>
            <li>11. Authentication of indigenous leadership titles.</li>
            <li>12. Recognition of socio-political institutions.</li>
            <li>13. Right to use their own justice systems.</li>
            <li>14. Right to participate in decision-making.</li>
            <li>
              15. Right to determine and decide priorities for development.
            </li>
            <li>16. Tribal barangays.</li>
            <li>17. Right to organize and associate for collective actions.</li>
          </ul>
        </div>
        <div className="content-right">
          <img
            src={bg33}
            style={{ width: "500px", height: "300px" }}
            alt="Self-Governance"
            className="img-fluid"
          />
        </div>
      </div>

      <div className="bundles-content">
        <div className="content-left">
          <h3 id="social-justice">
            SOCIAL JUSTICE AND HUMAN RIGHTS (Sections 21-28)
          </h3>
          <ul>
            <li>18. Equal protection and non-discrimination.</li>
            <li>19. Rights during armed conflict.</li>
            <li>20. Freedom from discrimination.</li>
            <li>21. Right to basic services.</li>
            <li>22. Rights of women.</li>
            <li>23. Rights of children and youth.</li>
            <li>24. Right to integrated system of education.</li>
          </ul>
        </div>
        <div className="content-right">
          <img
            src={bg33}
            style={{ width: "500px", height: "300px" }}
            alt="Social Justice"
            className="img-fluid"
          />
        </div>
      </div>

      <div className="bundles-content">
        <div className="content-left">
          <h3 id="cultural-integrity">
            RIGHTS TO CULTURAL INTEGRITY (Sections 29-36)
          </h3>
          <ul>
            <li>25. Protection of indigenous culture.</li>
            <li>26. Right to establish educational systems.</li>
            <li>27. Recognition of cultural diversity.</li>
            <li>28. Recognition of customary laws.</li>
            <li>29. Right to name, identity, and history.</li>
            <li>30. Protection of community intellectual rights.</li>
            <li>31. Rights to religious and cultural sites.</li>
            <li>32. Right to indigenous spiritual beliefs.</li>
            <li>33. Right to indigenous knowledge systems.</li>
            <li>34. Protection of biological and genetic resources.</li>
            <li>35. Right to sustainable agro-technological development.</li>
            <li>36. Right to receive funds for archaeological sites.</li>
          </ul>
        </div>
        <div className="content-right">
          <img
            src={bg33}
            style={{ width: "500px", height: "300px" }}
            alt="Cultural Integrity"
            className="img-fluid"
          />
        </div>
      </div>
      <DidYouKnowCard />
      <footer className="connect-footer text-center">
        <h4>Connect with Us</h4>
        <p className="text-white">123, Dasmariñas city, Cavite</p>
        <p className="text-white">0929222145</p>
        <p className="text-white">contact@TAPDEV.org</p>
      </footer>
    </div>
  );
};

export default BundlesOfRights;
