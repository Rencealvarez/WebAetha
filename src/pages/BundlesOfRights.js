import React from "react";
import { useNavigate } from "react-router-dom";
import "./BundlesOfRights.css"; // Create a separate CSS file for styling

const BundlesOfRights = () => {
  const navigate = useNavigate();

  return (
    <div className="bundles-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <section className="rights-header text-center">
        <h1>36</h1>
        <h2>
          Specific Rights under Four Bundles of Rights for the Indigenous
          Cultural Communities/Indigenous People (ICCs/IPs) of the Philippines
        </h2>
      </section>

      <section className="bundles-content">
        <h3>Rights to Ancestral Domains/Lands (Sections 4-12)</h3>
        <ul>
          <li>1. Right of ownership.</li>
          <li>2. Right to develop lands and natural resources.</li>
          <li>3. Right to stay in territories.</li>
          <li>4. Right in case of displacement.</li>
          <li>5. Right to regulate entry of migrants.</li>
          <li>6. Right to safe and clean air and water.</li>
          <li>
            7. Right to claim parts of reservation ( exept those and intended
            for common and public welfare and service).
          </li>
          <li>8. Right to resolve conflict</li>
          <li>
            9. Right to transfer land/ property to/ among members of the same
            ICC/IPs, subject to customary laws and traditions of the community
            concerned.
          </li>
          <li>
            10. Right to redemption of all transferred to a non-IP where the
            transfer is tainted by vitiated consent or the land is transferred
            for an unconscionable consideration or price.
          </li>
        </ul>

        <h3>Right to Self-Governance and Empowerment (Sections 13-20)</h3>
        <ul>
          <li>
            11. Authentication of indigenous leadership titles and certificates
            of tribal membership.
          </li>
          <li>
            12. Recognition of socio-political institutions and structures.
          </li>
          <li>
            13. Right to use their own commonly accepted justice systems,
            conflict resolution institutions, peace building processes or
            mechanisms, and other customary laws and practices within their
            respective communities and as may be compatible with the national
            legal system and with internationally recognized human rights.
          </li>
          <li>
            14. Right to participate in decision-making (mandatory
            representation in policy-making bodies and other local legislative
            councils).
          </li>
          <li>15. Right to determine and decide priorities for development.</li>
          <li>
            16. Tribal barangays (may form or constitute a separate barangay in
            accordance with the LGC/Sec.386 par. A).
          </li>
          <li>17. Right to organize and associate for collective actions.</li>
        </ul>

        <h3>SOCIAL JUSTICE AND HUMAN RIGHTS (Sections 21-28)</h3>
        <ul>
          <li>18. Equal protection and non-discrimination.</li>
          <li>19. Rights during armed conflict.</li>
          <li>
            20. Freedom from discrimination and right to equal opportunity and
            treatment.
          </li>
          <li>21. Right to basic services</li>
          <li>22. Rights of women</li>
          <li>23. Rights of children and youth</li>
          <li>
            24. Right to integrated system of education/right to education
          </li>
        </ul>

        <h3>RIGHTS TO CULTURAL INTEGRITY (Sections 21-28)</h3>
        <ul>
          <li>
            25. Protection of indigenous culture, traditions, and institutions.
          </li>
          <li>
            26. Right to establish control of their educational and learning
            systems.
          </li>
          <li>27. Recognition of cultural diversity.</li>
          <li>
            28. Recognition of customary laws and practices governing civil
            relations.
          </li>
          <li>29. Right to name, identity, and history.</li>
          <li>30. Protection of community intellectual rights.</li>
          <li>31. Rights to religious, cultural sites, and ceremonies.</li>
          <li>
            32. Right to indigenous spiritual beliefs and traditions, and
            protection of sacred places.
          </li>
          <li>
            33. Right to indigenous knowledge systems and practices and to
            develop own science and technologies.
          </li>
          <li>34. Protection of biological and genetic resources.</li>
          <li>35. Right to sustainable agro-technological development.</li>
          <li>
            36. Right to receive funds for archeological and historical sites
            and artifacts.
          </li>
        </ul>
      </section>

      <footer className="connect-footer text-center">
        <h4>Connect with Us</h4>
        <p>123 Cultural Way, Heritage City, Country</p>
        <p>1-800-INDIGENOUS</p>
        <p>contact@indigenousheritage.org</p>
      </footer>
    </div>
  );
};

export default BundlesOfRights;
