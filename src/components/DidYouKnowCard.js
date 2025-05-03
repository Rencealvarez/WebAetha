import React, { useState, useEffect } from "react";
import { facts } from "../data/didYouKnowData";
import "../styles/didyouknow.css";

const DidYouKnowCard = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 5000); // rotate every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="did-you-know-box">
      <h6>Did You Know?</h6>
      <p>{facts[index]}</p>
    </div>
  );
};

export default DidYouKnowCard;
