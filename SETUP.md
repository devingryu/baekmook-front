# Baekmook (Server)
2023 Fall KWEB 준회원 대체 과제

## 목차
- [Baekmook (Server)](#baekmook-server)
  - [목차](#목차)
  - [Setup](#setup)
    - [Dev](#dev)
      - [.env 파일 설정](#env-파일-설정)
      - [실행](#실행)
    - [Production](#production)
      - [설정 가능한 환경 변수](#설정-가능한-환경-변수)
      - [docker-compse.yml](#docker-compseyml)
## Setup
### Dev
#### .env 파일 설정
```sh
# /.env
API_URL="http://localhost:30700"
SESSION_SECRET="mysessionsecret19234871"
```
#### 실행
```sh
yarn
yarn run dev
```
### Production
#### 설정 가능한 환경 변수

* **SESSION_SECRET**: 세션 쿠키 암호화 Secret, openssl rand -hex 32로 생성 (필수)
* PORT: 포트 번호(1559)
* API_URL: 백엔드 API URL(http://host.docker.internal:1557)

#### docker-compse.yml
```yaml
version: "3"

services:
  web:
    image: baekmook-web:0.0.3
    build:
      context: https://github.com/devingryu/baekmook-front.git#v0.0.3
      dockerfile: Dockerfile
    container_name: baekmook-web
    environment:
      SESSION_SECRET: [openssl rand -hex 32]
      API_URL: [1]
    restart: unless-stopped
    ports:
      - "1559:1559"
    networks:
      - baekmook_net

networks:
  baekmook_net:
    name: baekmook_net
    external: true
```
환경 변수는 꼭 변경하고 사용하세요!
