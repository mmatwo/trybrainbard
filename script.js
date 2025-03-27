// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other open FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
        });
    });

    // Image Carousel Setup
    setupImageCarousel();
});

function setupImageCarousel() {
    const heroImage = document.querySelector('.hero-image');
    const imageContainer = heroImage.querySelector('.image-container');
    
    // Image paths - replace with your actual image paths
    const imagePaths = [
        'images/AppStore1.png',
        'images/AppStore2.png',
        'images/AppStore3.png',
        'images/AppStore4.png',
        'images/AppStore5.png'
    ];
    
    // Create and append all images
    imagePaths.forEach((path, index) => {
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Brain Bard app - Screen ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        imageContainer.appendChild(img);
    });
    
    // Set up click handler to cycle through images
    let currentImageIndex = 0;
    const images = imageContainer.querySelectorAll('img');
    
    heroImage.addEventListener('click', () => {
        // Hide current image
        images[currentImageIndex].classList.remove('active');
        
        // Move to next image
        currentImageIndex = (currentImageIndex + 1) % images.length;
        
        // Show next image
        images[currentImageIndex].classList.add('active');
    });
}