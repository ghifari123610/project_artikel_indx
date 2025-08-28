// JavaScript for Article Detail Page
const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Article page loaded');
    
    // Get article ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        loadArticle(articleId);
    } else {
        showError('Artikel tidak ditemukan. ID artikel tidak valid.');
    }
});

// Load specific article
async function loadArticle(articleId) {
    try {
        showLoading();
        
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const articles = data.data || [];
        
        const article = articles.find(a => a.id == articleId);
        
        if (!article) {
            showError('Artikel yang Anda cari tidak ditemukan');
            return;
        }
        
        // Clean HTML content
        const cleanContent = cleanHTMLContent(article.content || article.description || 'Konten artikel tidak tersedia.');
        
        // Get random related articles (excluding current article)
        const relatedArticles = articles
            .filter(a => a.id != articleId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
        
        // Render article content
        renderArticle(article, cleanContent, relatedArticles);
        
        // Update page title and meta description
        updatePageMetadata(article);
        
    } catch (error) {
        console.error('Error fetching article:', error);
        showError('Gagal memuat artikel. Silakan coba lagi.');
    } finally {
        hideLoading();
    }
}

// Render article content
function renderArticle(article, cleanContent, relatedArticles) {
    const articleContent = document.getElementById('article-content');
    
    articleContent.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                <article>
                    <!-- Gambar besar di atas -->
                    <div class="mb-4">
                        ${article.image_url ? `
                        <img src="${article.image_url}" alt="${article.title}" class="img-fluid rounded w-100" style="height: 400px; object-fit: cover;">
                        ` : ''}
                    </div>
                    
                    <!-- Judul artikel di bawah gambar -->
                    <h1 class="fw-bold mb-3" style="font-size: 2.5rem; line-height: 1.2;">${article.title}</h1>
                    
                    <!-- Metadata -->
                    <div class="d-flex align-items-center mb-4 flex-wrap">
                        <span class="badge bg-primary me-3 mb-2">${article.kategori || 'Umum'}</span>
                        <p class="text-muted mb-0 me-4">
                            <i class="far fa-clock"></i> ${article.created_at || article.date || 'Hari ini'}
                        </p>
                        <p class="text-muted mb-0">
                            <i class="fas fa-user"></i> Di tulis oleh: ${article.nama_lengkap_santri || article.author || 'Admin'}
                        </p>
                    </div>
                    
                    <!-- Konten artikel -->
                    <div class="article-content">
                        ${cleanContent}
                    </div>
                </article>
            </div>
            <div class="col-lg-4">
                <aside class="related-articles">
                    <h5 class="border-bottom border-danger pb-2 mb-3">Artikel Lainnya</h5>
                    <ul class="list-unstyled">
                        <li class="mb-3">
                            <a href="index.html" class="text-decoration-none">Kembali ke Beranda</a>
                        </li>
                    </ul>
                    <ul class="list-unstyled">
                        ${relatedArticles.length > 0 ? relatedArticles.map(relArticle => `
                            <li class="mb-3">
                                <a href="article.html?id=${relArticle.id}" class="text-decoration-none d-flex align-items-start">
                                    <img src="${relArticle.image_url || 'https://via.placeholder.com/80x60'}" 
                                         class="img-fluid rounded me-3 flex-shrink-0" 
                                         alt="${relArticle.title}" 
                                         style="width: 80px; height: 60px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1 text-dark fw-bold" style="font-size: 0.9rem; line-height: 1.3;">
                                            ${relArticle.title}
                                        </h6>
                                    </div>
                                </a>
                            </li>
                        `).join('') : `
                            <li class="text-muted">Tidak ada artikel lainnya</li>
                        `}
                    </ul>
                </aside>
            </div>
        </div>
    `;
}

// Update page title and meta description
function updatePageMetadata(article) {
    document.title = `${article.title} - Pondok Informatika News`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const description = article.description ? 
            article.description.substring(0, 160) : 
            'Artikel dari Pondok Informatika News';
        metaDescription.content = description;
    }
    
    // Update Open Graph meta tags if needed
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.content = article.title;
    if (ogDescription) {
        ogDescription.content = article.description ? 
            article.description.substring(0, 160) : 
            'Artikel dari Pondok Informatika News';
    }
}

// Show loading state
function showLoading() {
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Memuat artikel...</p>
        </div>
    `;
}

// Hide loading state
function hideLoading() {
    // Loading state is replaced with actual content
}

// Show error message
function showError(message) {
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h5>Terjadi Kesalahan</h5>
            <p class="text-muted">${message}</p>
            <a href="index.html" class="btn btn-primary mt-2">
                <i class="fas fa-home me-2"></i>Kembali ke Beranda
            </a>
        </div>
    `;
}

// Utility function to clean HTML content
function cleanHTMLContent(content) {
    if (!content) return 'Konten artikel tidak tersedia.';
    
    return content
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&mdash;/g, '-')
        .replace(/&ndash;/g, '-')
        .replace(/\s+/g, ' ')
        .trim();
}
