// Tag page JavaScript for Pondok Informatika News
const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

// Global variables
let allArticles = [];
let filteredArticles = [];
let currentTag = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Tag page loaded successfully!');
    
    // Get tag from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentTag = urlParams.get('tag');
    
    if (!currentTag) {
        showError('Tag tidak ditemukan');
        return;
    }
    
    // Update page title
    document.getElementById('tag-title').textContent = `Tag: ${currentTag}`;
    
    // Load articles
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
        
        // Filter articles by tag
        filteredArticles = allArticles.filter(article => 
            article.kategori && article.kategori.toLowerCase() === currentTag.toLowerCase()
        );
        
        // Sort filtered articles by id descending (newest first)
        filteredArticles.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        
        // Render filtered articles
        renderTagArticles();
        
    } catch (error) {
        console.error('Error fetching articles:', error);
        showError('Gagal memuat artikel. Silakan refresh halaman.');
    } finally {
        hideLoading();
    }
}

// Render filtered articles in YouTube-like grid
function renderTagArticles() {
    const container = document.getElementById('tag-content');
    
    if (filteredArticles.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h5>Tidak ada artikel dengan tag ini</h5>
                <p class="text-muted">Silakan coba tag lainnya</p>
                <a href="index.html" class="btn btn-primary mt-3">
                    <i class="fas fa-home me-2"></i>Kembali ke Beranda
                </a>
            </div>
        `;
        return;
    }
    
    let articlesHTML = '<div class="row">';
    
    filteredArticles.forEach(article => {
        articlesHTML += `
            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div class="card h-100 border-0 shadow-sm">
                    <a href="article.html?id=${article.id}" class="text-decoration-none">
                        <img src="${article.image_url || 'https://via.placeholder.com/320x180/DC3545/FFFFFF?text=News'}" 
                             class="card-img-top" alt="${article.title}" style="height: 180px; object-fit: cover;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-dark fw-bold mb-2" style="font-size: 14px; line-height: 1.3;">
                                ${article.title}
                            </h6>
                            <p class="card-text text-muted small mb-2" style="font-size: 12px;">
                                ${article.description ? article.description.substring(0, 80) + '...' : 'Baca selengkapnya...'}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted" style="font-size: 11px;">
                                    <i class="far fa-clock"></i> ${article.created_at || article.date || 'Hari ini'}
                                </small>
                                <small class="text-muted" style="font-size: 11px;">
                                    <i class="far fa-eye"></i> ${Math.floor(Math.random() * 1000) + 100} views
                                </small>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
    });
    
    articlesHTML += '</div>';
    container.innerHTML = articlesHTML;
}

// Show loading state
function showLoading() {
    const container = document.getElementById('tag-content');
    container.innerHTML = `
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
    // Loading states are replaced with actual content in render functions
}

// Show error message
function showError(message) {
    const container = document.getElementById('tag-content');
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
