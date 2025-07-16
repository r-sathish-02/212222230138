import React from "react";
import { UrlShortener } from "./components/ShortnerForm";
import  StatsView from "./components/StatsPage";
const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>URL Shortener App</h1>
      <UrlShortener />
      <StatsView />
    </div>
  );
};
export default App;
