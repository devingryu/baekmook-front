<p align="center">
  <img src="https://github.com/devingryu/baekmook-front/assets/79868575/c4df8609-23a7-4bdf-a4b2-b6168fc6e73b" />
</p>

[Live Server](https://bm.devingryu.com) | [백엔드 Git](https://github.com/devingryu/baekmook-back) | [프론트엔드 설정 문서](https://github.com/devingryu/baekmook-front/blob/master/SETUP.md)

## 프로젝트 소개

백묵은 간단한 온라인 교육 플랫폼입니다.

현재는 가장 기본적인 기능들만 제공하며, 구현된 기능은:
 - 회원가입, 로그인, 로그아웃
 - 강의 생성, 수강신청, 제적
 - 게시글 작성, 열람, 모아보기(타임라인)
 - 회원 정보 열람(마이페이지)

입니다.

## 테크 스택

- Frontend
  - [remix.run](https://remix.run/)
  - [react.js](https://react.dev/)
  - [MUI](https://mui.com/)
- Backend
  - [Spring Boot(Kotlin)](https://spring.io/)
  - [MySQL](https://www.mysql.com/)
- etc
  - [Docker](https://www.docker.com/)
  - [Nginx](https://www.nginx.com/)
  - ~~[Porkbun](https://porkbun.com/)~~

## 백엔드 구조
### DB 스키마
<p align="center">
  <img src="https://github.com/devingryu/baekmook-front/assets/79868575/d4d0addd-c33c-43ce-9f07-8c0e3dc982ac" width="70%" height="70%"/>
</p>

- user: 유저 정보 테이블
- authority: 권한(학생, 교수자) 정보 테이블
- lecture: 강의 정보 테이블
- post: 강의 게시물 정보 테이블
- user_authority(연관): 유저-권한 테이블 
- lecture_user(연관): 강의-수강자 테이블

### API Docs
[Swagger UI](https://bm.devingryu.com/docs/api)

*백묵 웹 서버는 SSR을 이용하기 때문에, 백엔드 서버는 외부 연결을 차단하고 있습니다.
