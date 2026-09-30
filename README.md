# 스토리뱅크 기획·디자인 자료

스토리뱅크 서비스 기획안과 디자인 시안을 담은 정적 사이트입니다. GitHub Pages 로 배포합니다.

- 주소: https://kinggodhoon.github.io/storybank-publics/
- 첫 화면에서 기획안(`planning/`)과 디자인 시안(`design/`) 중 하나를 고릅니다.

## 구성

| 경로 | 내용 |
|---|---|
| `index.html` | 랜딩(기획안·디자인 시안 선택, 계약 납품물 대응표) |
| `planning/` | 서비스 기획서, 서비스 구조와 메뉴, 기능 정의, 일정표, 서비스 정책서, 화면 인벤토리, 기술 구조, 품질 기준 |
| `design/` | 디자인 방향 제안, 공개·관리자 화면 시안, 디자인 캔버스, 컬러·기본 구성·컴포넌트·패턴 |
| `assets/data.js` | 화면 42개와 검토 항목 데이터(화면 시안·캔버스·인벤토리가 함께 읽음) |
| `assets/site.css` | 공통 스타일(디자인 토큰) |
| `assets/canvas.js` | 디자인 캔버스(확대·축소, 보드, 검토 항목) |
| `shots/` | 화면 캡처(로컬 시연 환경의 알파 서비스, 합성 데이터)와 와이어프레임 |

## 로컬에서 보기

```bash
python3 -m http.server 4180
```

브라우저에서 `http://localhost:4180/` 을 엽니다.

## 배포 설정

저장소 Settings → Pages → Build and deployment 에서 Source 를 `Deploy from a branch`, Branch 를 `master` / `/(root)` 로 지정합니다.
