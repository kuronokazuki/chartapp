import React, { useEffect, useState } from "react";
import axios from "axios";

//都道府県を表示
function Prefecture() {
	//人口データと都道府県データを管理するステート
	const [populationData, setPopulationData] = useState([]);
	const [prefectureData, setPrefectureData] = useState([]);
  
	//最初にページが読み込まれたときに都道府県データを取得する
	useEffect(() => {
	  const prefectureData = async () => {
		try {
		  const data = await axios.get(
			"https://opendata.resas-portal.go.jp/api/v1/prefectures",
			{
			  headers: {
				"X-API-KEY": process.env.REACT_APP_API_KEY,
			  }
			}
		  )
		  setPrefectureData(data.data.result);
		}catch(error) {
		  console.error(error);
		}
	  };
	  prefectureData();
	}, []);

	//チェックボックスの状態を管理するステート
	const [checkedValues, setCheckedValues] = useState([]);

	//チェックボックスが変更されたときの処理
	const handleChange = (event) => {
		const { value, checked } = event.target;
		if(checked){
			//チェックされた都道府県を設定する
			setCheckedValues([...checkedValues, value]);
		}else{
			//チェックが外れた都道府県を集計から外す
			const newCheckedValues = checkedValues.filter((code) => code !== value);
			setCheckedValues(newCheckedValues);
		}
	};
			useEffect(() => {
				const fetchData = async () => {
					if (checkedValues.length > 0) {
						try {
							console.log(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=` + checkedValues);
							const result = await axios.get(
								`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=` + checkedValues,
								{
									headers: {
										"X-API-KEY": process.env.REACT_APP_API_KEY,
									},
								}
							);
							console.log(result);
							setPopulationData(result.data.result.data[0].data);
						}catch(error) {
							console.error(error);
						}
					}
				};
				fetchData();
			}, [checkedValues]);


  
	return (
		<div>
		  {prefectureData.map((data) => (
			<label>
				<input
					type="checkbox"
					key={data.prefCode}
					value={data.prefCode}
					onChange={handleChange}
				/>
				{`${data.prefName}`}
			</label>
		  ))}
			<div>
        {populationData.map((data) => (
          <p key={data.year}>{`${data.year}年: ${data.value}人`}</p>
        ))}
      </div>
		</div>
	);
  }
  export default Prefecture;