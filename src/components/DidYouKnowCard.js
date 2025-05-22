import React, { useState, useEffect } from "react";
import "../styles/didyouknow.css";
import { supabase } from "../supabase";

const DidYouKnowCard = () => {
  const [index, setIndex] = useState(0);
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const fetchFacts = async () => {
      const { data, error } = await supabase.from("did_you_know").select("*");
      if (!error) setFacts(data);
    };
    fetchFacts();
  }, []);

  useEffect(() => {
    if (facts.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <div className="did-you-know-box">
      <h6>Did You Know?</h6>
      <p>{facts[index]?.fact}</p>
    </div>
  );
};

export default DidYouKnowCard;
