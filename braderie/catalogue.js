'use strict';

const catalogue = document.querySelector('#catalogue');
const count = document.querySelector('#count');
const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function createCard(item) {
  const card = element('article', 'card');
  card.id = item.id;
  const gallery = element('div', 'gallery');
  if (item.photos.length) {
    const track = element('div', 'photos');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', `${item.name} photos`);
    item.photos.forEach((photo, index) => {
      const figure = element('figure', 'slide');
      const img = element('img');
      img.src = photo.src;
      img.alt = photo.alt || `${item.name}, photo ${index + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      if (photo.width && photo.height) { img.width = photo.width; img.height = photo.height; }
      figure.append(img);
      track.append(figure);
    });
    gallery.append(track);
    if (item.photos.length > 1) {
      const controls = element('div', 'gallery-controls');
      const dots = element('div', 'dots');
      let current = 0;
      const go = (index) => { current = (index + item.photos.length) % item.photos.length; track.scrollTo({ left: current * track.clientWidth, behavior: 'instant' }); update(); };
      const update = () => Array.from(dots.children).forEach((dot, index) => dot.setAttribute('aria-current', String(index === current)));
      const arrow = (text, label, step) => {
        const button = element('button', 'arrow', text);
        button.type = 'button'; button.setAttribute('aria-label', `${label} photo of ${item.name}`);
        button.addEventListener('click', () => go(current + step));
        return button;
      };
      item.photos.forEach((_, index) => {
        const dot = element('button', 'dot');
        dot.type = 'button'; dot.setAttribute('aria-label', `Photo ${index + 1} of ${item.photos.length}`);
        dot.addEventListener('click', () => go(index)); dots.append(dot);
      });
      track.addEventListener('scroll', () => { current = Math.round(track.scrollLeft / track.clientWidth); update(); }, { passive: true });
      track.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1)); }
      });
      controls.append(arrow('←', 'Previous', -1), dots, arrow('→', 'Next', 1));
      gallery.append(controls); update();
    }
  } else {
    const placeholder = element('div', 'photo-placeholder');
    placeholder.append(element('span', '', '↗'), element('strong', '', 'Photos coming soon'), element('small', '', 'Real item photos will appear here.'));
    gallery.append(placeholder);
  }
  const body = element('div', 'card-body');
  const meta = element('div', 'item-meta');
  const status = ['available', 'reserved', 'sold'].includes(item.status) ? item.status : 'available';
  meta.append(element('span', '', item.category), element('span', `status ${status}`, status[0].toUpperCase() + status.slice(1)));
  const title = element('div', 'title-row');
  title.append(element('h3', '', item.name), element('span', 'price', item.price === 0 ? 'Free' : euro.format(item.price)));
  body.append(meta, title, element('p', 'description', item.description));
  if (item.availability) body.append(element('p', 'availability', item.availability));
  card.append(gallery, body);
  return card;
}

async function loadCatalogue() {
  try {
    const response = await fetch('items.json');
    if (!response.ok) throw new Error('Could not load items');
    const items = await response.json();
    const render = (category) => {
      const visible = category === 'All' ? items : items.filter(item => category === 'Free' ? item.price === 0 : item.category === category);
      catalogue.replaceChildren(...visible.map(createCard));
      if (!visible.length) catalogue.append(element('p', '', 'More treasures coming soon.'));
      count.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`;
    };
    const categories = [...new Set(items.map(item => item.category))];
    if (categories.length > 1) {
      const filters = document.querySelector('#filters');
      filters.hidden = false;
      ['All', 'Free', ...categories].forEach(category => {
        const button = element('button', 'filter', category);
        button.type = 'button'; button.setAttribute('aria-pressed', String(category === 'All'));
        button.addEventListener('click', () => {
          Array.from(filters.children).forEach(other => other.setAttribute('aria-pressed', String(other === button)));
          render(category);
        });
        filters.append(button);
      });
    }
    render('All');
  } catch (error) {
    catalogue.replaceChildren(element('p', '', 'The catalogue could not load. Please refresh, or WhatsApp Luke or Jenn for details.'));
    console.error(error);
  }
}
loadCatalogue();
