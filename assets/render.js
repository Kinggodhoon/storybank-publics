/* 화면 시안·인벤토리·IA 표를 data.js에서 그린다. 페이지의 <body data-root="../"> 가 이미지 경로의 기준이다. */
(function () {
  const root = document.body.dataset.root || './';
  const shot = (file) => `${root}shots/${file}`;
  const escape = (text) => String(text).replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
  const stamp = (status) => `<span class="stamp is-${status}">${SB.statusLabels[status]}</span>`;
  const byId = Object.fromEntries(SB.screens.map((screen) => [screen.id, screen]));

  function media(screen) {
    if (!screen.strips && !screen.desktop && screen.link) {
      return `<a class="cta-row" href="${screen.link}" style="margin-top:0"><div><strong>기획안 · 서비스 구조와 메뉴</strong><span>공개·관리자 메뉴 트리와 화면 42개의 번호·주소·상태</span></div><span class="arrow" aria-hidden="true">→</span></a>`;
    }
    if (screen.strips) {
      return `<div class="frame"><img src="${shot(screen.strips)}" alt="${escape(screen.name)} 전체 화면을 세로로 나눠 이어 붙인 시안" loading="lazy"></div>`;
    }
    const desktopClass = screen.tall ? 'frame tall' : 'frame desktop';
    const desktop = screen.desktop
      ? `<div class="${desktopClass}"><img src="${shot(screen.desktop)}" alt="${escape(screen.name)} 데스크톱 시안" loading="lazy"></div>`
      : '';
    const mobile = screen.mobile
      ? `<div class="frame mobile"><img src="${shot(screen.mobile)}" alt="${escape(screen.name)} 모바일 시안" loading="lazy"></div>`
      : '';
    return desktop + mobile;
  }

  function extraMedia(screen) {
    return (screen.extra || [])
      .map((extra) => `
        <div class="screen-media" style="margin-top:28px">
          <p class="eyebrow" style="margin-bottom:10px">${escape(extra.label)}</p>
          <div class="frame desktop"><img src="${shot(extra.desktop)}" alt="${escape(screen.name)} ${escape(extra.label)} 시안" loading="lazy"></div>
          ${extra.mobile ? `<div class="frame mobile"><img src="${shot(extra.mobile)}" alt="${escape(screen.name)} ${escape(extra.label)} 모바일 시안" loading="lazy"></div>` : ''}
        </div>`)
      .join('');
  }

  function screenSection(screen) {
    const merged = screen.mergedInto && byId[screen.mergedInto]
      ? `<p class="route">${screen.mergedInto} ${escape(byId[screen.mergedInto].name)} 화면에 포함</p>` : '';
    const link = screen.link ? `<p><a href="${screen.link}">문서 열기 →</a></p>` : '';
    return `
      <article class="screen" id="${screen.id}">
        <div>
          <div class="screen-media">${media(screen)}</div>
          ${extraMedia(screen)}
        </div>
        <div class="screen-info">
          <div class="chips" style="align-items:center;gap:10px"><span class="id">${screen.id}</span>${stamp(screen.status)}<span class="chip">${escape(screen.bundle)}</span></div>
          <h3>${escape(screen.name)}</h3>
          <p class="route">${escape(screen.route)}</p>
          ${merged}
          <p>${escape(screen.purpose)}</p>
          <ul>${screen.points.map((point) => `<li>${escape(point)}</li>`).join('')}</ul>
          <div class="chips">${screen.features.map((feature) => `<span class="chip">${feature}</span>`).join('')}</div>
          ${link}
        </div>
      </article>`;
  }

  document.querySelectorAll('[data-screens]').forEach((container) => {
    const area = container.dataset.screens;
    const screens = SB.screens.filter((screen) => screen.area === area);
    container.innerHTML = screens.map(screenSection).join('');
  });

  document.querySelectorAll('[data-jump]').forEach((container) => {
    const area = container.dataset.jump;
    container.innerHTML = SB.screens
      .filter((screen) => screen.area === area)
      .map((screen) => `<a href="#${screen.id}" class="${screen.status === 'wire' ? 'is-wire' : ''}" title="${escape(screen.name)}">${screen.id} ${escape(screen.name)}</a>`)
      .join('');
  });

  document.querySelectorAll('[data-inventory]').forEach((container) => {
    const area = container.dataset.inventory;
    const rows = SB.screens.filter((screen) => !area || screen.area === area);
    container.innerHTML = `
      <table>
        <thead><tr><th>번호</th><th>화면</th><th>주소</th><th>상태</th><th>단계</th><th>기능</th></tr></thead>
        <tbody>${rows.map((screen) => `
          <tr>
            <td class="mono">${screen.id}</td>
            <td><a href="${root}design/${screen.area}.html#${screen.id}">${escape(screen.name)}</a></td>
            <td class="mono">${escape(screen.route)}</td>
            <td>${stamp(screen.status)}</td>
            <td>${escape(screen.bundle)}</td>
            <td><div class="chips">${screen.features.map((feature) => `<span class="chip">${feature}</span>`).join('')}</div></td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  });

  document.querySelectorAll('[data-count]').forEach((element) => {
    const [area, status] = element.dataset.count.split(':');
    element.textContent = SB.screens.filter((screen) => (area === '*' || screen.area === area) && (!status || status.split(',').includes(screen.status))).length;
  });

  document.querySelectorAll('[data-reviews]').forEach((container) => {
    container.innerHTML = SB.reviews
      .map((review) => `
        <div>
          <span class="mono">${review.id} · ${escape(review.kind)}</span>
          <strong>${escape(review.title)}</strong>
          <p>${escape(review.detail)}</p>
        </div>`)
      .join('');
  });
})();
