export function renderPictures(hits) {
  const markup = hits
    .map(data => {
      return `
    <div class="photo-card">
      <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                Likes: <b>${data.likes.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Views: <b>${data.views.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Comments: <b>${data.comments.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Downloads: <b>${data.downloads.toLocaleString()}</b>
            </p>
        </div>
    </div>
          `;
    })
    .join('');
  return markup;
}
