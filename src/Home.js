import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import Footer from "./Footer.js";

function Home(props) {
  const [input, setInput] = useState("");
  const [varK, setVarK] = useState("");
  const [essCost, setESS] = useState("370000");
  const [pcsCost, setPCS] = useState("180000");
  const [cityData, setCityData] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState(0);
  const [uppoCd, setUppoCd] = useState(0);

  useEffect(() => {
    const fetchData = async (res) => {
      try {
        const response = await axios.get(
          "/openapi/v1/commonCode.do?codeTy=cityCd&apiKey=E1JR5LAwGIL5FQ9L2Nz21wO8Z51FQ1T057LyIv4Y&returnType=json"
        );
        setCityData(response.data.data);
        console.log(response.data.data);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, [code, uppoCd]);
  // console.log(cityData)

  const sendCity = (e) => {
    e.preventDefault();
    // alert("done!")
    let check = 0;
    // console.log("VARK: " + varK)
    for (let i = 0; i < cityData.length; i++) {
      if (input === cityData[i].codeNm) {
        console.log(cityData[i].code);
        setCode(cityData[i].code);
        console.log(cityData[i].uppoCd);
        setUppoCd(cityData[i].uppoCd);
        check = 1;
        props.history.push(
          `/data?code=${cityData[i].code}&uppoCd=${cityData[i].uppoCd}&codeNm=${cityData[i].codeNm}&varK=${varK}&essCost=${essCost}&pcsCost=${pcsCost}`
        );
      }
    }
    if (check === 0) {
      alert("올바르지 않은 시군구 이름입니다");
    }
    setInput("");
  };

  // console.log(code)

  return (
    <div className="feed">
      <img
        src="https://i1.wp.com/keicltd.com/wp-content/uploads/2020/07/kei-consulting_logo-e1594949791130.png?fit=300%2C55&ssl=1"
        alt="KEI"
      />
      <div className="feed__inputContainer">
        <div className="feed__input">
          <SearchIcon />
          <form onSubmit={sendCity}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="군/구를 검색하세요 ex) 기장군"
            />
            <input
              type="text"
              value={varK}
              onChange={(e) => setVarK(e.target.value)}
              placeholder="SMR 변동 비율을 설정하세요"
            />
            <input
              type="text"
              value={essCost}
              onChange={(e) => setESS(e.target.value)}
              placeholder="ESS 가격을 설정하세요"
            />
            <input
              type="text"
              value={pcsCost}
              onChange={(e) => setPCS(e.target.value)}
              placeholder="PCS 가격을 설정하세요"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="feed__description">
          <h4>Usage</h4>
          <p>NuScale SMR 도입시 지역별 전력 데이터 통계 알아보기</p>
          <p>
            찾으려는 군/구가 안 나올시, 시 정보까지 입력바랍니다 ex) 장안구 --
            {">"} 수원시 장안구
          </p>
          <p>
            도시 리스트 업은 다음 링크에서 확인하세요. codeNm의 값을
            입력해야합니다.
          </p>
          <a
            href="https://bigdata.kepco.co.kr/openapi/v1/commonCode.do?codeTy=cityCd&apiKey=E1JR5LAwGIL5FQ9L2Nz21wO8Z51FQ1T057LyIv4Y&returnType=json"
            target="_blank"
          >
            도시 리스트업 확인하기
          </a>
          {/* <p>Default Value: 370000 | 180000</p> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default withRouter(Home);
