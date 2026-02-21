import React from "react";
import HeroSection from "../components/HeroSection";
import EventFeatures from "../components/EventFeatures";
import OurReach from "../components/OurReach";
import ContactInfo from "../components/ContactInfo";
import FAQSection from "../components/FAQSection";
import EventTypesSection from "../components/EventTypesSection";

const Home = () => {
  return (
    <div>
      <HeroSection
        onRegisterClick={() => console.log("Register clicked!")}
        onLuckyDrawClick={() => console.log("Lucky Draw clicked!")}
      />
      <EventFeatures />
      <OurReach />
      <ContactInfo />
      <EventTypesSection />
      <FAQSection />
    </div>
  );
};

export default Home;
