const search = document.querySelector('#chapter-search');
const links = [...document.querySelectorAll('[data-chapter]')];
const status = document.querySelector('#search-status');
search?.addEventListener('input', () => {
  const term = search.value.toLowerCase().trim();
  for (const link of links) link.hidden = !link.textContent.toLowerCase().includes(term);
  status.textContent = term ? `${links.filter(link => !link.hidden).length} matching chapters` : '';
});
