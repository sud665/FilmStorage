/* TODO : 필름 취향 찾기 페이지 만들기. */
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import FilmDataResult from "../components/findingfilmtype/FilmDataResult";
import FirstFilmTypeData from "../components/findingfilmtype/FirstFilmTypeTest";
import Loader from "../components/Loader";

export default function FindingFilmTypePage() {
  // 1.토글기능 만들어서 이미지 선택 여부 확인

  // 2.스플릿해서 선택된 값 분류 하기

  // 3. 분류가 된 배열을 통계 내기

  // 4. 통계결과에 따른 필름결과 보여주기

  // 5. 더미데이터 랜덤하게 9장씩 3번씩 보여주기

  // 더미데이터 복사해서 만들기
  const copyFilmTypeTestData = [...FirstFilmTypeData];

  const [count, setCount] = useState(0);

  // 결과창 로딩구현
  const [isLoaded, setIsLoaded] = useState(true);

  // 결과창 조건부 랜더링
  const [isLoadResult, setIsLoadResult] = useState(true);

  // 유저가 선택한 이미지 정보 수집
  const [filmResult, setFilmResult] = useState([]);

  // 결과 랜더링 용
  const [resultForRender, setResultForRender] = useState({});

  // 테스트그림들 나열하기
  const [filmTypeList, setFilmTypeList] = useState([]);

  // 이미지 선택 정해지기
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const [filmTypeTest, setFilmTypeTest] = useState(
    shuffleArray(copyFilmTypeTestData)
  );

  // 테스트 시작 버튼
  const [isStart, setIsStart] = useState(true);

  const handleStart = () => {
    setIsStart(false);
    setFilmTypeList(filmTypeTest.splice(0, 9));
  };

  const handleCounter = () => {
    if (count === 2) {
      setCount(count + 1);
      setIsLoaded(false);
    } else {
      setCount(count + 1);
    }
  };

  const testRef = useRef({});

  testRef.current = { type: [], company: [], iso: [] };

  // 사진 배열 바꾸기 슬라이스 함수
  const handleNextPageTest = (e) => {
    // 통계 데이터 수집
    const { type, iso, company } = testRef.current;
    const choiceValue = e.target.alt.split("&");

    iso.push(choiceValue[0]);
    type.push(choiceValue[1]);
    company.push(choiceValue[2]);

    if (type.length === 3) {
      setFilmResult(filmResult.concat(testRef.current));
      setFilmTypeList(filmTypeTest.splice(0, 9));
      handleCounter();
    }
  };

  // 타입별 결과 함수
  // const getTypeResult = (result) => {
  //   // console.log("이거 중요하다", result);
  //   let types = result[0].type.concat(result[1].type, result[2].type);
  //   let countBW = 0,
  //     countColor = 0,
  //     countEtc = 0;
  //   for (let i = 0; i < types.length; i++) {
  //     if (types[i] === "흑백") {
  //       countBW++;
  //     } else if (types[i] === "컬러") {
  //       countColor++;
  //     } else {
  //       countEtc++;
  //     }
  //   }
  //   let max = Math.max(countBW, countColor, countEtc);
  //   if (max === countBW) return "흑백";
  //   if (max === countColor) return "컬러";
  //   if (max === countEtc) return "기타";
  // };

  // 타입에 따른 통계 함수
  const getCompanyResult = (result) => {
    const companies = result[0].company.concat(
      result[1].company,
      result[2].company
    );
    const obj = {};
    for (let i = 0; i < companies.length; i++) {
      if (!obj[companies[i]]) {
        obj[companies[i]] = 1;
      } else {
        obj[companies[i]]++;
      }
    }
    const values = Object.values(obj);
    const max = Math.max(...values);
    for (let key in obj) {
      let value = obj[key];
      if (value === max) return key;
    }
  };

  //  결과 로딩 함수
  const handleFilmResult = () => {
    // const typeResult = getTypeResult(filmResult);
    const companyResult = getCompanyResult(filmResult);

    setResultForRender(FilmDataResult[companyResult]);

    let secondTimer = setTimeout(() => setIsLoadResult(false), 2000);
    return () => {
      clearTimeout(secondTimer);
    };
  };

  useEffect(() => {
    if (filmResult.length === 3) {
      handleFilmResult();
    }
  }, [filmResult]);

  // 상태 원상태로 돌리는 함수
  useEffect(() => {
    return () => {
      setIsLoaded(true);
      setIsStart(true);
      setIsLoadResult(true);
      setCount(0);
      setResultForRender({});
      setFilmTypeList([]);
      setFilmTypeTest(copyFilmTypeTestData);
    };
  }, []);

  return (
    <>
      <Container>
        <ProceedContainer>
          <Progress width={(count / 3) * 100 + "%"} />
          <Dot />
        </ProceedContainer>
        {isStart ? (
          <>
            <ImgContainer>마음에 드는 사진 3장씩 선택해주세요.</ImgContainer>
            <StartButtonBox>
              <Button
                onClick={() => {
                  handleStart();
                }}
              >
                시작
              </Button>
            </StartButtonBox>
          </>
        ) : (
          <>
            {isLoaded ? (
              <GridContainer>
                {filmTypeList.map((test, idx) => {
                  return (
                    <BlockBox key={idx}>
                      <ImgBox
                        active={"1"}
                        src={test.src}
                        alt={`${test.iso}&${test.type}&${test.company}`}
                        onClick={(e) => {
                          handleNextPageTest(e);
                        }}
                      />
                    </BlockBox>
                  );
                })}
              </GridContainer>
            ) : (
              <>
                <ImgContainer>
                  {isLoadResult ? (
                    <Loader />
                  ) : (
                    <FilmBox>
                      <img
                        className="filmimg"
                        src={resultForRender.imglink}
                        alt="film"
                      />
                      <h3 className="filmtitle">{resultForRender.filmname}</h3>
                      <div className="filminfo-box">
                        <span className="filminfo">
                          <span className="bold">필름 타입</span>{" "}
                          {resultForRender.type} |
                        </span>
                        <span className="filminfo">
                          <span className="bold">촬영 횟수</span>{" "}
                          {resultForRender.shots} |
                        </span>
                        <span className="filminfo">
                          <span className="bold">감도</span>ISO
                          {resultForRender.iso}
                        </span>
                      </div>
                      <span className="filminfo-text">
                        {resultForRender.content}
                      </span>
                    </FilmBox>
                  )}
                </ImgContainer>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProceedContainer = styled.div`
  margin: 50px auto;
  background-color: #eee;
  width: 500px;
  height: 20px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  box-shadow: 5px 5px 10px Gainsboro;
`;
// 진행바
const Progress = styled.div`
  background-color: tomato;
  width: ${(props) => props.width};
  height: 100%;
  /* transition: width 0.5s; */
  border-radius: 20px;
  box-shadow: 5px 5px 10px Gainsboro;
`;

// 진행바 원형
const Dot = styled.div`
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  border: 5px solid tomato;
  border-radius: 35px;
  background: white;
  margin-left: -20px;
`;

const ImgContainer = styled.div`
  display: flex;
`;

const StartButtonBox = styled.div`
  width: 30rem;
  height: 10rem;
  margin-top: 80px;
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 900px;
  grid-gap: 20px;
  grid-template-columns: 1.2fr 1.2fr 1.2fr;
`;

const FilmBox = styled.div`
  width: 20vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  > h3.filmtitle {
    margin: 10px 0 0 0;
    /* border: 1px solid red; */
  }
  > img.filmimg {
    height: 15vh;
    /* width: 10vw; */
    object-fit: cover;
  }

  > div.filminfo-box {
    /* border: 1px solid red; */
    > span.filminfo {
      /* border: 1px solid red; */
      padding: 2px;
      font-size: 11px;
      .bold {
        font-weight: 600;
      }
    }
  }
  > .filminfo-text {
    border: 1px solid Gainsboro;
    border-radius: 20px;
    margin: 10px;
    padding: 40px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  padding: 10px 30px;
  border: 1px solid tomato;
  background: none;
  color: tomato;
  border-radius: 20px;
  font-family: "SCoreDream";
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    color: white;
    background: tomato;
    transition: 0.3s;
  }
`;

const BlockBox = styled.div`
  /* display: block; */
`;

const ImgBox = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }
`;
