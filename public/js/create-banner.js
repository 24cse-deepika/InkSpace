let selectedPhoto = null;

async function searchPhotos() {
  const query = document.getElementById('categoryInput').value;
  const res = await fetch(`/api/photos?query=${query}`);
  const photos = await res.json();

  const grid = document.getElementById('photo-grid');
  grid.innerHTML = photos.map(p => `
    <img 
      src="${p.src.medium}" 
      data-id="${p.id}"
      onclick="selectPhoto(this, '${p.src.original}')"
    />
  `).join('');
}

function selectPhoto(el, url) {
  selectedPhoto = url;
  document.querySelectorAll('#photo-grid img').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  localStorage.setItem('selectedBanner', url);
  document.getElementById('confirmBtn').style.display = 'block';
}

function confirmSelection() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('postId');
  window.location.href = postId ? `/edit/${postId}` : '/write-blog';
}