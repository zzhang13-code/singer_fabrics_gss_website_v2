const flipbookElement = document.querySelector('#flipbook');
const fallback = document.querySelector('.catalog-fallback');
let pageFlip;

function updateCounter() {
  const counter = document.querySelector('#pageCounter');
  if (counter && pageFlip) counter.textContent = `${pageFlip.getCurrentPageIndex() + 1} / 24`;
}

if (flipbookElement && window.St && window.St.PageFlip) {
  pageFlip = new St.PageFlip(flipbookElement, {
    width: 560,
    height: 720,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 650,
    minHeight: 390,
    maxHeight: 840,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true,
    maxShadowOpacity: 0.28,
    flippingTime: 850,
    autoSize: true
  });
  pageFlip.loadFromHTML(document.querySelectorAll('.page'));
  pageFlip.on('flip', updateCounter);
  updateCounter();
  document.querySelector('#prevPage')?.addEventListener('click', () => pageFlip.flipPrev());
  document.querySelector('#nextPage')?.addEventListener('click', () => pageFlip.flipNext());
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => pageFlip.flip(Number(button.dataset.page)));
  });
} else if (fallback) {
  flipbookElement.style.display = 'none';
  fallback.style.display = 'flex';
}
