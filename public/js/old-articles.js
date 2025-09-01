document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const limit = 6;
    let isLoading = false;
    let hasMore = true;

    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const articlesContainer = document.getElementById('articles-container');

    if (!loadMoreBtn) return;

    // Load initial articles
    loadInitialArticles();

    loadMoreBtn.addEventListener('click', loadMoreArticles);

    async function loadInitialArticles() {
        try {
            // For static HTML, fetch directly from the external API
            const response = await fetch(`https://santri.pondokinformatika.id/api/get/news`);
            const apiData = await response.json();

            if (!apiData.data || apiData.data.length === 0) {
                throw new Error('No articles available');
            }

            let articles = apiData.data;

            // Sort articles by date (oldest first based on actual date)
            articles.sort((a, b) => {
                const dateA = new Date(a.created_at || a.date || '2000-01-01');
                const dateB = new Date(b.created_at || b.date || '2000-01-01');
                return dateA - dateB;
            });

            // Filter articles that are older than 2 days
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const oldArticles = articles.filter(article => {
                const articleDate = new Date(article.created_at || article.date || '2000-01-01');
                return articleDate < twoDaysAgo;
            });

            // Simulate pagination for static version
            const startIndex = 0;
            const endIndex = limit;
            const paginatedArticles = oldArticles.slice(startIndex, endIndex);

            const data = {
                articles: paginatedArticles,
                hasMore: endIndex < oldArticles.length,
                total: oldArticles.length
            };

            // Clear loading spinner
            articlesContainer.innerHTML = '';

            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(article => {
                    const articleElement = createArticleElement(article);
                    articlesContainer.appendChild(articleElement);
                });

                hasMore = data.hasMore;

                if (!hasMore) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.classList.remove('d-none');
                }
            } else {
                articlesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="text-center py-5">
                            <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                            <h5>Tidak ada artikel lama tersedia</h5>
                            <p class="text-muted">Silakan coba lagi nanti</p>
                        </div>
                    </div>
                `;
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading initial articles:', error);
            articlesContainer.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                        <h5>Terjadi Kesalahan</h5>
                        <p class="text-muted">Gagal memuat artikel lama. Silakan refresh halaman.</p>
                        <button class="btn btn-primary mt-2" onclick="location.reload()">
                            <i class="fas fa-refresh me-2"></i>Coba Lagi
                        </button>
                    </div>
                </div>
            `;
            loadMoreBtn.style.display = 'none';
        }
    }

    async function loadMoreArticles() {
        if (isLoading || !hasMore) return;

        isLoading = true;
        loadMoreBtn.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');

        try {
            // For static HTML, fetch directly from the external API and simulate pagination
            const response = await fetch(`https://santri.pondokinformatika.id/api/get/news`);
            const apiData = await response.json();

            if (!apiData.data || apiData.data.length === 0) {
                throw new Error('No articles available');
            }

            let articles = apiData.data;

            // Sort articles by date (oldest first based on actual date)
            articles.sort((a, b) => {
                const dateA = new Date(a.created_at || a.date || '2000-01-01');
                const dateB = new Date(b.created_at || b.date || '2000-01-01');
                return dateA - dateB;
            });

            // Filter articles that are older than 2 days
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            const oldArticles = articles.filter(article => {
                const articleDate = new Date(article.created_at || article.date || '2000-01-01');
                return articleDate < twoDaysAgo;
            });

            // Simulate pagination for static version
            const startIndex = (currentPage - 1) * limit;
            const endIndex = currentPage * limit;
            const paginatedArticles = oldArticles.slice(startIndex, endIndex);

            const data = {
                articles: paginatedArticles,
                hasMore: endIndex < oldArticles.length,
                total: oldArticles.length
            };

            currentPage++;

            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(article => {
                    const articleElement = createArticleElement(article);
                    articlesContainer.appendChild(articleElement);
                });

                hasMore = data.hasMore;

                if (!hasMore) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.classList.remove('d-none');
                }
            } else {
                hasMore = false;
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading more articles:', error);
            alert('Gagal memuat artikel. Silakan coba lagi.');
            loadMoreBtn.classList.remove('d-none');
        } finally {
            isLoading = false;
            loadingSpinner.classList.add('d-none');
        }
    }

    function createArticleElement(article) {
        const div = document.createElement('div');
        div.className = 'col-md-4 mb-4 article-item';
        
        div.innerHTML = `
            <div class="card h-100">
                <img src="${article.image_url || 'https://via.placeholder.com/400x250/0056b3/FFFFFF?text=Artikel+Lama'}" 
                     class="card-img-top" alt="${article.title}">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-primary mb-2" style="width: fit-content;">${article.kategori || 'Umum'}</span>
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text flex-grow-1">
                        ${article.description ? article.description.substring(0, 100) + '...' : 'Baca selengkapnya...'}
                    </p>
                    <div class="mt-auto">
                                        <small class="text-muted">
                                            <i class="far fa-clock"></i> ${article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : (article.date ? new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal tidak tersedia')}
                                        </small>
                        <br>
                        <a href="/article/${article.id}" class="btn btn-primary mt-2" style="background-color: #0056b3;">
                            Baca Selengkapnya
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }

    // Hide load more button if no articles initially
    if (document.querySelectorAll('.article-item').length === 0) {
        loadMoreBtn.style.display = 'none';
    }
});
