import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Prefecture from './Prefecture'

function App() {
  const [populationData, setPopulationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=40",
          {
            headers: {
              "X-API-KEY": process.env.REACT_APP_API_KEY,
            }
          }
        )
        setPopulationData(result.data.result.data[0].data);
      }catch(error) {
        console.error(error);
      }
    };
    fetchData();

  }, []);

  return (
    <div className="App">
      <header style={{ textAlign: "center" }}>
        <h1>日本の人口推移</h1>
      </header>
      <Prefecture />
      <div>
        {populationData.map((data) => (
          <p key={data.year}>{`${data.year}年: ${data.value}人`}</p>
        ))}
      </div>
    </div>
  );
}

export default App;