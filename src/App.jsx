import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Prefecture from './Prefecture'

function App() {
  return (
    <div className="App">
      <header style={{ textAlign: "center" }}>
        <h1>日本の人口推移</h1>
      </header>
      <Prefecture />
    </div>
  );
}

export default App;