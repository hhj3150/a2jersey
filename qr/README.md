# QR Codes

배너·인쇄물용 QR 코드.

| 파일 | 인쇄된 URL | 용도 |
|---|---|---|
| `a2jersey-cafe-1024.png` | https://a2jersey-pre.netlify.app/?ref=cafe | 카페 배너 (1024×1024px, EC level H) — 기존 인쇄본 |

인쇄 URL은 Netlify 기본 도메인 `https://a2jersey-pre.netlify.app` 사용 (커스텀 도메인 미연결).

## 현재 동작 (2026-05-28~)

회원모집앱 운영 종료에 따라 **홈(`/`) 진입은 자동으로 `https://www.a2jerseymilk.com/` 으로 리다이렉트**됩니다.
QR(`?ref=cafe`)·공유링크(`?ref=share`) 포함 모든 쿼리 파라미터는 떨어뜨리고 깔끔하게 브랜드 홈페이지로 보냅니다.

- 구현 위치: `frontend/index.html` `<head>` 최상단 인라인 스크립트 (React 번들 로드 전 실행)
- 영향 없음: `/admin`, `/privacy`, `/terms` 직접 진입은 그대로 (홈 경로만 대상)
- 인쇄된 QR을 폐기할 필요 없음 — 스캔 시 브랜드 홈페이지로 자동 이동

## 재생성 (신규 인쇄용)

```bash
# 직접 www.a2jerseymilk.com 으로 가는 QR (권장)
npx -y qrcode "https://www.a2jerseymilk.com/" \
  --type png \
  --output qr/<filename>.png \
  --width 1024 \
  --margin 2 \
  --error-correction-level H
```

## 유입 추적 (참고)

기존 운영 중일 때 `?ref=` 파라미터로 가입자의 진입 경로를 추적했습니다.
현재는 홈 진입 시 즉시 브랜드 홈페이지로 리다이렉트되어 admin 대시보드에는 더 이상 기록되지 않습니다.

| ref | 채널 |
|---|---|
| `cafe` | 카페 배너 |
| `share` | 카카오톡·문자 공유 |
| `youtube` | 유튜브 설명란 |
| `insta` | 인스타그램 |
| `blog` | 블로그 |
| `direct` | 파라미터 없이 직접 진입 |
