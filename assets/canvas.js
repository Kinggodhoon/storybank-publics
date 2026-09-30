/* 디자인 캔버스: 보드를 무한 캔버스에 놓고 확대·축소·이동한다. 데이터는 data.js. */
(function () {
  const root = document.body.dataset.root || './';
  const shot = (file) => `${root}shots/${file}`;
  const escape = (text) => String(text).replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
  const byId = Object.fromEntries(SB.screens.map((screen) => [screen.id, screen]));
  const reviewsByScreen = {};
  SB.reviews.forEach((review) => review.screens.forEach((id) => { (reviewsByScreen[id] ||= []).push(review); }));

  const swatch = (name, hex, role) => `<div class="cv-swatch"><i style="background:${hex}"></i><b>${name}</b><code>${hex}</code><span>${role}</span></div>`;

  const foundationBoards = [
    { id: 'F-COLOR', name: '컬러', kind: 'html', width: 1460, html: `
      <p class="cv-lead">종이 톤 배경, 짙은 네이비 텍스트, 잉크 블루 포인트 컬러. 기록과 권리를 다루는 서비스이므로 신뢰감을 우선했습니다.</p>
      <h4>기본</h4>
      <div class="cv-swatches">
        ${swatch('paper', '#F4F7FB', '페이지 바탕')}${swatch('surface', '#FBFDFF', '카드·테이블')}${swatch('paper-sunken', '#E9EEF3', '입력란·보조 배경')}
        ${swatch('ink', '#111825', '본문·제목')}${swatch('ink-secondary', '#4C535F', '보조 본문')}${swatch('rule', '#CCD1D9', '구분선')}
      </div>
      <h4>포인트 컬러와 상태</h4>
      <div class="cv-swatches">
        ${swatch('accent', '#293986', '주요 동작·선택')}${swatch('accent-soft', '#E6ECFA', '선택 배경')}${swatch('mark', '#D3DFFF', '검색 근거 문장')}
        ${swatch('danger', '#AC3031', '오류·위험')}${swatch('caution', '#875814', '주의·대기')}${swatch('focus', '#3856C8', '키보드 포커스')}
      </div>
      <h4>포인트 컬러 추가 단계(태그·차트용)</h4>
      <div class="cv-swatches">
        ${swatch('accent-wash · 50', '#F0F4FE', '행 호버·태그 바탕')}${swatch('accent-muted · 400', '#6B85D2', '차트 보조 계열')}${swatch('accent-vivid · 600', '#3248A4', '진행 막대·차트 주 계열')}
      </div>
      <h4>공개 화면 타일 컬러(적용 대기, DR2)</h4>
      <div class="cv-swatches">
        ${swatch('tile-rose', '#F5E1E0', '실화 카드, 검색·장바구니 띠')}${swatch('tile-lavender', '#E1DFFF', '꿈 이야기 카드, 마무리 카드')}${swatch('tile-teal', '#D6EDEB', '단편 소설 카드, AI 검색·서재 띠')}
        ${swatch('tile-mist', '#F0EDFF', '에피소드·원고 상세 띠')}${swatch('tile-stone', '#E6E5EF', '로그인·회원가입·원고 등록 띠')}
      </div>` },
    { id: 'F-TYPE', name: '타이포그래피', kind: 'html', width: 1460, html: `
      <p class="cv-lead">제목과 본문은 Pretendard, 코드와 번호는 IBM Plex Mono로 씁니다.</p>
      <div class="cv-type"><span>Display · 700 · 56</span><b style="font-size:56px;letter-spacing:-0.04em">이야기를 장면으로 만나요</b></div>
      <div class="cv-type"><span>Title · 700 · 31</span><b style="font-size:31px;letter-spacing:-0.03em">시장 골목 떡집의 마흔 해</b></div>
      <div class="cv-type"><span>Lead · 400 · 20</span><p style="font-size:20px">새벽 세 시에 불을 켜던 떡집이 골목과 함께 늙어 간 사십 년의 이야기예요.</p></div>
      <div class="cv-type"><span>Reading · 400 · 17 / 1.85</span><p style="font-size:17px;line-height:1.85;max-width:38em">떡집의 불은 늘 새벽 세 시에 켜졌다. 골목에서 가장 먼저 김이 오르는 가게였고, 이웃들은 그 김을 보고 하루가 시작된 줄 알았다.</p></div>
      <div class="cv-type"><span>Code · Plex Mono 500</span><b class="mono" style="font-size:22px;font-weight:500">EP-000101 · SB-260930-0001 · E3</b></div>` },
    { id: 'F-SHAPE', name: '모서리와 상태 배지', kind: 'html', width: 1460, html: `
      <p class="cv-lead">관리자 화면은 2px 모서리의 업무형, 공개 화면은 12·20·28px의 부드러운 모서리입니다. 상태 배지는 어디서나 2px로 도장처럼 보이게 합니다.</p>
      <div class="cv-row">
        <span class="stamp is-built">판매 중</span><span class="stamp is-partial">조건부 판매</span><span class="stamp is-wire">결제 확인 대기</span><span class="stamp is-merged">판매 안 함</span><span class="stamp is-doc">검수 중</span>
      </div>
      <div class="cv-row">
        <div class="cv-shape" style="border-radius:2px">관리자 2px</div><div class="cv-shape" style="border-radius:12px">공개 12px</div><div class="cv-shape" style="border-radius:20px">공개 20px</div><div class="cv-shape" style="border-radius:28px">공개 28px</div>
      </div>
      <div class="cv-row"><button class="cv-button primary" type="button" tabindex="-1">선택한 회차 담기</button><button class="cv-button" type="button" tabindex="-1">조건 지우기</button><button class="cv-button danger" type="button" tabindex="-1">주문 취소</button></div>` },
    { id: 'F-COMPONENTS', name: '공통 컴포넌트', kind: 'image', width: 1460, image: 'DS-components-strips.jpg', ratio: 1664 / 690,
      purpose: '버튼, 입력, 선택, 테이블, 더 보기, 모달, 알림, 빈 상태를 모은 제품의 컴포넌트 기준 페이지입니다.' },
    { id: 'F-LOCALE', name: '다국어', kind: 'pair', width: 1460, images: ['EN-home-desktop.jpg', 'EN-episode-desktop.jpg'],
      purpose: '공개 화면은 한국어와 영어를 같은 구조로 제공합니다. 원고와 요약은 번역하지 않고 한국어로 표시합니다.' },
    { id: 'F-STATES', name: '상태 화면', kind: 'pair', width: 1460, images: ['NF-not-found-desktop.jpg', 'P15-privacy-desktop.jpg'],
      purpose: '404 화면, 시행 전 문서 안내 배너처럼 주요 흐름 밖의 상태도 같은 레이아웃 안에서 보여 줍니다.' },
  ];

  const canvases = [
    { key: 'foundations', name: '기본 스타일', note: '컬러·타이포그래피·모서리·컴포넌트·다국어', boards: foundationBoards, columns: 2 },
    { key: 'public', name: '공개 화면', note: '구현 화면 14', boards: SB.screens.filter((screen) => screen.area === 'public' && screen.status !== 'wire' && screen.status !== 'doc'), columns: 2 },
    { key: 'admin', name: '관리자 화면', note: '구현 화면 11 · 포함·일부 4', boards: SB.screens.filter((screen) => screen.area === 'admin' && screen.status !== 'wire'), columns: 2 },
    { key: 'next', name: '다음 단계 시안', note: '와이어프레임 12(이전 표기 포함)', boards: SB.screens.filter((screen) => screen.status === 'wire'), columns: 3 },
  ];

  const state = { canvas: canvases[1], scale: 0.2, x: 0, y: 0 };
  const viewport = document.getElementById('cv-viewport');
  const world = document.getElementById('cv-world');
  const zoomLabel = document.getElementById('cv-zoom');
  const canvasList = document.getElementById('cv-canvases');
  const boardList = document.getElementById('cv-boards');
  const drawer = document.getElementById('cv-drawer');
  const reviewButton = document.getElementById('cv-review-toggle');
  const statusLine = document.getElementById('cv-status');

  function boardHtml(board) {
    if (board.kind === 'html') {
      return `<article class="cv-board" data-id="${board.id}" style="width:${board.width}px">
        <header><span class="mono">${board.id}</span><strong>${escape(board.name)}</strong></header>
        <div class="cv-html">${board.html}</div></article>`;
    }
    if (board.kind === 'image') {
      return `<article class="cv-board" data-id="${board.id}" style="width:${board.width}px">
        <header><span class="mono">${board.id}</span><strong>${escape(board.name)}</strong></header>
        <p class="cv-lead">${escape(board.purpose)}</p>
        <div class="cv-img" style="aspect-ratio:${board.ratio}"><img src="${shot(board.image)}" alt="${escape(board.name)}"></div></article>`;
    }
    if (board.kind === 'pair') {
      return `<article class="cv-board" data-id="${board.id}" style="width:${board.width}px">
        <header><span class="mono">${board.id}</span><strong>${escape(board.name)}</strong></header>
        <p class="cv-lead">${escape(board.purpose)}</p>
        <div class="cv-pair">${board.images.map((image) => `<div class="cv-img" style="aspect-ratio:16/10"><img src="${shot(image)}" alt="${escape(board.name)} 시안"></div>`).join('')}</div></article>`;
    }
    const screen = board;
    const reviews = reviewsByScreen[screen.id] || [];
    let shots;
    if (screen.strips) {
      shots = `<div class="cv-img" style="width:1400px;aspect-ratio:1664/690"><img src="${shot(screen.strips)}" alt="${escape(screen.name)} 전체 화면"></div>`;
    } else {
      const desktopStyle = screen.tall ? 'width:1000px;height:1100px' : 'width:1000px;aspect-ratio:16/10';
      shots = `<div class="cv-img" style="${desktopStyle}"><img src="${shot(screen.desktop)}" alt="${escape(screen.name)} 데스크톱"></div>`;
    }
    const mobile = screen.mobile ? `<div class="cv-img cv-phone"><img src="${shot(screen.mobile)}" alt="${escape(screen.name)} 모바일"></div>` : '';
    const extra = (screen.extra || []).map((item) => `<div class="cv-extra"><span class="mono">${escape(item.label)}</span><div class="cv-img" style="width:620px;aspect-ratio:16/10"><img src="${shot(item.desktop)}" alt="${escape(screen.name)} ${escape(item.label)}"></div></div>`).join('');
    return `<article class="cv-board" data-id="${screen.id}">
      <header><span class="mono">${screen.id}</span><strong>${escape(screen.name)}</strong><span class="stamp is-${screen.status}">${SB.statusLabels[screen.status]}</span><span class="cv-route mono">${escape(screen.route)}</span></header>
      <div class="cv-body">
        <div class="cv-shots">${shots}${mobile}</div>
        <aside class="cv-notes">
          <h5>목적</h5><p>${escape(screen.purpose)}</p>
          <h5>구성</h5><ul>${screen.points.map((point) => `<li>${escape(point)}</li>`).join('')}</ul>
          <h5>기능 · 단계</h5><div class="chips">${screen.features.map((feature) => `<span class="chip">${feature}</span>`).join('')}<span class="chip">${escape(screen.bundle)}</span></div>
          ${reviews.length ? `<h5>검토</h5>${reviews.map((review) => `<p class="cv-review"><b>${review.id}</b> ${escape(review.title)}</p>`).join('')}` : ''}
        </aside>
      </div>
      ${extra ? `<div class="cv-extras">${extra}</div>` : ''}
    </article>`;
  }

  function layout() {
    const boards = [...world.querySelectorAll('.cv-board')];
    const columns = state.canvas.columns;
    const gap = 140;
    const widths = boards.map((board) => board.offsetWidth);
    const columnWidth = Math.max(...widths);
    const heights = new Array(columns).fill(0);
    boards.forEach((board) => {
      const column = heights.indexOf(Math.min(...heights));
      board.style.left = `${column * (columnWidth + gap)}px`;
      board.style.top = `${heights[column]}px`;
      heights[column] += board.offsetHeight + gap;
    });
    world.style.width = `${columns * (columnWidth + gap) - gap}px`;
    world.style.height = `${Math.max(...heights) - gap}px`;
  }

  function apply() {
    world.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
  }

  function fit(element) {
    const rect = viewport.getBoundingClientRect();
    const target = element
      ? { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight }
      : { x: 0, y: 0, width: world.offsetWidth, height: world.offsetHeight };
    const padding = element ? 48 : 64;
    const scale = Math.min((rect.width - padding * 2) / target.width, (rect.height - padding * 2) / target.height, 1.2);
    state.scale = Math.max(0.03, scale);
    state.x = (rect.width - target.width * state.scale) / 2 - target.x * state.scale;
    state.y = element ? padding - target.y * state.scale : (rect.height - target.height * state.scale) / 2 - target.y * state.scale;
    apply();
  }

  function zoomAt(factor, clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    const px = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const py = (clientY ?? rect.top + rect.height / 2) - rect.top;
    const next = Math.min(3, Math.max(0.03, state.scale * factor));
    state.x = px - ((px - state.x) * next) / state.scale;
    state.y = py - ((py - state.y) * next) / state.scale;
    state.scale = next;
    apply();
  }

  function highlight(id) {
    world.querySelectorAll('.cv-board.is-focused').forEach((board) => board.classList.remove('is-focused'));
    const board = world.querySelector(`.cv-board[data-id="${id}"]`);
    if (board) {
      board.classList.add('is-focused');
      fit(board);
      boardList.querySelectorAll('a').forEach((link) => link.setAttribute('aria-current', link.dataset.id === id ? 'true' : 'false'));
    }
  }

  function showCanvas(key, focusId) {
    state.canvas = canvases.find((canvas) => canvas.key === key) || canvases[1];
    world.style.width = '';
    world.style.height = '';
    world.innerHTML = state.canvas.boards.map(boardHtml).join('');
    canvasList.querySelectorAll('a').forEach((link) => link.setAttribute('aria-current', link.dataset.key === state.canvas.key ? 'page' : 'false'));
    boardList.innerHTML = state.canvas.boards
      .map((board) => `<li><a href="#${state.canvas.key}" data-id="${board.id}"><span class="mono">${board.id}</span>${escape(board.name)}</a></li>`)
      .join('');
    document.getElementById('cv-boards-title').textContent = state.canvas.name;
    statusLine.textContent = `${state.canvas.name} · 보드 ${state.canvas.boards.length}개 · 드래그로 이동, Ctrl/⌘ + 휠 또는 핀치로 확대`;
    requestAnimationFrame(() => {
      layout();
      if (focusId) highlight(focusId); else fit();
    });
  }

  canvasList.innerHTML = canvases
    .map((canvas) => `<li><a href="#${canvas.key}" data-key="${canvas.key}"><b>${canvas.name}</b><span>${canvas.note}</span></a></li>`)
    .join('');
  canvasList.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-key]');
    if (!link) return;
    event.preventDefault();
    try { history.replaceState(null, '', `#${link.dataset.key}`); } catch (error) { /* 주소를 못 바꿔도 화면은 바뀐다 */ }
    showCanvas(link.dataset.key);
    document.body.classList.remove('cv-nav-open');
  });
  boardList.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-id]');
    if (!link) return;
    event.preventDefault();
    highlight(link.dataset.id);
    document.body.classList.remove('cv-nav-open');
  });

  document.getElementById('cv-zoom-in').addEventListener('click', () => zoomAt(1.25));
  document.getElementById('cv-zoom-out').addEventListener('click', () => zoomAt(0.8));
  document.getElementById('cv-actual').addEventListener('click', () => zoomAt(1 / state.scale));
  document.getElementById('cv-fit').addEventListener('click', () => fit());
  document.getElementById('cv-nav-toggle').addEventListener('click', () => document.body.classList.toggle('cv-nav-open'));

  reviewButton.textContent = `검토할 항목 · ${SB.reviews.length}`;
  reviewButton.addEventListener('click', () => {
    drawer.hidden = !drawer.hidden;
    reviewButton.setAttribute('aria-expanded', String(!drawer.hidden));
  });
  document.getElementById('cv-drawer-close').addEventListener('click', () => {
    drawer.hidden = true;
    reviewButton.setAttribute('aria-expanded', 'false');
    reviewButton.focus();
  });
  document.getElementById('cv-review-list').innerHTML = SB.reviews
    .map((review) => `<li><button type="button" data-screen="${review.screens[0]}">
      <span class="mono">${review.id}</span><span class="stamp ${review.kind === '결정 필요' ? 'is-wire' : review.kind === '디자인 검토' ? 'is-doc' : 'is-merged'}">${review.kind}</span>
      <b>${escape(review.title)}</b><span>${escape(review.detail)}</span>
      <span class="cv-review-screens">${review.screens.map((id) => `${id} ${escape(byId[id]?.name || '')}`).join(' · ')}</span></button></li>`)
    .join('');
  document.getElementById('cv-review-list').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-screen]');
    if (!button) return;
    const id = button.dataset.screen;
    const target = canvases.find((canvas) => canvas.boards.some((board) => board.id === id));
    if (target) showCanvas(target.key, id);
  });

  // 끌어서 이동, 휠·핀치 확대
  let drag = null;
  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, startX: state.x, startY: state.y, moved: false };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    state.x = drag.startX + dx;
    state.y = drag.startY + dy;
    apply();
  });
  const endDrag = () => { drag = null; viewport.classList.remove('is-dragging'); };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      zoomAt(Math.exp(-event.deltaY * 0.01), event.clientX, event.clientY);
    } else {
      state.x -= event.deltaX;
      state.y -= event.deltaY;
      apply();
    }
  }, { passive: false });
  viewport.addEventListener('dblclick', (event) => {
    const board = event.target.closest('.cv-board');
    if (board) highlight(board.dataset.id);
  });
  window.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === '+' || event.key === '=') zoomAt(1.25);
    else if (event.key === '-') zoomAt(0.8);
    else if (event.key === '0') fit();
    else if (event.key === 'Escape' && !drawer.hidden) { drawer.hidden = true; reviewButton.setAttribute('aria-expanded', 'false'); }
  });
  window.addEventListener('resize', () => fit());

  const initial = (location.hash || '').replace('#', '');
  showCanvas(canvases.some((canvas) => canvas.key === initial) ? initial : 'public');
})();
