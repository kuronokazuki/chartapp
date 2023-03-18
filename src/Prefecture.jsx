import React, { useEffect, useState } from "react";
import axios from "axios";

function Prefecture() {
	const [prefectureData, setprefectureData] = useState([]);
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const data = await axios.get(
			"https://opendata.resas-portal.go.jp/api/v1/prefectures",
			{
			  headers: {
				"X-API-KEY": process.env.REACT_APP_API_KEY,
			  }
			}
		  )
		  setprefectureData(data.data.result);
		}catch(error) {
		  console.error(error);
		}
	  };
	  fetchData();
	}, []);
  
	return (
		<div>
		  {prefectureData.map((data) => (
			<p key={data.prefCode}>{`${data.prefName}`}</p>
		  ))}
		</div>
	);
  }
  
  export default Prefecture;