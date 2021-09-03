import axios from "axios";
import React, { useState, useEffect } from "react";
import { Energy } from "./Energy.js";
import "./Node.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./Energy.css";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Node({ month, weightMonth, code, uppoCd, varK, essCost, pcsCost }) {
  let weightData = [
    {
      month: "1",
      one: "0.039831674",
      two: "0.035123537",
      three: "0.032456981",
      four: "0.031248698",
      five: "0.030998708",
      six: "0.031832007",
      seven: "0.034956877",
      eight: "0.039790009",
      nine: "0.042789884",
      ten: "0.042706554",
      eleven: "0.041873255",
      twelve: "0.041123287",
      thirteen: "0.040831632",
      fourteen: "0.039831674",
      fifteen: "0.038915045",
      sixteen: "0.03895671",
      seventeen: "0.040789967",
      eighteen: "0.046456398",
      nineteen: "0.052664472",
      twenty: "0.05408108",
      twentyone: "0.05399775",
      twentytwo: "0.053164451",
      twentythree: "0.050164576",
      twentyfour: "0.045414774",
    },
    {
      month: "2",
      one: "0.039379922",
      two: "0.034629329",
      three: "0.032004001",
      four: "0.030795516",
      five: "0.030503813",
      six: "0.03133725",
      seven: "0.034504313",
      eight: "0.03954661",
      nine: "0.041963579",
      ten: "0.042046923",
      eleven: "0.041713548",
      twelve: "0.041505188",
      thirteen: "0.04154686",
      fourteen: "0.040546735",
      fifteen: "0.03954661",
      sixteen: "0.039421594",
      seventeen: "0.040921782",
      eighteen: "0.045630704",
      nineteen: "0.053173313",
      twenty: "0.05554861",
      twentyone: "0.055006876",
      twentytwo: "0.053590032",
      twentythree: "0.050047923",
      twentyfour: "0.045088969",
    },
    {
      month: "3",
      one: "0.039371719",
      two: "0.034663778",
      three: "0.031997334",
      four: "0.030664111",
      five: "0.030289143",
      six: "0.03103908",
      seven: "0.033955504",
      eight: "0.038705108",
      nine: "0.040704941",
      ten: "0.041454879",
      eleven: "0.041663195",
      twelve: "0.041913174",
      thirteen: "0.042329806",
      fourteen: "0.041163236",
      fifteen: "0.039871677",
      sixteen: "0.039580035",
      seventeen: "0.040871594",
      eighteen: "0.045204566",
      nineteen: "0.052620615",
      twenty: "0.056745271",
      twentyone: "0.055912007",
      twentytwo: "0.054162153",
      twentythree: "0.05020415",
      twentyfour: "0.044912924",
    },
    {
      month: "4",
      one: "0.039746688",
      two: "0.034872094",
      three: "0.03220565",
      four: "0.030872427",
      five: "0.030539122",
      six: "0.031289059",
      seven: "0.034705441",
      eight: "0.039371719",
      nine: "0.041288226",
      ten: "0.041788184",
      eleven: "0.041621532",
      twelve: "0.041621532",
      thirteen: "0.041954837",
      fourteen: "0.040746604",
      fifteen: "0.039455045",
      sixteen: "0.03912174",
      seventeen: "0.040371636",
      eighteen: "0.044329639",
      nineteen: "0.050579118",
      twenty: "0.055828681",
      twentyone: "0.056286976",
      twentytwo: "0.054787101",
      twentythree: "0.05099575",
      twentyfour: "0.045621198",
    },
    {
      month: "5",
      one: "0.039666667",
      two: "0.034541667",
      three: "0.031708333",
      four: "0.030166667",
      five: "0.029708333",
      six: "0.030458333",
      seven: "0.034125",
      eight: "0.039",
      nine: "0.041291667",
      ten: "0.042208333",
      eleven: "0.04225",
      twelve: "0.042333333",
      thirteen: "0.042583333",
      fourteen: "0.0415",
      fifteen: "0.040416667",
      sixteen: "0.040208333",
      seventeen: "0.041375",
      eighteen: "0.044875",
      nineteen: "0.049875",
      twenty: "0.054083333",
      twentyone: "0.055791667",
      twentytwo: "0.054791667",
      twentythree: "0.051291667",
      twentyfour: "0.04575",
    },
    {
      month: "6",
      one: "0.038796516",
      two: "0.033670876",
      three: "0.030795516",
      four: "0.029211985",
      five: "0.028628579",
      six: "0.029462016",
      seven: "0.033462516",
      eight: "0.039088219",
      nine: "0.040838438",
      ten: "0.040963454",
      eleven: "0.041088469",
      twelve: "0.041505188",
      thirteen: "0.042380298",
      fourteen: "0.042088594",
      fifteen: "0.04154686",
      sixteen: "0.041838563",
      seventeen: "0.043255407",
      eighteen: "0.046630829",
      nineteen: "0.051256407",
      twenty: "0.054631829",
      twentyone: "0.056507063",
      twentytwo: "0.055465266",
      twentythree: "0.051506438",
      twentyfour: "0.045380673",
    },
    {
      month: "7",
      one: "0.03883657",
      two: "0.033627802",
      three: "0.030669222",
      four: "0.029044087",
      five: "0.028377365",
      six: "0.029002417",
      seven: "0.03296108",
      eight: "0.038753229",
      nine: "0.040753396",
      ten: "0.041045087",
      eleven: "0.041253438",
      twelve: "0.041670139",
      thirteen: "0.042503542",
      fourteen: "0.042170181",
      fifteen: "0.041545129",
      sixteen: "0.04179515",
      seventeen: "0.043253604",
      eighteen: "0.046837236",
      nineteen: "0.051545962",
      twenty: "0.054879573",
      twentyone: "0.056546379",
      twentytwo: "0.055504625",
      twentythree: "0.051670973",
      twentyfour: "0.045753813",
    },
    {
      month: "8",
      one: "0.038086507",
      two: "0.032711059",
      three: "0.029419118",
      four: "0.027460622",
      five: "0.026460538",
      six: "0.026418868",
      seven: "0.028877406",
      eight: "0.033461122",
      nine: "0.036669722",
      ten: "0.03900325",
      eleven: "0.040920077",
      twelve: "0.042836903",
      thirteen: "0.045087091",
      fourteen: "0.045587132",
      fifteen: "0.04500375",
      sixteen: "0.04500375",
      seventeen: "0.046128844",
      eighteen: "0.049087424",
      nineteen: "0.05383782",
      twenty: "0.057671473",
      twentyone: "0.058004834",
      twentytwo: "0.055837986",
      twentythree: "0.051462622",
      twentyfour: "0.04496208",
    },
    {
      month: "9",
      one: "0.038498396",
      two: "0.033581934",
      three: "0.030748719",
      four: "0.029248781",
      five: "0.028748802",
      six: "0.029498771",
      seven: "0.032915295",
      eight: "0.038456731",
      nine: "0.040706637",
      ten: "0.041373276",
      eleven: "0.041623266",
      twelve: "0.042123245",
      thirteen: "0.043039873",
      fourteen: "0.042414899",
      fifteen: "0.041456606",
      sixteen: "0.041373276",
      seventeen: "0.042664889",
      eighteen: "0.046664722",
      nineteen: "0.053206116",
      twenty: "0.056747636",
      twentyone: "0.056164326",
      twentytwo: "0.05424774",
      twentythree: "0.050122912",
      twentyfour: "0.044373151",
    },
    {
      month: "10",
      one: "0.039083333",
      two: "0.034333333",
      three: "0.031708333",
      four: "0.030375",
      five: "0.030083333",
      six: "0.031041667",
      seven: "0.034541667",
      eight: "0.040625",
      nine: "0.04225",
      ten: "0.041541667",
      eleven: "0.04075",
      twelve: "0.0405",
      thirteen: "0.040708333",
      fourteen: "0.039875",
      fifteen: "0.038916667",
      sixteen: "0.039",
      seventeen: "0.040791667",
      eighteen: "0.046625",
      nineteen: "0.054583333",
      twenty: "0.056375",
      twentyone: "0.056",
      twentytwo: "0.054458333",
      twentythree: "0.050666667",
      twentyfour: "0.045166667",
    },
    {
      month: "11",
      one: "0.038581726",
      two: "0.034040248",
      three: "0.031582017",
      four: "0.030415399",
      five: "0.030207075",
      six: "0.031248698",
      seven: "0.034831882",
      eight: "0.040956627",
      nine: "0.042539894",
      ten: "0.041331611",
      eleven: "0.040331653",
      twelve: "0.039956668",
      thirteen: "0.040206658",
      fourteen: "0.039415024",
      fifteen: "0.038581726",
      sixteen: "0.038915045",
      seventeen: "0.041414941",
      eighteen: "0.048831299",
      nineteen: "0.055122703",
      twenty: "0.056330986",
      twentyone: "0.055872672",
      twentytwo: "0.054289405",
      twentythree: "0.050331236",
      twentyfour: "0.044664806",
    },
    {
      month: "12",
      one: "0.038208333",
      two: "0.033791667",
      three: "0.031333333",
      four: "0.030166667",
      five: "0.029875",
      six: "0.03075",
      seven: "0.033833333",
      eight: "0.038708333",
      nine: "0.041416667",
      ten: "0.041833333",
      eleven: "0.041583333",
      twelve: "0.0415",
      thirteen: "0.041833333",
      fourteen: "0.04075",
      fifteen: "0.039666667",
      sixteen: "0.039708333",
      seventeen: "0.042041667",
      eighteen: "0.049541667",
      nineteen: "0.055291667",
      twenty: "0.056083333",
      twentyone: "0.055166667",
      twentytwo: "0.0535",
      twentythree: "0.049375",
      twentyfour: "0.044041667",
    },
  ];
  console.log("mont" + weightMonth);
  const [datas, setDatas] = useState(null);
  const [weightData1, setWeightData1] = useState(weightData[weightMonth].one);
  const [weightData2, setWeightData2] = useState(weightData[weightMonth].two);
  const [weightData3, setWeightData3] = useState(weightData[weightMonth].three);
  const [weightData4, setWeightData4] = useState(weightData[weightMonth].four);
  const [weightData5, setWeightData5] = useState(weightData[weightMonth].five);
  const [weightData6, setWeightData6] = useState(weightData[weightMonth].six);
  const [weightData7, setWeightData7] = useState(weightData[weightMonth].seven);
  const [weightData8, setWeightData8] = useState(weightData[weightMonth].eight);
  const [weightData9, setWeightData9] = useState(weightData[weightMonth].nine);
  const [weightData10, setWeightData10] = useState(weightData[weightMonth].ten);
  const [weightData11, setWeightData11] = useState(
    weightData[weightMonth].eleven
  );
  const [weightData12, setWeightData12] = useState(
    weightData[weightMonth].twelve
  );
  const [weightData13, setWeightData13] = useState(
    weightData[weightMonth].thirteen
  );
  const [weightData14, setWeightData14] = useState(
    weightData[weightMonth].fourteen
  );
  const [weightData15, setWeightData15] = useState(
    weightData[weightMonth].fifteen
  );
  const [weightData16, setWeightData16] = useState(
    weightData[weightMonth].sixteen
  );
  const [weightData17, setWeightData17] = useState(
    weightData[weightMonth].seventeen
  );
  const [weightData18, setWeightData18] = useState(
    weightData[weightMonth].eighteen
  );
  const [weightData19, setWeightData19] = useState(
    weightData[weightMonth].nineteen
  );
  const [weightData20, setWeightData20] = useState(
    weightData[weightMonth].twenty
  );
  const [weightData21, setWeightData21] = useState(
    weightData[weightMonth].twentyone
  );
  const [weightData22, setWeightData22] = useState(
    weightData[weightMonth].twentytwo
  );
  const [weightData23, setWeightData23] = useState(
    weightData[weightMonth].twentythree
  );
  const [weightData24, setWeightData24] = useState(
    weightData[weightMonth].twentyfour
  );

  const chartData = [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // console.log({weightMonth})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDatas(null);
        setError(null);
        setLoading(true);
        const response = await axios.get(
          `/openapi/v1/powerUsage/contractType.do?year=2020&month=${month}&metroCd=${uppoCd}&cityCd=${code}&apiKey=E1JR5LAwGIL5FQ9L2Nz21wO8Z51FQ1T057LyIv4Y&returnType=json`
        );
        setDatas(response.data.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [month, code, uppoCd]);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error </div>;
  if (!datas) return null;

  if (setWeightData1 !== null) {
    datas.map((data, index) =>
      chartData.push([
        {
          name: "1H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData1)) / 30,
        },
        {
          name: "2H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData2)) / 30,
        },
        {
          name: "3H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData3)) / 30,
        },
        {
          name: "4H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData4)) / 30,
        },
        {
          name: "5H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData5)) / 30,
        },
        {
          name: "6H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData6)) / 30,
        },
        {
          name: "7H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData7)) / 30,
        },
        {
          name: "8H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData8)) / 30,
        },
        {
          name: "9H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData9)) / 30,
        },
        {
          name: "10H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData10)) / 30,
        },
        {
          name: "11H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData11)) / 30,
        },
        {
          name: "12H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData12)) / 30,
        },
        {
          name: "13H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData13)) / 30,
        },
        {
          name: "14H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData14)) / 30,
        },
        {
          name: "15H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData15)) / 30,
        },
        {
          name: "16H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData16)) / 30,
        },
        {
          name: "17H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData17)) / 30,
        },
        {
          name: "18H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData18)) / 30,
        },
        {
          name: "19H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData19)) / 30,
        },
        {
          name: "20H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData20)) / 30,
        },
        {
          name: "21H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData21)) / 30,
        },
        {
          name: "22H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData22)) / 30,
        },
        {
          name: "23H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData23)) / 30,
        },
        {
          name: "24H",
          type: data.cntr,
          amount: (data.powerUsage * parseFloat(weightData24)) / 30,
        },
      ])
    );
  }

  let aggregateData = [
    { name: "1H", amount: 0 },
    { name: "2H", amount: 0 },
    { name: "3H", amount: 0 },
    { name: "4H", amount: 0 },
    { name: "5H", amount: 0 },
    { name: "6H", amount: 0 },
    { name: "7H", amount: 0 },
    { name: "8H", amount: 0 },
    { name: "9H", amount: 0 },
    { name: "10H", amount: 0 },
    { name: "11H", amount: 0 },
    { name: "12H", amount: 0 },
    { name: "13H", amount: 0 },
    { name: "14H", amount: 0 },
    { name: "15H", amount: 0 },
    { name: "16H", amount: 0 },
    { name: "17H", amount: 0 },
    { name: "18H", amount: 0 },
    { name: "19H", amount: 0 },
    { name: "20H", amount: 0 },
    { name: "21H", amount: 0 },
    { name: "22H", amount: 0 },
    { name: "23H", amount: 0 },
    { name: "24H", amount: 0 },
  ];
  for (var i = 0; i < 7; i++) {
    for (var k = 0; k < 24; k++) {
      aggregateData[k].amount += chartData[i][k].amount;
    }
  }

  let totalDemand = 0;
  for (var m = 0; m < 24; m++) {
    totalDemand += aggregateData[m].amount;
  }
  //태양광 발전량이 전체 발전량의 연평균 20% --> 역산해내기
  const solarSupply = [
    { key: 1, name: "1H", solarSupply: 0 },
    { key: 2, name: "2H", solarSupply: 0 },
    { key: 3, name: "3H", solarSupply: 0 },
    { key: 4, name: "4H", solarSupply: 0 },
    { key: 5, name: "5H", solarSupply: 0 },
    { key: 6, name: "6H", solarSupply: 0.0001 * totalDemand },
    { key: 7, name: "7H", solarSupply: 0.0044 * totalDemand },
    { key: 8, name: "8H", solarSupply: 0.0217 * totalDemand },
    { key: 9, name: "9H", solarSupply: 0.0528 * totalDemand },
    { key: 10, name: "10H", solarSupply: 0.0897 * totalDemand },
    { key: 11, name: "11H", solarSupply: 0.121 * totalDemand },
    { key: 12, name: "12H", solarSupply: 0.1376 * totalDemand },
    { key: 13, name: "13H", solarSupply: 0.1429 * totalDemand },
    { key: 14, name: "14H", solarSupply: 0.1363 * totalDemand },
    { key: 15, name: "15H", solarSupply: 0.1191 * totalDemand },
    { key: 16, name: "16H", solarSupply: 0.0907 * totalDemand },
    { key: 17, name: "17H", solarSupply: 0.055 * totalDemand },
    { key: 18, name: "18H", solarSupply: 0.0229 * totalDemand },
    { key: 19, name: "19H", solarSupply: 0.0055 * totalDemand },
    { key: 20, name: "20H", solarSupply: 0.0003 * totalDemand },
    { key: 21, name: "21H", solarSupply: 0 },
    { key: 22, name: "22H", solarSupply: 0 },
    { key: 23, name: "23H", solarSupply: 0 },
    { key: 24, name: "24H", solarSupply: 0 },
  ];

  const SMR = [
    { key: 1, name: "1H", amount: 0, variation: 0 },
    { key: 2, name: "2H", amount: 0, variation: 0 },
    { key: 3, name: "3H", amount: 0, variation: 0 },
    { key: 4, name: "4H", amount: 0, variation: 0 },
    { key: 5, name: "5H", amount: 0, variation: 0 },
    { key: 6, name: "6H", amount: 0, variation: 0 },
    { key: 7, name: "7H", amount: 0, variation: 0 },
    { key: 8, name: "8H", amount: 0, variation: 0 },
    { key: 9, name: "9H", amount: 0, variation: 0 },
    { key: 10, name: "10H", amount: 0, variation: 0 },
    { key: 11, name: "11H", amount: 0, variation: 0 },
    { key: 12, name: "12H", amount: 0, variation: 0 },
    { key: 13, name: "13H", amount: 0, variation: 0 },
    { key: 14, name: "14H", amount: 0, variation: 0 },
    { key: 15, name: "15H", amount: 0, variation: 0 },
    { key: 16, name: "16H", amount: 0, variation: 0 },
    { key: 17, name: "17H", amount: 0, variation: 0 },
    { key: 18, name: "18H", amount: 0, variation: 0 },
    { key: 19, name: "19H", amount: 0, variation: 0 },
    { key: 20, name: "20H", amount: 0, variation: 0 },
    { key: 21, name: "21H", amount: 0, variation: 0 },
    { key: 22, name: "22H", amount: 0, variation: 0 },
    { key: 23, name: "23H", amount: 0, variation: 0 },
    { key: 24, name: "24H", amount: 0, variation: 0 },
  ];

  function checkError(abcd) {
    let noErrorArray = [];
    for (let i = 0; i < abcd.length; i++) {
      let tempArray = abcd[i][0][0];
      let tempSolar = abcd[i][1];
      let tempSMR = abcd[i][2];
      let tempSolarRatio = abcd[i][3];
      let charge = 0;
      let check = 0;
      // console.log(tempArray);
      for (let k = 0; k < tempArray.length; k++) {
        // console.log(tempArray[k].netCharge);
        if (tempArray[k].netCharge < 0) {
          check = 1;
          break;
        }
      }
      // console.log(check);
      if (check === 0) {
        noErrorArray.push([tempArray, tempSolar, tempSMR, tempSolarRatio]);
      }
    }
    return noErrorArray;
  }
  let solarSupplyRatio = 0.2;
  let solarSupplyArray = [];
  for (let i = 0.15; i < 0.29; i += 0.01) {
    solarSupplyArray.push(i);
  }
  console.log(JSON.parse(JSON.stringify(solarSupply)));
  let abcd = [];
  solarSupplyArray.map((data) =>
    abcd.push(
      Energy(
        JSON.parse(JSON.stringify(SMR)),
        totalDemand,
        JSON.parse(JSON.stringify(chartData)),
        JSON.parse(JSON.stringify(solarSupply)),
        JSON.parse(JSON.stringify(aggregateData)),
        parseFloat(varK),
        month,
        parseInt(essCost),
        parseInt(pcsCost),
        data
      )
    )
  );
  console.log(abcd);

  for (let i = 0; i < abcd.length; i++) {
    console.log(abcd[i][0]);
    if (abcd[i][0] === 9999) {
      abcd.splice(i, 1);
    }
  }
  for (let i = 0; i < abcd.length; i++) {
    console.log(abcd[i][0]);
    if (abcd[i][0] === 9999) {
      abcd.splice(i, 1);
    }
  }
  console.log("test");
  console.log(abcd);
  abcd.sort((a, b) => a[0][0][23].cost - b[0][0][23].cost);
  let newArray = checkError(abcd);
  console.log(newArray);
  let ESSdata = newArray[0][0];
  let solarSupplyFinal = newArray[0][1];
  let SMRFinal = newArray[0][2];
  let solarRatio = newArray[0][3];
  let tableESS = [ESSdata];
  // console.log(ESSdata);
  // console.log(solarSupplyFinal);
  // console.log(SMRFinal);
  return (
    <div className="node">
      <h2>Year: 2020 Month: {month} (단위: kW)</h2>
      <div className="energy">
        <ResponsiveContainer width="100%" aspect={3}>
          <ComposedChart
            width={500}
            height={300}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" allowDuplicatedCategory={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            {tableESS.map((data, index) => (
              <Area
                type="monotone"
                name="Final SMR Supply"
                data={data}
                stackId="1"
                dataKey="smrSupply"
                stroke="lightgray"
                fill="lightgray"
              />
            ))}
            <Line
              type="monotone"
              dataKey="amount"
              name="Net Demand after Solar Supply"
              data={SMRFinal}
              stackId="1"
              stroke="gray"
              fill="gray"
            />
            <Line
              type="monotone"
              name="가로등"
              data={chartData[0]}
              dataKey="amount"
              stroke="blue"
            />
            <Line
              type="monotone"
              name="교육용"
              data={chartData[1]}
              dataKey="amount"
              stroke="red"
            />
            <Line
              type="monotone"
              name="농사용"
              data={chartData[2]}
              dataKey="amount"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              name="산업용"
              data={chartData[3]}
              dataKey="amount"
              stroke="green"
            />
            <Line
              type="monotone"
              name="심야"
              data={chartData[4]}
              dataKey="amount"
              stroke="orange"
            />
            <Line
              type="monotone"
              name="일반용"
              data={chartData[5]}
              dataKey="amount"
              stroke="purple"
            />
            <Line
              type="monotone"
              name="주택용"
              data={chartData[6]}
              dataKey="amount"
              stroke="pink"
            />
            <Line
              type="monotone"
              name="총합"
              data={aggregateData}
              dataKey="amount"
              stroke="black"
            />
            <Area
              type="monotone"
              name="태양광 발전 용량"
              data={solarSupplyFinal}
              stackId="1"
              dataKey="solarSupply"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <p>총 수요: {totalDemand}</p>
        <p>태양열 비율: {solarRatio.toFixed(2)} </p>
        <p>
          ESS Cost:{" "}
          {(ESSdata[23].battery * essCost)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          원{" "}
        </p>
        <p>
          PCS Cost:{" "}
          {(ESSdata[23].PCS * pcsCost)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          원{" "}
        </p>
        <p>
          Solar Cost:{" "}
          {(
            ESSdata[23].cost -
            ESSdata[23].PCS * pcsCost -
            ESSdata[23].battery * essCost
          )
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          원{" "}
        </p>
        <p>
          Total Cost:{" "}
          {ESSdata[23].cost
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          원
        </p>
        {ESSdata[0] === "No ESS Needed" ? (
          <p>No ESS Needed</p>
        ) : (
          tableESS.map((datas, index) => (
            <TableContainer component={Paper} className="table" key={index}>
              <h4>
                ESS Data (단위: kWh, SMR 개수: {tableESS[0][23].possibleSMR})
              </h4>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Hour</TableCell>
                    <TableCell align="right">Demand</TableCell>
                    <TableCell align="right">SMR Supply</TableCell>
                    <TableCell align="right">PCS Capacity</TableCell>
                    <TableCell align="right">ESS Battery Capacity</TableCell>
                    <TableCell align="right">Net Charge</TableCell>
                    <TableCell align="right">Discharge</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.map((data) => (
                    <TableRow key={data.hour}>
                      <TableCell component="th" scope="row">
                        {data.name}
                      </TableCell>
                      <TableCell align="right">{data.demand}</TableCell>
                      <TableCell align="right">{data.smrSupply}</TableCell>
                      <TableCell align="right">{data.PCS}</TableCell>
                      <TableCell align="right">{data.battery}</TableCell>
                      <TableCell align="right">{data.charge}</TableCell>
                      <TableCell align="right">{data.discharge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))
        )}
      </div>
    </div>
  );
}

export default Node;
