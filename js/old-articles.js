// JavaScript for Old Articles Page - Static Version
const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

let currentPage = 1;
const limit = 6;
let isLoading = false;
let hasMore = true;
let oldArticles = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Old Articles page loaded');
    loadOldArticles();
    setupLoadMoreButton();
});

// Load old articles
async function loadOldArticles() {
    try {
        showLoading();
        
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        let articles = data.data || [];
        
        // Sort articles by date (oldest first)
        articles.sort((a, b) => {
            const dateA = new Date(a.created_at || a.date || '2000-01-01');
            const dateB = new Date(b.created_at || b.date || '2000-01-01');
            return dateA - dateB;
        });

        // Filter articles that are older than 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        oldArticles = articles.filter(article => {
            const articleDate = new Date(article.created_at || article.date || '2000-01-01');
            return articleDate < twoDaysAgo;
        });

        // Render initial articles
        renderArticles();
        
    } catch (error) {
        console.error('Error loading old articles:', error);
        showError('Gagal memuat artikel lama. Silakan refresh halaman.');
    } finally {
        hideLoading();
    }
}

// Render articles with pagination
function renderArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (oldArticles.length === 0) {
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
        return;
    }
    
    const startIndex = (currentPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, oldArticles.length);
    const paginatedArticles = oldArticles.slice(startIndex, endIndex);
    
    let articlesHTML = '';
    
    paginatedArticles.forEach(article => {
        const articleDate = article.created_at || article.date;
        const formattedDate = articleDate ? 
            new Date(articleDate).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }) : 
            'Tanggal tidak tersedia';
        
        articlesHTML += `
            <div class="col-md-4 mb-4 article-item fade-in">
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
                                <i class="far fa-clock"></i> ${formattedDate}
                            </small>
                            <br>
                            <a href="article.html?id=${article.id}" class="btn btn-primary mt-2" style="background-color: #0056b3;">
                                Baca Selengkapnya
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    articlesContainer.innerHTML = articlesHTML;
    
    // Update load more button
    if (endIndex >= oldArticles.length) {
        hasMore = false;
        loadMoreBtn.style.display = 'none';
    } else {
        hasMore = true;
        loadMoreBtn.style.display = 'block';
    }
}

// Setup load more button
function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const loadMoreText = document.getElementById('load-more-text');

    loadMoreBtn.addEventListener('click', loadMoreArticles);

    async function loadMoreArticles() {
        if (isLoading || !hasMore) return;

        isLoading = true;
        loadMoreBtn.disabled = true;
        loadingSpinner.classList.remove('d-none');
        loadMoreText.textContent = 'Memuat...';

        try {
            currentPage++;
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            renderArticles();
            
        } catch (error) {
            console.error('Error loading more articles:', error);
            alert('Gagal memuat artikel. Silakan coba lagi.');
        } finally {
            isLoading = false;
            loadMoreBtn.disabled = false;
            loadingSpinner.classList.add('d-none');
            loadMoreText.textContent = 'Muat Lebih Banyak';
        }
    }

    // Hide load more button if no articles initially
    if (oldArticles.length === 0) {
        loadMoreBtn.style.display = 'none';
    }
}

// Show loading state
function showLoading() {
    const articlesContainer = document.getElementById('articles-container');
    articlesContainer.innerHTML = `
        <div class="col-12">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Memuat artikel lama...</p>
            </div>
        </div>
    `;
}

// Hide loading state
function hideLoading() {
    // Loading state is replaced with actual content
}

// Show error message
function showError(message) {
    const articlesContainer = document.getElementById('articles-container');
    articlesContainer.innerHTML = `
        <div class="col-12">
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5>Terjadi Kesalahan</h5>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary mt-2" onclick="location.reload()">
                    <i class="fas fa-refresh me-2"></i>Coba Lagi
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('load-more-btn').style.display = 'none';
}
