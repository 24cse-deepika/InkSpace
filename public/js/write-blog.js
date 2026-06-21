const serverBanner = document.getElementById('bannerUrlInput').value;
const localBanner = localStorage.getItem('selectedBanner');
const banner = localBanner || serverBanner;

if (banner) {
  document.getElementById('post-banner-preview').src = banner;
  document.getElementById('post-banner-preview').style.display = 'block';
  document.getElementById('bannerUrlInput').value = banner;
}

document.querySelectorAll('button[type="submit"]').forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.removeItem('selectedBanner');
  });
});

document.getElementById('bannerBtn').addEventListener('click', () => {
  const postId = document.getElementById('bannerBtn').dataset.postId;
  window.location.href = postId ? `/create-banner?postId=${postId}` : '/create-banner';
});