import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from 'styled-components';

//styled-components用のスタイル
const CheckCardList = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 10px;
	justify-content: flex-start;
	justify-self: auto;
`
const CheckList = styled.label`
border-radius: 24px;
border: solid 2px;
border-color:black;
text-align: center;
padding: 4px;
margin: 0.5rem;
background-color: white;
width: 90px;
&:hover,
&:focus{
	background-color: gray;
	color: white;
}

`

const CheckBox = styled.input`
:checked & ${CheckList}{
	background-color: black;
}
`

//都道府県を表示
function Prefecture() {

	//人口データと都道府県データを管理するステート
	const [populationData, setPopulationData] = useState([]);
	const [prefectureData, setPrefectureData] = useState([]);
  //グラフデータの状態を管理するステート
	const [series, setSeries] = useState([]);
	//チェックボックスの状態を管理するステート
	const [checkedValues, setCheckedValues] = useState([]);

	//チェックボックスが変更されたときの処理
	const handleChange = (event) => {
		const { value, checked, name } = event.target;
		if(checked){
			//チェックされた都道府県を設定する
			setCheckedValues([value, name, checked]);
		}else{
			//チェックが外れた都道府県を集計から外す
			setSeries(series.filter(elm => {
				return elm.name !== name;
			}))
		}
	};

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
			categories: years,
		},
		yAxis: {
			title: {
				text: "人口数",
			},
		},
		series: series
	};

	//APIで都道府県の人口データ取得
	useEffect(() => {
		const fetchData = async () => {
			if (checkedValues.length > 0) {
				try {
					const result = await axios.get(
						`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=` + checkedValues[0],
						{
							headers: {
								"X-API-KEY": process.env.REACT_APP_API_KEY,
							},
						}
					);
					setPopulationData(result.data.result.data[0].data);
					const newPopulationData = result.data.result.data[0].data;
					let populationValue = newPopulationData.map((item) => item.value);
					setSeries((prevSeries) => [
						...prevSeries,
						{
						name: checkedValues[1],
						data: populationValue
						}
					]);
				}catch(error) {
					console.error(error);
				}
			}
		};
		fetchData();
	}, [checkedValues, setSeries]);

	return (
		<div>
			<CheckCardList>
				{prefectureData.map((data) => (
				<CheckList
					key={data.prefCode}
				>
					<CheckBox
						type="checkbox"
						value={data.prefCode}
						name={data.prefName}
						onChange={handleChange}
					/>
					{`${data.prefName}`}
				</CheckList>
				))}
			</CheckCardList>
			<div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
		</div>
	);
  }
  export default Prefecture;