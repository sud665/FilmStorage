import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import ReplyList from "../components/reply/ReplyList";
import FilmLogRevison from "../components/filmlog/FilmLogRevison";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import Guide from "../components/Guide";
import axios from "axios";

export default function FilmLogDetailPage({ userInfo, isLogin }) {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  // 사진 정보 상태 관리
  const [photoInfo, setPhotoInfo] = useState({});
  // 삭제 버튼 상태 관리
  const [comment, setComment] = useState("");
  const [filmLogComments, setFilmLogComments] = useState([]);

  // * 로그인 여부 확인 상태 관리
  const [modalClose, setModalClose] = useState(false);
  // * 임시 댓글 정보 저장
  const [replyCount, setReplyCount] = useState(0);
  // * 좋아요 상태 관리
  const [isLike, setIsLike] = useState(false);
  // * 등록일 변환
  const [createdDate, setCreatedDate] = useState("");

  const url = window.location.href;
  const filmlog_id = url.split("filmlogdetail/")[1];

  const getDetailInfo = useCallback(async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/filmlogs/view/${filmlog_id}`, {
        headers: {
          accept: "application/json",
        },
      })
      .then((res) => {
        const detailInfo = res.data.data;
        if (detailInfo) {
          setPhotoInfo(detailInfo);
        }
        setCreatedDate(res.data.data.createdAt.split(" ")[0]);
      })
      .catch((err) => {
        console.log("디테일 에러", err);
      });
  }, [filmlog_id]);

  const getFLCommentsInfo = useCallback(async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/filmlog_comments/total/${filmlog_id}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        setFilmLogComments(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [filmlog_id]);

  useEffect(() => {
    getDetailInfo();
  }, [getDetailInfo]);

  useEffect(() => {
    getFLCommentsInfo();
  }, [getFLCommentsInfo, replyCount]);

  const getLikeInfo = () => {
    if (userInfo.id) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/filmlogs/likes/${userInfo.id}/${filmlog_id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          const { like, likesCount } = res.data.data;
          setIsLike(like);
          setPhotoInfo({ ...photoInfo, likesCount: likesCount });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getLikeInfo();
  }, [isLike]);

  const handleWriteRegister = () => {
    setIsOpen(!isOpen);
  };

  // 삭제요청 핸들러 함수
  const handleDeleteData = () => {
    if (window.confirm("삭제를 진행 하시겠습니까?")) {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/filmlogs/deletion/${filmlog_id}`
        )
        .then((res) => {
          history.goBack();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const postComment = (e) => {
    e.preventDefault();
    if (comment === "") {
      alert("댓글을 입력해주세요");
    } else if (!isLogin) {
      setModalClose(true);
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/filmlog_comments/register/${userInfo.id}/${filmlog_id}`,
          {
            contents: comment,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        )
        .then(() => {
          setComment("");
          setReplyCount(replyCount + 1);
        })
        .catch((err) => console.log(err));
    }
  };

  // * 모달 창 닫기
  const handleModalClose = () => {
    setModalClose(false);
  };

  const handleFilmLike = () => {
    handlePostLike();
  };

  const handlePostLike = () => {
    if (userInfo.id) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/filmlogs/likes/${userInfo.id}/${filmlog_id}`,
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        )
        .then((res) => {
          setIsLike(res.data.data.like);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      <Article>
        <Nav>
          <Navflex>
            <FontAwesomeIcon
              icon={faAngleLeft}
              className="icon"
              onClick={() => history.goBack()}
            />
          </Navflex>
          <Navflex>
            {userInfo.id === photoInfo.user_id ? (
              <>
                <NavDiv>
                  <Button onClick={handleWriteRegister}>수정하기</Button>
                  {isOpen ? (
                    <FilmLogRevison
                      userInfo={userInfo}
                      setIsOpen={setIsOpen}
                      photoInfo={photoInfo}
                    />
                  ) : null}
                </NavDiv>
                <NavDiv>
                  <Button onClick={() => handleDeleteData()}>삭제하기</Button>
                </NavDiv>
              </>
            ) : (
              <NavDiv></NavDiv>
            )}
          </Navflex>
        </Nav>
        <div className="detailImageBox">
          <img
            className="detailImageBox_image"
            src={photoInfo.photo}
            alt="demo"
          />
          {/* 이미지 클릭시 좋아요 버튼 이벤트 기능 */}
          <div
            className="detailImageBox_textBox"
            onClick={() => handleFilmLike()}
          >
            <div className="detailImageBox_Like">
              {isLike ? (
                <FontAwesomeIcon icon={faPhotoFilm} color="tomato" />
              ) : (
                <FontAwesomeIcon icon={faPhotoFilm} />
              )}
            </div>
          </div>
        </div>
        <InfoBox>
          <Info fontsize="14px" fontweight tomato>
            {photoInfo.nickname}
          </Info>
          <Info fontsize="14px" fontweight flex="9">
            {photoInfo.filmtype}
          </Info>
          <Info rigth>
            <span>장소</span> {photoInfo.location}
          </Info>
          <Info rigth flex="3">
            <span>등록일</span>
            {createdDate}
          </Info>
          <Info rigth>
            <span>좋아요</span> {photoInfo.likesCount}
          </Info>
          <Info rigth>
            <span>조회수</span> {photoInfo.views}
          </Info>
        </InfoBox>
        <TextBox>{photoInfo.contents}</TextBox>
        <ReplyForm>
          <ReplyList
            filmLogComments={filmLogComments}
            getFLCommentsInfo={getFLCommentsInfo}
            convertDate={createdDate}
            userFLInfo={userInfo}
          />
          <ReplyInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></ReplyInput>
          {modalClose ? <Guide handleModalClose={handleModalClose} /> : null}
          <Button
            bottom
            onKeyUp={(e) => (e.key === "Enter" ? postComment : null)}
            onClick={postComment}
          >
            댓글 쓰기
          </Button>
        </ReplyForm>
      </Article>
    </Container>
  );
}

const Container = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  /* height: 90vh; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0 150px 0;
`;

const Article = styled.article`
  /* border: 1px solid green; */
  width: 60%;
  position: relative;
`;

const Nav = styled.nav`
  width: 100%;
  /* height: 8rem; */
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

const Navflex = styled.div`
  display: flex;
  justify-content: space-between;
  .icon {
    font-size: 28px;
    margin: 0px;
    cursor: pointer;
    /* padding: 5px; */
    /* border: 1px solid red; */
  }
`;

const NavDiv = styled.div`
  /* border: 1px solid red; */
  margin-left: 10px;
  /* margin: 2rem 0; */
`;

const Button = styled.button`
  border: 1px solid tomato;
  background: none;
  color: tomato;
  font-family: "SCoreDream";
  font-size: 16px;
  font-weight: 500;
  padding: 10px 30px;
  /* border: none; */
  border-radius: 20px;
  ${(props) => {
    if (props.bottom) {
      return css`
        position: absolute;
        right: 0;
        bottom: -50px;
      `;
    }
  }}
  cursor: pointer;
  &:hover {
    color: white;
    background: tomato;
    transition: 0.3s;
  }
`;

const ReplyInput = styled.input`
  border: 1px solid Gainsboro;
  border-radius: 10px;
  width: 97%;
  font-size: 14px;
  padding: 15px 10px;
  margin-top: 5px;
  outline: none;
  &:focus {
    border: none;
    border: 1px solid Gainsboro;
    box-shadow: 5px 5px 10px Gainsboro;
    transition: 0.3s;
  }
`;

const TextBox = styled.div`
  border-top: 2px solid #444;
  border-bottom: 2px solid #444;
  /* width: 100%; */
  padding: 20px 2px 100px;
  font-size: 14px;
  line-height: 2em;
`;
const ReplyForm = styled.form`
  /* border: 1px solid blue; */
  /* height: 30vh; */
`;

const InfoBox = styled.div`
  /* border: 1px solid red; */
  display: flex;
  align-items: center;
  margin: 15px 10px;
`;
const Info = styled.span`
  /* border: 1px solid red; */
  padding: 5px;
  color: ${(props) => (props.tomato ? "tomato" : "none")};
  flex: ${(props) => props.flex || "1 30px"};
  font-size: ${(props) => props.fontsize || "12px"};
  font-weight: ${(props) => (props.fontweight ? 500 : 400)};
  text-align: ${(props) => (props.rigth ? "center" : "none")};
  span {
    /* border: 1px solid red; */
    font-weight: 600;
    margin-right: 5px;
  }
`;
