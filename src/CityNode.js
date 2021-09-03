import React from "react";
import Node from "./Node.js";
import qs from "qs";
import Header from "./Header";
import "./CityNode.css";

function CityNode({ location }) {
  var monthArray = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  // console.log(query)
  return (
    <div className="cityNode">
      <Header />
      <div className="data">
        <h1>
          {query.codeNm} 월별 통계 (변동 비율: {query.varK * 100}%)
        </h1>
        <h3>
          ESS Cost: {query.essCost} PCS Cost: {query.pcsCost}{" "}
        </h3>
        {monthArray.map((month, index) => (
          <Node
            key={index}
            month={month}
            weightMonth={index}
            code={query.code}
            uppoCd={query.uppoCd}
            varK={query.varK}
            essCost={query.essCost}
            pcsCost={query.pcsCost}
          />
        ))}
      </div>
    </div>
  );
}

export default CityNode;
