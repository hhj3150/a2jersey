# a2jersey — 송영신목장 A2 Jersey Hay Milk 사전회원 모집

QR 기반 모바일 랜딩 + 정기구독 사전회원 등록 앱.

> "송영신목장은 국내에서 A2 Jersey Hay Milk를 생산하는 목장형 유가공 브랜드입니다."

- **Frontend**: Vite + React 18 + Tailwind 3 + react-hook-form + zod → Netlify
- **Backend**: Express 4 + better-sqlite3 + zod → Railway
- **Launch**: 2026-06-01 정기구독 오픈

---

## 폴더 구조

```
a2jersey/
├─ frontend/          # Netlify에 배포 (Vite 빌드)
│  ├─ index.html      # SEO/GEO 메타 + JSON-LD 정적 주입
│  └─ src/
│     ├─ App.tsx
│     ├─ components/  # Hero·BrandFilm·WhyDifferent·Form·FAQ·Footer 등
│     └─ lib/         # api·schemas
├─ backend/           # Railway에 배포 (Express + SQLite)
│  ├─ src/
│  │  ├─ index.ts     # Express 앱
│  │  ├─ db.ts        # better-sqlite3 + 마이그레이션
│  │  ├─ schemas.ts   # zod 검증
│  │  └─ routes/      # register, leads, export
│  └─ data/           # SQLite DB 파일 (gitignore)
├─ netlify.toml       # Netlify 빌드 설정
└─ README.md
```

---

## 로컬 실행

### Backend (포트 4000)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

→ 자동으로 `data/leads.db` 생성, 테이블 마이그레이션 실행.

### Frontend (포트 5173)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

→ http://localhost:5173 접속. 폼 제출은 자동으로 `http://localhost:4000/api/register` 호출.

---

## 환경 변수

### Frontend (`frontend/.env.local`)

| 변수 | 설명 | 예시 |
|---|---|---|
| `VITE_API_URL` | 백엔드 API 베이스 URL | `http://localhost:4000` (개발) / `https://a2jersey-api.up.railway.app` (프로덕션) |
| `VITE_BRAND_HOMEPAGE` | 공식 홈페이지 | `https://www.a2jerseymilk.com` |
| `VITE_BRAND_FILM_ID` | YouTube 영상 ID | `bI5EmgK0i2A` |

### Backend (`backend/.env`)

| 변수 | 설명 | 예시 |
|---|---|---|
| `PORT` | Express 서버 포트 | `4000` |
| `DATABASE_PATH` | SQLite 파일 경로 | `./data/leads.db` |
| `CORS_ORIGINS` | 허용 오리진 (콤마 구분) | `http://localhost:5173,https://a2jersey.netlify.app` |
| `ADMIN_USER` | 관리자 아이디 | `admin` |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | (강한 비밀번호 권장) |

---

## API

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| POST | `/api/register` | — | 사전회원 등록. 중복 전화번호 차단. Rate-limit 적용. |
| GET | `/api/health` | — | 헬스체크 |
| GET | `/api/admin/leads` | Bearer | 가입자 목록. `?page=&pageSize=&q=&ref=` 쿼리 지원. 응답에 `refStats` 포함. |
| GET | `/api/admin/export.csv` | Bearer | 전체 가입자 CSV (UTF-8 BOM, Excel 호환). |
| DELETE | `/api/admin/leads/:id` | Bearer | 가입자 단건 삭제 (테스트 데이터 정리용). |

**관리자 인증**: HTTP Basic Auth — `Authorization: Basic base64(ADMIN_USER:ADMIN_PASSWORD)`.
`ADMIN_USER` 또는 `ADMIN_PASSWORD`가 미설정·기본값이면 `503`. 비교는 timing-safe.

**관리자 UI**: `https://<도메인>/admin` 접속 → 아이디·비밀번호 입력. sessionStorage에 토큰 보관(탭 종료 시 자동 로그아웃).

`POST /api/register` body:

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "region": "경기도 안성시",
  "interests": ["750ml", "180ml"],
  "smsConsent": true,
  "privacyConsent": true
}
```

---

## 배포

### Backend (Railway)

1. Railway 대시보드 → New Project → Deploy from GitHub → `hhj3150/a2jersey` 선택
2. Service 설정:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
3. Variables 탭에서 환경변수 추가 (`PORT`, `DATABASE_PATH`, `CORS_ORIGINS`, `ADMIN_PASSWORD`)
4. Volumes 탭에서 `/app/data` 영구 볼륨 마운트 (SQLite 파일 보존)
5. Deploy → 발급된 URL 복사 (예: `https://a2jersey-api-production.up.railway.app`)

### Frontend (Netlify)

1. Netlify 대시보드 → Add new site → Import from Git → `hhj3150/a2jersey`
2. `netlify.toml`이 자동 인식 (base=`frontend`, publish=`dist`)
3. Site settings → Environment variables에서 `VITE_API_URL` 추가 (Railway URL)
4. Deploy → 발급된 URL 복사 (예: `https://a2jersey.netlify.app`)

### CORS 연동

배포 후 Backend의 `CORS_ORIGINS`에 Netlify 도메인을 추가하고 Railway에서 재배포.

---

## QR 코드

배너에 인쇄할 URL: `https://a2jersey.netlify.app/?ref=cafe`

`?ref=` 파라미터로 진입 경로 추적 가능 (cafe / share / youtube / insta / blog).
