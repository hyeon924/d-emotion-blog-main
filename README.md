# Emotion Blog Service

기술 학습과 개발 기록을 남기기 위한 개인 블로그 서비스입니다.
Spring Boot 기반 백엔드와 Next.js 기반 프론트엔드로 구성되며,
이메일 인증 기반 회원가입, JWT 인증, 게시글 CRUD,
Docker 기반 실행, 테스트 코드 포함을 목표로 개발되었습니다.

## 프로젝트 개요
이 프로젝트는 일상 속에서 느낀 감정과 생각들을 편하게 기록하기 위한 개인형 감정 기록 서비스입니다.
누군가에게 보여주기 위한 글이 아닌, 스스로를 위한 기록을 남길 수 있도록
과한 기능이나 복잡한 구조 없이 단순하고 조용한 공간을 목표로 합니다.

그날의 감정, 떠오른 생각, 사소한 경험까지 부담 없이 적어두고,
시간이 지난 후 다시 꺼내 보며 스스로를 돌아볼 수 있는 개인 기록 아카이브 같은 서비스를 지향합니다.

## 주요 기능

### 인증 기능
- 이메일 기반 6자리 인증 코드 발송  
- 인증 코드 만료 시간 검증  
- 이메일 인증 성공 시 회원가입 가능  
- JWT AccessToken / RefreshToken 발급  

### 블로그 기능
- 게시글 작성, 조회, 수정, 삭제(CRUD)  
- 키워드 기반 검색 기능  
- 카테고리/필터 기반 게시글 조회  

## 기술 스택

### Backend
- Java 17
- Spring Boot
- PostgreSQL  

### Frontend
- Next.js  
- TailwindCSS  

### Infra / Tools
- Docker  
- Postman  
- DBeaver

## 화면

[로그인]
<img width="2560" height="1440" alt="emotion-login" src="https://github.com/user-attachments/assets/d2480f67-f9d5-4275-8200-8a282716b6c6" />
[회원가입]
<img width="2560" height="1440" alt="emotion-signup" src="https://github.com/user-attachments/assets/c8cc4e9a-640a-41f0-ab85-5053652dd735" />
[게시글]
<img width="2560" height="1440" alt="emotion-post" src="https://github.com/user-attachments/assets/9f9f48cd-5cf0-45c7-bd46-2bc812c27752" />
[마이페이지]
<img width="2560" height="1440" alt="emotion-my" src="https://github.com/user-attachments/assets/b1b4f1f7-41a2-479a-b070-bc01e13268c4" />

## 배포 URL
- https://d-emotion-blog-main.vercel.app/users/login
