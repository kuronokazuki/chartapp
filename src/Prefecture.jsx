import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

	//グラフデータの状態を管理するステート
	const [series, setSeries] = useState([]);

	//チェックボックスの状態を管理するステート
	const [checkedValues, setCheckedValues] = useState([]);

	//チェックボックスが変更されたときの処理
	const handleChange = (event) => {
		const { value, checked, name } = event.target;
		if(checked){
			//チェックされた都道府県を設定する
			setCheckedValues([value, name]);
		}else{
			//チェックが外れた都道府県を集計から外す
			setSeries(series.filter(elm => {
				return elm.name != name;
			}))
		}
	};

	  //Highchartsの設定オプション
		let years = populationData.map((item) => item.year);
		const chartOptions = {
			title: {
				text: "都道府県別人口推移",
			},
			xAxis: {
				title: {
					text: "年度",
				},
				categories: years
			},
			yAxis: {
				title: {
					text: "人口数",
				},
			},
			series: series
		};

			useEffect(() => {
				const fetchData = async () => {
					if (checkedValues.length > 0) {
						try {
							console.log(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=` + checkedValues[0]);
							const result = await axios.get(
								`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=` + checkedValues[0],
								{
									headers: {
										"X-API-KEY": process.env.REACT_APP_API_KEY,
									},
								}
							);
							console.log(result);
							setPopulationData(result.data.result.data[0].data);
							const newPopulationData = result.data.result.data[0].data;
							let populationValue = newPopulationData.map((item) => item.value);
							setSeries([...series,{
								name: checkedValues[1],
								data: populationValue
							}]);
							console.log(series)
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
					name={data.prefName}
					onChange={handleChange}
				/>
				{`${data.prefName}`}
			</label>
		  ))}
			<div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
			<div>
        {populationData.map((data) => (
          <p key={data.year}>{`${data.year}年: ${data.value}人`}</p>
        ))}
      </div>
		</div>
	);
  }
  export default Prefecture;