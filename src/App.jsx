import './App.css';
import React from "react";
import Prefecture from './Prefecture'

function App() {
  return (
    <section className="App">
      <header style={{ textAlign: "center" }}>
        <h1>日本の人口推移</h1>
      </header>
      <Prefecture />
    </section>
  );
}

export default App;