# QR Codes

배너·인쇄물용 QR 코드.

| 파일 | URL | 용도 |
|---|---|---|
| `a2jersey-cafe-1024.png` | https://a2jersey-pre.netlify.app/?ref=cafe | 카페 배너 (1024×1024px, EC level H) |

## 재생성

```bash
npx -y qrcode "<URL>" \
  --type png \
  --output qr/<filename>.png \
  --width 1024 \
  --margin 2 \
  --error-correction-level H
```

## 유입 추적

`?ref=` 파라미터로 가입자의 진입 경로가 admin 대시보드 `유입` 컬럼에 기록됩니다.

- `cafe` — 카페 배너
- `share` — 카카오톡·문자 공유
- `youtube` — 유튜브 설명란
- `insta` — 인스타그램
- `blog` — 블로그
- `direct` — 파라미터 없이 직접 진입
