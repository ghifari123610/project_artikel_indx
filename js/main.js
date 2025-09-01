// Main JavaScript for Pondok Informatika News - Static Version
const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

// Global variables
let allArticles = [];
let currentPage = 1;
const articlesPerPage = 10;
let allTags = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pondok Informatika News loaded successfully!');

    // Load initial articles
    loadArticles();
});

// Load articles from API
async function loadArticles() {
    try {
        showLoading();
        
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        allArticles = data.data || [];
        
        // Sort articles by id descending (newest first)
        allArticles.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        
        // Render initial content
        renderHeroContent();
        renderSidebarArticles();
        renderMainArticles();
        
    } catch (error) {
        console.error('Error fetching articles:', error);
        showError('Gagal memuat artikel. Silakan refresh halaman.');
    } finally {
        hideLoading();
    }
}

// Render hero section content
function renderHeroContent() {
    const heroContent = document.getElementById('hero-content');
    
    if (allArticles.length === 0) {
        heroContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h5>Tidak ada artikel tersedia</h5>
                <p class="text-muted">Silakan coba lagi nanti</p>
            </div>
        `;
        return;
    }
    
    const heroArticle = allArticles[0];
    heroContent.innerHTML = `
        <div class="hero-main">
            <a href="article.html?id=${heroArticle.id}" class="text-decoration-none">
                <div class="card hero-card border-0">
                    <img src="${heroArticle.image_url || 'https://via.placeholder.com/800x400/DC3545/FFFFFF?text=Pondok+Informatika'}" 
                         class="card-img-top" alt="${heroArticle.title}">
                    <div class="card-body p-0 mt-3">
                        <span class="badge bg-danger mb-2">HEADLINE</span>
                        <h1 class="card-title h2 fw-bold text-dark">
                            ${heroArticle.title}
                        </h1>
                        <p class="card-text text-muted">
                            ${heroArticle.description ? heroArticle.description.substring(0, 150) + '...' : 'Baca selengkapnya...'}
                        </p>
                        <small class="text-muted">
                            <i class="far fa-clock"></i> ${heroArticle.created_at || heroArticle.date || 'Hari ini'}
                        </small>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function renderSidebarArticles() {
    const sidebarContainer = document.getElementById('sidebar-articles');
    const tagsContainer = document.getElementById('tags-container');
    
    if (allArticles.length <= 1) {
        sidebarContainer.innerHTML = '<p class="text-muted">Tidak ada artikel lainnya</p>';
        tagsContainer.innerHTML = '<p class="text-muted">No tags available</p>';
        return;
    }
    
    const sidebarArticles = allArticles.slice(1, 5);
    let sidebarHTML = '';
    
    sidebarArticles.forEach(article => {
        sidebarHTML += `
            <div class="mini-news mb-3">
                <a href="article.html?id=${article.id}" class="text-decoration-none">
                    <div class="row g-2">
                        <div class="col-4">
                            <img src="${article.image_url || 'https://via.placeholder.com/150x100/6C757D/FFFFFF?text=News'}" 
                                 class="img-fluid rounded" alt="${article.title}">
                        </div>
                        <div class="col-8">
                            <h6 class="mb-1 text-dark fw-bold">${article.title}</h6>
                            <small class="text-muted">${article.created_at || article.date || 'Hari ini'}</small>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    
    sidebarContainer.innerHTML = sidebarHTML;

    // Extract unique tags from allArticles
    allTags = [...new Set(allArticles.map(article => article.kategori).filter(k => k))];

    // Render tags
    let tagsHTML = '';
    allTags.forEach(tag => {
        tagsHTML += `<a href="tag.html?tag=${encodeURIComponent(tag)}" class="badge bg-secondary text-decoration-none me-1 mb-1">${tag}</a>`;
    });
    tagsContainer.innerHTML = tagsHTML;
}

// Render main articles (display all articles since load more is removed)
function renderMainArticles() {
    const container = document.getElementById('articles-container');

    if (allArticles.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                    <h5>Tidak ada artikel tersedia</h5>
                    <p class="text-muted">Silakan coba lagi nanti</p>
                </div>
            </div>
        `;
        return;
    }

    // Display all articles (or limit to a reasonable number, e.g., first 20)
    const displayArticles = allArticles.slice(0, 20); // Show first 20 articles

    let articlesHTML = '';

    displayArticles.forEach(article => {
        articlesHTML += `
            <div class="col-md-6 mb-4 article-item fade-in">
                <div class="card news-card h-100 border-0 shadow-sm">
                    <a href="article.html?id=${article.id}" class="text-decoration-none">
                        <img src="${article.image_url || 'https://via.placeholder.com/400x250/DC3545/FFFFFF?text=News'}"
                             class="card-img-top" alt="${article.title}">
                        <div class="card-body">
                            <span class="badge bg-primary mb-2">${article.kategori || 'Umum'}</span>
                            <h5 class="card-title text-dark fw-bold">${article.title}</h5>
                            <p class="card-text text-muted">
                                ${article.description ? article.description.substring(0, 100) + '...' : 'Baca selengkapnya...'}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="far fa-clock"></i> ${article.created_at || article.date || 'Hari ini'}
                                </small>
                                <small class="text-muted">
                                    <i class="far fa-eye"></i> ${Math.floor(Math.random() * 1000) + 100} views
                                </small>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = articlesHTML;
}



// Show loading state
function showLoading() {
    const containers = ['hero-content', 'sidebar-articles', 'articles-container'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Memuat...</p>
                </div>
            `;
        }
    });
}

// Hide loading state
function hideLoading() {
    // Loading states are replaced with actual content in render functions
}

// Show error message
function showError(message) {
    const containers = ['hero-content', 'sidebar-articles', 'articles-container'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h5>Terjadi Kesalahan</h5>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary mt-2" onclick="location.reload()">
                        <i class="fas fa-refresh me-2"></i>Coba Lagi
                    </button>
                </div>
            `;
        }
    });
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
