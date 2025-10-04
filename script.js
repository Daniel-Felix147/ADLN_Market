
const API_BASE = 'https://catalogo-products.pages.dev';
    const state = {
      page: 1,
      pageSize: 20,
      q: '',
      category: '',
      total: 0,
      currentUser: null,
      inactivityTimer: null,
      products: [], // Armazena os produtos carregados
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      orders: JSON.parse(localStorage.getItem('orders')) || [],
      addresses: JSON.parse(localStorage.getItem('addresses')) || [],
      carousel: {
        currentSlide: 0,
        totalSlides: 4,
        autoPlayInterval: null,
        isPlaying: true
      },
    };

    const els = {
      grid: document.getElementById('productGrid'),
      q: document.getElementById('search'),
      category: document.getElementById('category'),
      btnSearch: document.getElementById('btnSearch'),
      btnReset: document.getElementById('btnReset'),
      prev: document.getElementById('prev'),
      next: document.getElementById('next'),
      pageInfo: document.getElementById('pageInfo'),
      toast: document.getElementById('toast'),
      categoriesBtn: document.getElementById('categoriesBtn'),
      categoriesSidebar: document.getElementById('categoriesSidebar'),
      sidebarOverlay: document.getElementById('sidebarOverlay'),
      closeSidebar: document.getElementById('closeSidebar'),
      categoriesList: document.getElementById('categoriesList'),
      loginBtn: document.getElementById('loginBtn'),
      registerBtn: document.getElementById('registerBtn'),
      // User Management Elements
      userMenu: document.getElementById('userMenu'),
      userName: document.getElementById('userName'),
      userOrdersBtn: document.getElementById('userOrders'),
      loginModal: document.getElementById('loginModal'),
      registerModal: document.getElementById('registerModal'),
      profileModal: document.getElementById('profileModal'),
      loginForm: document.getElementById('loginForm'),
      registerForm: document.getElementById('registerForm'),
      profileForm: document.getElementById('profileForm'),
      passwordMatchFeedback: document.getElementById('passwordMatchFeedback'),
      closeLoginModal: document.getElementById('closeLoginModal'),
      closeRegisterModal: document.getElementById('closeRegisterModal'),
      closeProfileModal: document.getElementById('closeProfileModal'),
      showLoginModal: document.getElementById('showLoginModal'),
      showRegisterModal: document.getElementById('showRegisterModal'),
      deleteAccountBtn: document.getElementById('deleteAccountBtn'),
      // Product Detail Page
      productDetailPage: document.getElementById('productDetailPage'),
      productDetailContent: document.getElementById('productDetailContent'),
      backToProducts: document.getElementById('backToProducts'),
      // Cart
      cartIconWrapper: document.getElementById('cartIconWrapper'),
      cartItemCount: document.getElementById('cartItemCount'),
      // Cart Modal Elements (removidos - agora é página dedicada)
      // cartModal: document.getElementById('cartModal'),
      // cartContent: document.getElementById('cartContent'),
      // cartFooter: document.getElementById('cartFooter'),
      // closeCartModal: document.getElementById('closeCartModal'),
      // Orders Modal
      ordersModal: document.getElementById('ordersModal'),
      ordersContent: document.getElementById('ordersContent'),
      closeOrdersModal: document.getElementById('closeOrdersModal'),
      // Address Modal
      addressModal: document.getElementById('addressModal'),
      addressContent: document.getElementById('addressContent'),
      closeAddressModal: document.getElementById('closeAddressModal'),
      // Carousel Elements
      carousel: {
        track: document.getElementById('carouselTrack'),
        prevBtn: document.getElementById('carouselPrev'),
        nextBtn: document.getElementById('carouselNext'),
        dots: document.querySelectorAll('.carousel-dot'),
        slides: document.querySelectorAll('.carousel-slide')
      }
    };

    const productImages = {
      // Eletrônicos
      'smart-tv': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
      'smartphone': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
      'notebook': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
      'monitor': 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&q=80',
      'fone': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80',
      
      // Casa
      'aspirador': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80',
      'liquidificador': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
      'cafeteira': 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=80',
      'air-fryer': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
      
      // Moda
      'calca': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
      'jaqueta': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
      'camiseta': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
      'tenis': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80',
      
      // Esportes
      'bicicleta': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&q=80',
      'skate': 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=400&q=80',
      'halter': 'https://images.unsplash.com/photo-1583454155184-870a1f63fd1d?w=400&q=80',
      'bola': 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80',
      
      // Default
      'default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
    };

    function getProductImage(product) {
      const title = product.title.toLowerCase();
      const slug = product.slug.toLowerCase();
      
      // Identifica o tipo de produto pelo título
      if (title.includes('tv')) return productImages['smart-tv'];
      if (title.includes('smartphone') || title.includes('iphone')) return productImages['smartphone'];
      if (title.includes('notebook')) return productImages['notebook'];
      if (title.includes('monitor')) return productImages['monitor'];
      if (title.includes('fone')) return productImages['fone'];
      
      if (title.includes('aspirador')) return productImages['aspirador'];
      if (title.includes('liquidificador')) return productImages['liquidificador'];
      if (title.includes('cafeteira')) return productImages['cafeteira'];
      if (title.includes('air fryer') || title.includes('fritadeira')) return productImages['air-fryer'];
      
      if (title.includes('calça') || title.includes('jeans')) return productImages['calca'];
      if (title.includes('jaqueta')) return productImages['jaqueta'];
      if (title.includes('camiseta')) return productImages['camiseta'];
      if (title.includes('tênis') || title.includes('tenis')) return productImages['tenis'];
      
      if (title.includes('bicicleta') || title.includes('bike')) return productImages['bicicleta'];
      if (title.includes('skate')) return productImages['skate'];
      if (title.includes('halter')) return productImages['halter'];
      if (title.includes('bola')) return productImages['bola'];
      
      return productImages['default'];
    }

    function showToast(msg) {
      els.toast.textContent = msg;
      els.toast.classList.add('show');
      setTimeout(() => els.toast.classList.remove('show'), 2500);
    }

    // Funções do Sidebar de Categorias
    function openCategoriesSidebar() {
      els.categoriesSidebar.classList.add('open');
      els.sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCategoriesSidebar() {
      els.categoriesSidebar.classList.remove('open');
      els.sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function renderCategoriesSidebar(categories) {
      // Função para normalizar nomes de categorias
      function normalizeCategoryName(category) {
        return category.toLowerCase()
          .replace(/[àáâãä]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/e jardim/g, '') // Remove "e jardim" para normalizar "casa e jardim" como "casa"
          .trim();
      }
      
      // Mapear categorias para imagens locais
      const categoryImageMap = {
        'Eletrônicos': 'commons/categorias/eletronicos.jpg',
        'Roupas': 'commons/categorias/roupas.jpg',
        'Casa e Jardim': 'commons/categorias/casa_e_jardim.jpg',
        'Casa': 'commons/categorias/casa_e_jardim.jpg',
        'Jardim': 'commons/categorias/casa_e_jardim.jpg',
        'Esportes': 'commons/categorias/esportes.jpg',
        'Livros': 'commons/categorias/livros.jpg',
        'Beleza': 'commons/categorias/beleza.jpg',
        'Automóveis': 'commons/categorias/automoveis.jpg',
        'Brinquedos': 'commons/categorias/brinquedos.jpg',
        'Saúde': 'commons/categorias/saude.jpg',
        'Alimentação': 'commons/categorias/casa.jpg',
        'Ferramentas': 'commons/categorias/ferramentas.jpg',
        'Música': 'commons/categorias/musica.jpg',
        'Fotografia': 'commons/categorias/fotografia.jpg',
        'Informática': 'commons/categorias/informatica.jpg',
        'Jogos': 'commons/categorias/jogos.jpg',
        'Pet Shop': 'commons/categorias/pet_shop.jpg',
        'Viagem': 'commons/categorias/viagem.jpg',
        'Escritório': 'commons/categorias/escritorio.jpg',
        'Decoração': 'commons/categorias/decoracao.jpg',
        'Outros': 'commons/categorias/outros.jpg',
        'Moda': 'commons/categorias/moda.jpg'
      };
      
      // Criar categorias completas incluindo todas as categorias possíveis
      const allCategories = [
        'Eletrônicos', 'Roupas', 'Casa e Jardim', 'Casa', 'Esportes', 'Livros', 
        'Beleza', 'Automóveis', 'Brinquedos', 'Saúde', 'Alimentação',
        'Ferramentas', 'Música', 'Fotografia', 'Informática', 'Jogos',
        'Pet Shop', 'Viagem', 'Escritório', 'Decoração', 'Moda', 'Outros'
      ];
      
      // Combinar categorias da API com todas as categorias possíveis, evitando duplicatas
      const normalizedCategories = categories.map(cat => normalizeCategoryName(cat));
      const normalizedAllCategories = allCategories.map(cat => normalizeCategoryName(cat));
      
      // Criar um mapa para evitar duplicatas baseado em nomes normalizados
      const uniqueCategories = new Map();
      
      // Primeiro adicionar categorias da API
      categories.forEach(cat => {
        const normalized = normalizeCategoryName(cat);
        if (!uniqueCategories.has(normalized)) {
          uniqueCategories.set(normalized, cat);
        }
      });
      
      // Depois adicionar categorias padrão que não existem
      allCategories.forEach(cat => {
        const normalized = normalizeCategoryName(cat);
        if (!uniqueCategories.has(normalized)) {
          uniqueCategories.set(normalized, cat);
        }
      });
      
      const combinedCategories = Array.from(uniqueCategories.values());
      
      // Contar produtos por categoria
      const categoryCounts = {};
      categories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      
      // Renderizar em formato de grid (quadradinhos)
      els.categoriesList.innerHTML = `
        <div class="categories-grid">
          ${combinedCategories.map(cat => {
            const count = categoryCounts[cat] || 0;
            
            // Buscar imagem com fallback inteligente
            let imagePath = categoryImageMap[cat];
            if (!imagePath) {
              // Tentar encontrar imagem por nome similar
              const normalizedCat = normalizeCategoryName(cat);
              for (const [key, value] of Object.entries(categoryImageMap)) {
                if (normalizeCategoryName(key) === normalizedCat) {
                  imagePath = value;
                  break;
                }
              }
              // Se ainda não encontrou, usar imagem padrão
              if (!imagePath) {
                imagePath = 'commons/categorias/outros.jpg';
              }
            }
            
            return `
              <div class="category-square" data-category="${cat}">
                <div class="category-square-image">
                  <img src="${imagePath}" alt="${cat}" loading="lazy" 
                       onerror="this.src='commons/categorias/outros.jpg'">
                </div>
                <div class="category-square-info">
                  <span class="category-square-name">${cat}</span>
                  <span class="category-square-count">${count}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function selectCategoryFromSidebar(category) {
      // Redirecionar para página de categoria
      window.location.href = `category.html?category=${encodeURIComponent(category)}`;
    }

     // Função para scroll suave até os produtos
     function scrollToProducts() {
       const produtosSection = document.getElementById('produtos');
       produtosSection.scrollIntoView({ 
         behavior: 'smooth',
         block: 'start'
       });
     }

     // Efeito interativo do hero banner - mais visível e responsivo
     function initHeroInteractivity() {
       const heroBanner = document.getElementById('heroBanner');
       let animationFrame;
       
       heroBanner.addEventListener('mousemove', (e) => {
         // Cancelar animação anterior para suavizar
         if (animationFrame) {
           cancelAnimationFrame(animationFrame);
         }
         
         animationFrame = requestAnimationFrame(() => {
           const rect = heroBanner.getBoundingClientRect();
           const x = ((e.clientX - rect.left) / rect.width) * 100;
           const y = ((e.clientY - rect.top) / rect.height) * 100;
           const angle = (x - 50) * 0.8; // Ã‚ngulo mais pronunciado
           
           heroBanner.style.setProperty('--mouse-x', x + '%');
           heroBanner.style.setProperty('--mouse-y', y + '%');
           heroBanner.style.setProperty('--mouse-angle', angle + 'deg');
           
           // Efeito adicional nos elementos flutuantes prÃ³ximos ao mouse
           const floatingElements = heroBanner.querySelectorAll('.floating-element');
           floatingElements.forEach((element, index) => {
             const elementRect = element.getBoundingClientRect();
             const elementX = elementRect.left + elementRect.width / 2;
             const elementY = elementRect.top + elementRect.height / 2;
             const distance = Math.sqrt(Math.pow(e.clientX - elementX, 2) + Math.pow(e.clientY - elementY, 2));
             
             if (distance < 150) {
               const intensity = Math.max(0, 1 - distance / 150);
               element.style.transform = `scale(${1 + intensity * 0.5}) translateY(${-intensity * 10}px)`;
               element.style.opacity = 0.4 + intensity * 0.6;
             } else {
               element.style.transform = '';
               element.style.opacity = '';
             }
           });
         });
       });
       
       heroBanner.addEventListener('mouseleave', () => {
         if (animationFrame) {
           cancelAnimationFrame(animationFrame);
         }
         
         // Transição suave de volta ao estado original
         heroBanner.style.setProperty('--mouse-x', '25%');
         heroBanner.style.setProperty('--mouse-y', '75%');
         heroBanner.style.setProperty('--mouse-angle', '0deg');
         
         // Reset dos elementos flutuantes
         const floatingElements = heroBanner.querySelectorAll('.floating-element');
         floatingElements.forEach(element => {
           element.style.transform = '';
           element.style.opacity = '';
         });
       });
    }
    
    // ===== CARROSSEL DE BANNERS =====
    
    function initCarousel() {
      if (!els.carousel.track) {
        console.log('Carousel track not found');
        return;
      }
      
      console.log('Initializing carousel with', els.carousel.slides.length, 'slides');
      
      // Garantir que o primeiro slide esteja ativo
      els.carousel.slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
      });
      
      // Garantir que o primeiro dot esteja ativo
      els.carousel.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === 0);
      });
      
      // Auto-play - iniciar apÃ³s um pequeno delay para garantir que tudo estÃ¡ carregado
      setTimeout(() => {
        console.log('Starting autoplay after initialization delay...');
        startAutoPlay();
      }, 1000);
      
      // Event listeners para navegação
      if (els.carousel.prevBtn) {
        els.carousel.prevBtn.addEventListener('click', () => {
          console.log('Previous button clicked');
          goToSlide(state.carousel.currentSlide - 1);
        });
      }
      
      if (els.carousel.nextBtn) {
        els.carousel.nextBtn.addEventListener('click', () => {
          console.log('Next button clicked');
          goToSlide(state.carousel.currentSlide + 1);
        });
      }
      
      // Event listeners para dots
      els.carousel.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          console.log('Dot clicked:', index);
          goToSlide(index);
        });
      });
      
      // Pausar auto-play no hover
      els.carousel.track.addEventListener('mouseenter', () => {
        console.log('Mouse enter - pausing autoplay');
        pauseAutoPlay();
      });
      
      els.carousel.track.addEventListener('mouseleave', () => {
        console.log('Mouse leave - resuming autoplay');
        resumeAutoPlay();
      });
      
      // Touch/swipe support
      let startX = 0;
      let endX = 0;
      
      els.carousel.track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        pauseAutoPlay();
      });
      
      els.carousel.track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        resumeAutoPlay();
      });
      
      function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            goToSlide(state.carousel.currentSlide + 1);
          } else {
            goToSlide(state.carousel.currentSlide - 1);
          }
        }
      }
    }
    
    function goToSlide(slideIndex) {
      console.log('Going to slide:', slideIndex);
      
      // Loop infinito
      if (slideIndex >= state.carousel.totalSlides) {
        slideIndex = 0;
      } else if (slideIndex < 0) {
        slideIndex = state.carousel.totalSlides - 1;
      }
      
      state.carousel.currentSlide = slideIndex;
      
      // Atualizar slides
      els.carousel.slides.forEach((slide, index) => {
        if (index === slideIndex) {
          slide.classList.add('active');
          console.log('Activating slide:', index);
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Atualizar dots
      els.carousel.dots.forEach((dot, index) => {
        if (index === slideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Reset progress bar
      resetProgressBar();
    }
    
    function startAutoPlay() {
      console.log('Starting autoplay...');
      
      // Limpar intervalo anterior se existir
      if (state.carousel.autoPlayInterval) {
        clearInterval(state.carousel.autoPlayInterval);
        state.carousel.autoPlayInterval = null;
      }
      
      // Garantir que isPlaying estÃ¡ true
      state.carousel.isPlaying = true;
      
      // Criar novo intervalo
      state.carousel.autoPlayInterval = setInterval(() => {
        if (state.carousel.isPlaying) {
          console.log('Auto-playing: going to next slide');
          goToSlide(state.carousel.currentSlide + 1);
        } else {
          console.log('Autoplay paused, skipping...');
        }
      }, 5000); // 5 segundos
      
      console.log('Autoplay started with interval:', state.carousel.autoPlayInterval);
    }
    
    function pauseAutoPlay() {
      console.log('Pausing autoplay...');
      state.carousel.isPlaying = false;
      if (state.carousel.autoPlayInterval) {
        clearInterval(state.carousel.autoPlayInterval);
        state.carousel.autoPlayInterval = null;
        console.log('Autoplay interval cleared');
      }
    }
    
    function resumeAutoPlay() {
      console.log('Resuming autoplay...');
      state.carousel.isPlaying = true;
      startAutoPlay();
    }
    
    function resetProgressBar() {
      // Remove e recria a barra de progresso
      const existingBar = els.carousel.track.querySelector('::after');
      if (existingBar) {
        existingBar.style.animation = 'none';
        setTimeout(() => {
          existingBar.style.animation = 'progressBar 5s linear infinite';
        }, 10);
      }
    }
    
    // Função para garantir que as imagens carreguem
    function preloadImages() {
      const imageUrls = [
        'commons/banner_1.png',
        'commons/banner_2.png', 
        'commons/banner_3.png',
        'commons/banner_4.png'
      ];
      
      // Adicionar estado de loading inicialmente
      els.carousel.slides.forEach(slide => {
        slide.classList.add('loading');
      });
      
      imageUrls.forEach((url, index) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Banner ${index + 1} loaded successfully`);
          // Remover estado de loading do slide correspondente
          if (els.carousel.slides[index]) {
            els.carousel.slides[index].classList.remove('loading');
          }
        };
        img.onerror = () => {
          console.error(`Failed to load banner ${index + 1}:`, url);
          // Remover estado de loading mesmo em caso de erro
          if (els.carousel.slides[index]) {
            els.carousel.slides[index].classList.remove('loading');
          }
        };
        img.src = url;
      });
    }

    async function loadProducts() {
      const params = new URLSearchParams({
        page: state.page,
        pageSize: state.pageSize,
        q: state.q,
        category: state.category
      });
      els.grid.innerHTML = '<div>Carregando...</div>';
      const res = await fetch(`${API_BASE}/api/products?${params}`);
      const data = await res.json();
      const products = data.products || [];
      state.total = data.meta?.total || 0;

      renderProducts(products);
      renderPagination();
      
      return products; // Retornar os produtos para uso posterior
    }

    function renderProducts(products) {
      state.products = products; // Salva os produtos no estado para fácil acesso
      if (!products.length) {
        els.grid.innerHTML = '<div>Nenhum produto encontrado.</div>';
        return;
      }

      els.grid.innerHTML = products.map(p => `
        <div class="card">
          <img src="${getProductImage(p)}" alt="${p.title}" loading="lazy">
          <div class="title">${p.title}</div>
          <div class="muted">${p.category || ''} • ${p.brand || ''}</div>
          <div class="muted">Preço: R$ ${Number(p.price?.price_final || p.price_final || 0).toFixed(2)}</div>
          <div class="muted">Estoque: ${p.stock?.quantity || p.stock_quantity || 0}</div>
          <button class="btn primary" onclick="openProductDetailModal('${p.id}')">Comprar</button>
        </div>
      `).join('');
    }

    function renderPagination() {
      const totalPages = Math.ceil(state.total / state.pageSize);
      els.pageInfo.textContent = `Página ${state.page} de ${totalPages}`;
      els.prev.disabled = state.page === 1;
      els.next.disabled = state.page >= totalPages;
    }

    // Função buyProduct removida - agora usamos openProductDetailModal

    // Eventos
    // Event listeners para elementos que podem não existir em todas as páginas
    if (els.btnSearch) {
    els.btnSearch.onclick = () => {
      state.q = els.q.value.trim();
      state.category = els.category.value;
      state.page = 1;
      loadProducts();
    };
    }

    if (els.btnReset) {
    els.btnReset.onclick = () => {
      els.q.value = '';
      els.category.value = '';
      state.q = '';
      state.category = '';
      state.page = 1;
      loadProducts();
    };
    }

    if (els.prev) {
    els.prev.onclick = () => {
      if (state.page > 1) {
        state.page--;
        loadProducts();
      }
    };
    }

    if (els.next) {
    els.next.onclick = () => {
      state.page++;
      loadProducts();
    };
    }

    // Buscar categorias dinamicamente
    async function loadCategories() {
      try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
        const apiCategories = [...new Set(data.products.map(p => p.category).filter(Boolean))];
        
        // Categorias organizadas e sem redundâncias
        const allCategories = [
          'Eletrônicos',
          'Informática', 
          'Smartphones',
          'Casa e Jardim',
          'Móveis',
          'Decoração',
          'Moda e Beleza',
          'Esportes',
          'Livros',
          'Saúde',
          'Automóveis',
          'Brinquedos',
          'Música',
          'Fotografia',
          'Jogos',
          'Pet Shop',
          'Viagem',
          'Escritório',
          'Ferramentas',
          'Outros'
        ];
        
        // Combinar categorias da API com todas as categorias possíveis
        const combinedCategories = [...new Set([...apiCategories, ...allCategories])];
        
        // Popular select de categorias
      els.category.innerHTML = '<option value="">Todas categorias</option>' +
          combinedCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        
        // Popular sidebar de categorias
        renderCategoriesSidebar(apiCategories);
        
        console.log('Categorias carregadas:', combinedCategories.length);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Fallback com categorias organizadas
        const fallbackCategories = [
          'Eletrônicos', 'Informática', 'Casa e Jardim', 'Moda e Beleza', 
          'Esportes', 'Livros', 'Saúde', 'Automóveis', 'Brinquedos', 'Outros'
        ];
        els.category.innerHTML = '<option value="">Todas categorias</option>' +
          fallbackCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        renderCategoriesSidebar(fallbackCategories);
      }
    }

    // Event Listeners para novos elementos
    // Event listeners para categorias (só na página inicial)
    if (els.categoriesBtn) {
    els.categoriesBtn.onclick = openCategoriesSidebar;
    }
    if (els.closeSidebar) {
    els.closeSidebar.onclick = closeCategoriesSidebar;
    }
    if (els.sidebarOverlay) {
    els.sidebarOverlay.onclick = closeCategoriesSidebar;
    }
    
    // Event listener para categorias no sidebar (protegido)
    if (els.categoriesList) {
    els.categoriesList.addEventListener('click', (e) => {
      if (e.target.closest('.category-square')) {
        e.preventDefault();
        const categorySquare = e.target.closest('.category-square');
        const category = categorySquare.dataset.category;
        selectCategoryFromSidebar(category);
      }
    });
    }
    
    // Event listeners removidos - agora são gerenciados pelas novas funções
    
    // Ãcone do carrinho
    // Event listeners removidos - agora são gerenciados pelas novas funções

     // ===== SISTEMA DE GESTÃƒO DE USUÃRIOS =====
    
    // Função para criptografar senha (simulação)
    function hashPassword(password) {
      // Simulação de hash - em produção usar bcrypt ou similar
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString();
    }
    
    // Validação de senha
    function validatePassword(password) {
      if (password.length < 10) {
        return 'Senha deve ter no mínimo 10 caracteres';
      }
      if (password.length > 128) {
        return 'Senha deve ter no máximo 128 caracteres';
      }
      if (!/[0-9]/.test(password)) {
        return 'Senha deve conter pelo menos um número';
      }
      if (!/[a-zA-Z]/.test(password)) {
        return 'Senha deve conter pelo menos uma letra';
      }
      if (!/[^a-zA-Z0-9]/.test(password)) {
        return 'Senha deve conter pelo menos um caractere especial';
      }
      
      // Validação adicional de senhas comuns
      const commonPasswords = ['1234567890', 'password123', 'admin123456', 'qwerty1234'];
      if (commonPasswords.includes(password.toLowerCase())) {
        return 'Esta senha é muito comum. Escolha uma mais segura';
      }
      
      return null;
    }
    
    // Calcular força da senha (opcional)
    function calculatePasswordStrength(password) {
      setTimeout(() => {
        let strength = 0;
        
        if (password.length >= 10) strength += 1;
        if (password.length >= 15) strength += 1;
        if (password.length >= 20) strength += 1;
        
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        const feedbackElement = els.passwordMatchFeedback;
        if (feedbackElement && password.length > 0) {
          const level = strength <= 3 ? 'weak' : strength <= 6 ? 'medium' : 'strong';
          const text = strength <= 3 ? 'Frágil' : strength <= 6 ? 'Média' : 'Forte';
          const color = strength <= 3 ? '#E53E3E' : strength <= 6 ? '#F6AD55' : '#00d084';
          
          // Adiciona feedback de força só se não há erro de confirmação
          if (!feedbackElement.textContent.includes('✗') || feedbackElement.textContent.includes('✓')) {
            feedbackElement.innerHTML += ` <small style="color: ${color};">• Força: ${text}</small>`;
          }
        }
      }, 300);
    }
    
    // Verificar se email jÃ¡ existe
    function emailExists(email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.some(user => user.email === email);
    }
    
    // Salvar usuÃ¡rio
    function saveUser(userData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Buscar usuÃ¡rio por email
    function findUserByEmail(email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find(user => user.email === email);
    }
    
    // Atualizar usuÃ¡rio
    function updateUser(email, userData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex(user => user.email === email);
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
        return true;
      }
      return false;
    }
    
    // Excluir usuÃ¡rio
    function deleteUser(email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(user => user.email !== email);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
    }
    
    // Login do usuÃ¡rio
    function loginUser(email, password) {
      const user = findUserByEmail(email);
      if (!user) {
        return { success: false, message: 'E-mail não encontrado' };
      }
      
      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return { success: false, message: 'Senha incorreta' };
      }
      
      state.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      startInactivityTimer();
      updateUIForLoggedUser();
      
      return { success: true, message: 'Login realizado com sucesso!' };
    }
    
    // Logout do usuÃ¡rio
    function logoutUser() {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
      clearInactivityTimer();
      updateUIForLoggedOutUser();
      showToast('Logout realizado com sucesso!');
    }
    
    // Atualizar UI para usuÃ¡rio logado
    function updateUIForLoggedUser() {
      els.loginBtn.style.display = 'none';
      els.registerBtn.style.display = 'none';
      els.userMenu.style.display = 'flex';
      els.userName.textContent = state.currentUser.name;
    }
    
    // Atualizar UI para usuÃ¡rio deslogado
    function updateUIForLoggedOutUser() {
      els.loginBtn.style.display = 'block';
      els.registerBtn.style.display = 'block';
      els.userMenu.style.display = 'none';
    }
    
    // Timer de inatividade (30 minutos)
    function startInactivityTimer() {
      clearInactivityTimer();
      state.inactivityTimer = setTimeout(() => {
        logoutUser();
        showToast('Sessão expirada por inatividade');
      }, 30 * 60 * 1000); // 30 minutos
    }
    
    function clearInactivityTimer() {
      if (state.inactivityTimer) {
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = null;
      }
    }
    
    // Resetar timer em atividade
    function resetInactivityTimer() {
      if (state.currentUser) {
        startInactivityTimer();
      }
    }
    
    // ===== EVENTOS DOS MODAIS =====
    
    // Abrir modal de login
    function openLoginModal() {
      els.loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal de login
    function closeLoginModal() {
      els.loginModal.classList.remove('active');
      document.body.style.overflow = '';
      els.loginForm.reset();
    }
    
    // Abrir modal de cadastro
    function openRegisterModal() {
      els.registerModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal de cadastro
    function closeRegisterModal() {
      els.registerModal.classList.remove('active');
      document.body.style.overflow = '';
      els.registerForm.reset();
    }
    
    // Abrir modal de perfil
    function openProfileModal() {
      if (!state.currentUser) return;
      
      document.getElementById('profileName').value = state.currentUser.name;
      document.getElementById('profileEmail').value = state.currentUser.email;
      document.getElementById('profilePassword').value = '';
      document.getElementById('profileProfile').value = state.currentUser.profile;
      
      els.profileModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal de perfil
    function closeProfileModal() {
      els.profileModal.classList.remove('active');
      document.body.style.overflow = '';
      els.profileForm.reset();
    }
    
    // ===== EVENT LISTENERS =====
    
    // Event listeners para modais de usuário (protegidos)
    if (els.loginBtn) {
    els.loginBtn.onclick = openLoginModal;
    }
    if (els.registerBtn) {
    els.registerBtn.onclick = openRegisterModal;
    }
    if (els.closeLoginModal) {
    els.closeLoginModal.onclick = closeLoginModal;
    }
    if (els.closeRegisterModal) {
    els.closeRegisterModal.onclick = closeRegisterModal;
    }
    if (els.closeProfileModal) {
    els.closeProfileModal.onclick = closeProfileModal;
    }
    if (els.showLoginModal) {
    els.showLoginModal.onclick = (e) => {
      e.preventDefault();
      closeRegisterModal();
      openLoginModal();
    };
    }
    if (els.showRegisterModal) {
    els.showRegisterModal.onclick = (e) => {
      e.preventDefault();
      closeLoginModal();
      openRegisterModal();
    };
    }
    
    // Fechar modal clicando fora
    [els.loginModal, els.registerModal, els.profileModal].forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      };
    });
    
    // FormulÃ¡rio de login
    // Formulário de login (protegido)
    if (els.loginForm) {
    els.loginForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const result = loginUser(email, password);
      if (result.success) {
        closeLoginModal();
        showToast(result.message);
      } else {
        showToast(result.message);
      }
    };
    }
    
    // FormulÃ¡rio de cadastro com validação de confirmação de senha
    if (els.registerForm) {
    els.registerForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;
      const profile = document.getElementById('registerProfile').value;
      
      // Validações
      if (emailExists(email)) {
        showToast('E-mail já cadastrado no sistema');
        return;
      }
      
      const passwordError = validatePassword(password);
      if (passwordError) {
        showToast(passwordError);
        return;
      }
      
      // Validação de confirmação de senha
      if (password !== confirmPassword) {
        showToast('As senhas não coincidem. Por favor, verifique e tente novamente.');
        highlightPasswordMismatch();
        return;
      }
      
      // Se as senhas coincidem, remove o destaque
      clearPasswordMismatch();
      
      // Criar usuÃ¡rio
      const userData = {
        name,
        email,
        password: hashPassword(password),
        profile,
        createdAt: new Date().toISOString()
      };
      
      saveUser(userData);
      closeRegisterModal();
      showToast('Conta criada com sucesso! Faça login para continuar.');
    };
    }
    
    // Validação em tempo real da confirmação de senha
    function initializePasswordValidation() {
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerConfirmPassword');
      const feedbackElement = els.passwordMatchFeedback;
      
      if (passwordInput && confirmPasswordInput && feedbackElement) {
        // Validação em tempo real para ambos os campos
        const validatePasswords = () => {
          const password = passwordInput.value;
          const confirmPassword = confirmPasswordInput.value;
          
          // Remover classes de estilo anteriores
          passwordInput.classList.remove('success', 'error');
          confirmPasswordInput.classList.remove('success', 'error');
          
          if (confirmPassword.length === 0) {
            feedbackElement.textContent = '';
            feedbackElement.className = 'password-match-feedback';
            return;
          }
          
          if (password === confirmPassword && password.length >= 10) {
            feedbackElement.textContent = '✓ Senhas coincidem';
            feedbackElement.className = 'password-match-feedback match-success';
            passwordInput.classList.add('success');
            confirmPasswordInput.classList.add('success');
          } else if (password !== confirmPassword && password.length >= 10) {
            feedbackElement.textContent = '✗ Senhas não coincidem';
            feedbackElement.className = 'password-match-feedback match-error';
            confirmPasswordInput.classList.add('error');
          } else if (password.length < 10) {
            feedbackElement.textContent = '✗ Senha muito curta (mín. 10 caracteres)';
            feedbackElement.className = 'password-match-feedback match-error';
            passwordInput.classList.add('error');
            confirmPasswordInput.classList.add('error');
          }
        };
        
        passwordInput.addEventListener('input', () => {
          validatePasswords();
          calculatePasswordStrength(passwordInput.value);
        });
        confirmPasswordInput.addEventListener('input', validatePasswords);
      }
    }
    
    // Destacar campos de senha quando não coincidem
    function highlightPasswordMismatch() {
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerConfirmPassword');
      
      if (passwordInput && confirmPasswordInput) {
        passwordInput.style.borderColor = '#E53E3E';
        confirmPasswordInput.style.borderColor = '#E53E3E';
        
        setTimeout(() => {
          passwordInput.style.borderColor = '';
          confirmPasswordInput.style.borderColor = '';
        }, 3000);
      }
    }
    
    // Remover destaque dos campos de senha
    function clearPasswordMismatch() {
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('registerConfirmPassword');
      
      if (passwordInput && confirmPasswordInput) {
        passwordInput.style.borderColor = '';
        confirmPasswordInput.style.borderColor = '';
      }
    }
    
    // FormulÃ¡rio de perfil
    if (els.profileForm) {
    els.profileForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('profileName').value;
      const email = document.getElementById('profileEmail').value;
      const password = document.getElementById('profilePassword').value;
      
      const updateData = { name, email };
      
      // Se nova senha foi fornecida
      if (password) {
        const passwordError = validatePassword(password);
        if (passwordError) {
          showToast(passwordError);
          return;
        }
        updateData.password = hashPassword(password);
      }
      
      if (updateUser(state.currentUser.email, updateData)) {
        state.currentUser = { ...state.currentUser, ...updateData };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        els.userName.textContent = state.currentUser.name;
        closeProfileModal();
        showToast('Perfil atualizado com sucesso!');
      } else {
        showToast('Erro ao atualizar perfil');
      }
    };
    }
    
    // Excluir conta (protegido)
    if (els.deleteAccountBtn) {
    els.deleteAccountBtn.onclick = () => {
      if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        deleteUser(state.currentUser.email);
        logoutUser();
        showToast('Conta excluída com sucesso');
      }
    };
    }
    
    // Logout (protegido)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = logoutUser;
    }
    
    // Abrir perfil (protegido)
    const userProfileBtn = document.getElementById('userProfile');
    if (userProfileBtn) {
      userProfileBtn.onclick = openProfileModal;
    }
    
    // Resetar timer de inatividade em atividade
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    
    // Verificar se hÃ¡ usuÃ¡rio logado ao carregar a pÃ¡gina
    function checkLoggedUser() {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        updateUIForLoggedUser();
        startInactivityTimer();
      }
    }
    
    // ===== CARROSSEL DE BANNERS =====
    
    let currentSlideIndex = 0;
    const totalSlides = 7;
    
    // Função para mudar slide
    function changeSlide(direction) {
      currentSlideIndex += direction;
      
      if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
      } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
      }
      
      updateCarousel();
    }
    
    // Função para ir para slide específico
    function currentSlide(slideNumber) {
      currentSlideIndex = slideNumber - 1;
      updateCarousel();
    }
    
    // Função para atualizar o carrossel
    function updateCarousel() {
      const container = document.querySelector('.carousel-container');
      const dots = document.querySelectorAll('.dot');
      
      // Atualizar posição do container (14.285% por slide)
      container.style.transform = `translateX(-${currentSlideIndex * 14.285}%)`;
      
      // Atualizar indicadores
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
      });
    }
    
    // Auto-play do carrossel
    function startCarouselAutoPlay() {
      setInterval(() => {
        changeSlide(1);
      }, 5000); // Muda slide a cada 5 segundos
    }
    
    // ===== FUNÃ‡Ã•ES PARA SEÃ‡Ã•ES DA HOME =====
    
    // Função para validar e corrigir URLs de imagem com interceptação de URLs malformadas
    function validateImageUrl(url) {
      if (!url) return 'https://via.placeholder.com/150/2D3748/E2E8F0?text=IMG';
      
      // Interceptar URLs que são apenas strings malformadas começando com 'ffffff' ou similares
      if (url.startsWith('ffffff') || url.startsWith('www.') || url.match(/^[a-z]+\?text=/i)) {
        console.warn('[DEBUG] URL malformada detectada e corrigida:', url);
        const textMatch = url.match(/text=(.+)$/i);
        if (textMatch) {
          const text = textMatch[1].replace(/([A-Z])/g, ' $1').trim();
          return `https://via.placeholder.com/150/2D3748/E2E8F0?text=${encodeURIComponent(text)}`;
        }
        return 'https://via.placeholder.com/150/2D3748/E2E8F0?text=PRODUCT';
      }
      
      // Interceptar URLs que começam com protocolos inválidos
      if (url.startsWith('http://ffffff') || url.includes('://ffffff')) {
        console.warn('[DEBUG] URL com protocolo inválido detectada:', url);
        const textMatch = url.match(/[?&]text=([^&]+)/i);
        if (textMatch) {
          const text = decodeURIComponent(textMatch[1]);
          return `https://via.placeholder.com/150/2D3748/E2E8F0?text=${encodeURIComponent(text)}`;
        }
        return 'https://via.placeholder.com/150/2D3748/E2E8F0?text=PRODUCT';
      }
      
      // Interceptar qualquer URL que não seja válida e contenha apenas parâmetros 'text='
      if (url.includes('text=') && (!url.includes('via.placeholder.com') && !url.includes('unsplash.com') && !url.includes('googleusercontent.com'))) {
        const textMatch = url.match(/[?&]text=([^&]+)/i);
        if (textMatch) {
          const text = decodeURIComponent(textMatch[1]);
          return `https://via.placeholder.com/150/2D3748/E2E8F0?text=${encodeURIComponent(text)}`;
        }
      }
      
      // Se a URL não tem protocolo mas parece ser uma URL válida, adicionar https://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Verificar se parece ser um domínio válido
        if (url.includes('.') && !url.includes(' ')) {
          return `https://${url}`;
        }
        return 'https://via.placeholder.com/150/2D3748/E2E8F0?text=IMG';
      }
      
      return url;
    }
    
    // Interceptador global para detectar e corrigir URLs malformadas
    function initializeUrlInterceptor() {
      // Interceptar todos os elementos img criados ou modificados
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'img') {
          const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
          Object.defineProperty(element, 'src', {
            set: function(value) {
              const correctedValue = validateImageUrl(value);
              if (correctedValue !== value) {
                console.warn('[URL Fixer] Corrigindo URL malformada:', value, '→', correctedValue);
              }
              originalSetSrc.call(this, correctedValue);
            },
            get: function() {
              return this.getAttribute('src');
            },
            configurable: true
          });
        }
        return element;
      };
      
      // Interceptar atribuições de innerHTML que possam conter URLs problemáticas
      const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value) {
          // Procurar por URLs problemáticas no HTML
          let correctedValue = value;
          const urlMatches = value.match(/src="[^"]*"/g);
          if (urlMatches) {
            urlMatches.forEach(match => {
              const urlMatched = match.match(/src="([^"]*)"/);
              if (urlMatched) {
                const originalUrl = urlMatched[1];
                const correctedUrl = validateImageUrl(originalUrl);
                if (correctedUrl !== originalUrl) {
                  console.warn('[URL Fixer] Corrigindo URL em innerHTML:', originalUrl, '→', correctedUrl);
                  correctedValue = correctedValue.replace(match, match.replace(originalUrl, correctedUrl));
                }
              }
            });
          }
          originalInnerHTML.call(this, correctedValue);
        },
        get: function() {
          return this.innerHTML;
        },
        configurable: true
      });
      
      console.log('[URL Fixer] Interceptador de URLs inicializado');
    }
    
    // Carregar produtos para as seções da home usando os produtos da seção principal
    function loadHomeProducts() {
      try {
        // Usar os produtos já carregados na seção principal
        const productGrid = document.getElementById('productGrid');
        const productCards = productGrid.querySelectorAll('.card');
        
        if (productCards.length === 0) {
          console.log('Produtos ainda não carregados, aguardando...');
          setTimeout(loadHomeProducts, 1000); // Tentar novamente em 1 segundo
          return;
        }
        
        // Extrair dados dos produtos da seção principal
        const products = Array.from(productCards).map(card => {
          const img = card.querySelector('img');
          const title = card.querySelector('.title');
          const category = card.querySelector('.muted');
          
          return {
            name: title ? title.textContent : 'Produto',
            image: validateImageUrl(img ? img.src : null),
            category: category ? category.textContent.split(' • ')[0] : 'Geral'
          };
        });
        
        // Renderizar produtos nas seções da home
        renderFeaturedProducts(products.slice(0, 4));
        renderSpecialOffers(products.slice(0, 1));
        // renderPopularCategories(products); // Comentado para manter Card 3 estático
        renderNewReleases(products.slice(0, 1));
        
      } catch (error) {
        console.error('Erro ao carregar produtos da home:', error);
      }
    }
    
    // Renderizar produtos em destaque
    function renderFeaturedProducts(products) {
      const container = document.querySelector('.card-content.quad-grid');
      if (!container || !products.length) return;
      
      container.innerHTML = products.slice(0, 4).map(product => `
        <div class="quad-item">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80x80/2D3748/E2E8F0?text=IMG'">
          <span class="product-name">${product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name}</span>
        </div>
      `).join('');
    }
    
    // Renderizar ofertas especiais
    function renderSpecialOffers(products) {
      const container = document.querySelector('.card:nth-child(2) .card-content');
      if (!container || !products.length) return;
      
      const product = products[0];
      const discount = Math.floor(Math.random() * 50) + 10; // Simular desconto
      
      container.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="offer-image" onerror="this.src='https://via.placeholder.com/300x200/2D3748/E2E8F0?text=OFFER'">
        <div class="offer-info">
          <div class="offer-discount">${discount}% OFF</div>
          <div class="offer-description">${product.name}</div>
        </div>
      `;
    }
    
    // Renderizar categorias populares - Usar imagens locais
    function renderPopularCategories(products) {
      const container = document.querySelector('.card:nth-child(3) .card-content');
      if (!container) return;
      
      // Usar imagens locais em vez de placeholders
      container.innerHTML = `
        <div class="quad-grid">
          <div class="quad-item">
            <div class="category-image-wrapper">
              <img src="commons/categorias/moda.jpg" alt="Moda" style="display: block; width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="category-name">Moda</span>
          </div>
          <div class="quad-item">
            <div class="category-image-wrapper">
              <img src="commons/categorias/casa_e_jardim.jpg" alt="Casa e Jardim" style="display: block; width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="category-name">Casa e Jardim</span>
          </div>
          <div class="quad-item">
            <div class="category-image-wrapper">
              <img src="commons/categorias/eletronicos.jpg" alt="Eletrônicos" style="display: block; width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="category-name">Eletrônicos</span>
          </div>
          <div class="quad-item">
            <div class="category-image-wrapper">
              <img src="commons/categorias/esportes.jpg" alt="Esportes" style="display: block; width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="category-name">Esportes</span>
          </div>
        </div>
      `;
    }
    
    // Renderizar novos lançamentos
    function renderNewReleases(products) {
      const container = document.querySelector('.card:nth-child(4) .card-content');
      if (!container || !products.length) return;
      
      const product = products[0];
      
      container.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="new-image" onerror="this.src='https://via.placeholder.com/300x200/2D3748/E2E8F0?text=NEW'">
        <div class="new-info">
          <div class="new-badge">NOVO</div>
          <div class="new-description">${product.name}</div>
        </div>
      `;
    }

    // ===== INICIALIZAÃ‡ÃƒO =====
    
    // ===== FUNÇÕES DE GESTÃO DE PRODUTOS =====

    // Funções para salvar dados no localStorage
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(state.cart));
      updateCartIcon();
    }

    function saveOrders() {
      localStorage.setItem('orders', JSON.stringify(state.orders));
    }

    function saveAddresses() {
      localStorage.setItem('addresses', JSON.stringify(state.addresses));
    }

    // Atualizar ícone do carrinho
    function updateCartIcon() {
      const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      els.cartItemCount.textContent = totalItems;
    }

    // Abrir modal de detalhes do produto
    function openProductDetailModal(productId) {
      const product = state.products.find(p => p.id === productId);
      if (!product) return;

      const price = Number(product.price?.price_final || 0).toFixed(2);
      const stock = product.stock?.quantity || product.stock_quantity || 0;

      els.productDetailContent.innerHTML = `
        <div class="product-image-container">
          <img src="${getProductImage(product)}" alt="${product.title}">
        </div>
        <div class="product-info-container">
          <h4>${product.title}</h4>
          <p class="brand">${product.brand || 'Marca Desconhecida'}</p>
          <div class="product-price">R$ ${price}</div>
          <div class="quantity-selector">
            <label for="productQuantity">Quantidade:</label>
            <div class="quantity-controls">
              <button onclick="updateQuantity(-1)">-</button>
              <input type="number" id="productQuantity" value="1" min="1" max="${stock}">
              <button onclick="updateQuantity(1)">+</button>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn secondary" onclick="handleAddToCart('${product.id}')">Adicionar ao Carrinho</button>
            <button class="btn primary" onclick="handleBuyNow('${product.id}')">Comprar Agora</button>
          </div>
        </div>
      `;
      els.productDetailPage.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    // Adicionar produto ao carrinho
    function handleAddToCart(productId) {
      const quantity = parseInt(document.getElementById('productQuantity').value);
      addToCart(productId, quantity);
      showToast('Produto adicionado ao carrinho!');
      els.productDetailPage.style.display = 'none';
      document.body.style.overflow = '';
    }

    // Comprar agora
    function handleBuyNow(productId) {
      const quantity = parseInt(document.getElementById('productQuantity').value);
      addToCart(productId, quantity);
      els.productDetailPage.style.display = 'none';
      document.body.style.overflow = '';
      // Redirecionar para a página do carrinho
      window.location.href = 'cart.html';
    }

    // Adicionar ao carrinho
    function addToCart(productId, quantity = 1) {
      const product = state.products.find(p => p.id === productId);
      if (!product) return;

      const stock = product.stock?.quantity || product.stock_quantity || 0;
      if (stock < quantity) {
        showToast('Estoque insuficiente!');
        return;
      }

      const existingItem = state.cart.find(item => item.id === productId);

      if (existingItem) {
        if (existingItem.quantity + quantity > stock) {
          showToast('Estoque insuficiente!');
          return;
        }
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          id: product.id,
          title: product.title,
          brand: product.brand || 'Marca Desconhecida',
          price: Number(product.price?.price_final || 0),
          image: getProductImage(product),
          quantity: quantity,
          stock: stock
        });
      }
      saveCart();
    }

    // Remover do carrinho
    function removeFromCart(productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
      saveCart();
      updateCartIcon();
      
      // Se estivermos na página do carrinho, renderizar novamente
      if (document.getElementById('cartPageContainer')) {
        renderCartPage();
      }
    }

    // Atualizar quantidade no carrinho
    function updateCartQuantity(productId, quantity) {
      const item = state.cart.find(item => item.id === productId);
      if (item) {
        if (quantity < 1) {
          removeFromCart(productId);
        } else if (quantity > item.stock) {
          showToast('Estoque insuficiente!');
          return;
        } else {
          item.quantity = parseInt(quantity);
          saveCart();
          updateCartIcon();
          
          // Se estivermos na página do carrinho, renderizar novamente
          if (document.getElementById('cartPageContainer')) {
            renderCartPage();
          }
        }
      }
    }

    // Renderizar carrinho
    // ===== FUNÇÕES PARA MODAL DE FRETE E ENTREGA =====

// Abrir modal de frete e entrega
function openShippingModal() {
  const modal = document.getElementById('shippingModal');
  const content = document.getElementById('shippingModalContent');
  
  if (!modal || !content) return;
  
  // Criar conteúdo do modal
  content.innerHTML = `
    <div class="payment-modal-content">
      <div class="payment-status">
        <div class="payment-status-icon">🚚</div>
        <div class="payment-status-text">Em Desenvolvimento</div>
      </div>
      
      <div class="payment-info">
        Estamos trabalhando para oferecer opções de frete e entrega completas para todo o Brasil.
      </div>
      
      <div class="payment-features">
        <div class="payment-feature">
          <h4>Frete Grátis</h4>
          <p>Para compras acima de R$ 99,00</p>
        </div>
        <div class="payment-feature">
          <h4>Entrega Rápida</h4>
          <p>Até 2 dias úteis para São Paulo</p>
        </div>
        <div class="payment-feature">
          <h4>Rastreamento</h4>
          <p>Acompanhe seu pedido em tempo real</p>
        </div>
        <div class="payment-feature">
          <h4>Entregas Seguras</h4>
          <p>Proteção total para seus produtos</p>
        </div>
      </div>
      
      <div style="margin-top: 25px; padding: 15px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border: 1px solid rgba(255, 193, 7, 0.2);">
        <p style="color: #FFC107; margin: 0; font-weight: 600;">
          ⚠️ Esta funcionalidade está em desenvolvimento e será disponibilizada em breve!
        </p>
      </div>
    </div>
  `;
  
  // Mostrar modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Adicionar event listener para fechar modal
  const closeBtn = document.getElementById('closeShippingModal');
  if (closeBtn) {
    closeBtn.onclick = () => closeShippingModal();
  }
  
  // Fechar ao clicar no overlay
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeShippingModal();
    }
  };
}

// Fechar modal de frete e entrega
function closeShippingModal() {
  const modal = document.getElementById('shippingModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ===== FUNÇÕES PARA MODAL DE PAGAMENTO =====

// Abrir modal de pagamento
function openPaymentModal(paymentType) {
  const modal = document.getElementById('paymentModal');
  const title = document.getElementById('paymentModalTitle');
  const content = document.getElementById('paymentModalContent');
  
  if (!modal || !title || !content) return;
  
  // Definir título e conteúdo baseado no tipo de pagamento
  const paymentData = {
    credit: {
      title: 'Cartões de Crédito',
      icon: '💳',
      status: 'Em Desenvolvimento',
      info: 'Estamos trabalhando para oferecer pagamento com cartões de crédito das principais bandeiras.',
      features: [
        { title: 'Bandeiras Aceitas', desc: 'Visa, Mastercard, Elo, American Express' },
        { title: 'Parcelamento', desc: 'Até 12x sem juros' },
        { title: 'Segurança', desc: 'Transações 100% seguras' }
      ]
    },
    debit: {
      title: 'Cartões de Débito',
      icon: '💳',
      status: 'Em Desenvolvimento',
      info: 'Pagamento instantâneo com cartão de débito das principais bandeiras.',
      features: [
        { title: 'Bandeiras Aceitas', desc: 'Visa, Mastercard, Elo' },
        { title: 'Aprovação', desc: 'Aprovação instantânea' },
        { title: 'Segurança', desc: 'Proteção total do seu dinheiro' }
      ]
    },
    pix: {
      title: 'Pix',
      icon: '📱',
      status: 'Em Desenvolvimento',
      info: 'Pagamento instantâneo e gratuito através do Pix.',
      features: [
        { title: 'Velocidade', desc: 'Pagamento instantâneo' },
        { title: 'Gratuito', desc: 'Sem taxas adicionais' },
        { title: 'Disponibilidade', desc: '24h por dia, 7 dias por semana' }
      ]
    },
    boleto: {
      title: 'Boleto Bancário',
      icon: '📄',
      status: 'Em Desenvolvimento',
      info: 'Pagamento tradicional com boleto bancário.',
      features: [
        { title: 'Prazo', desc: 'Vencimento em até 3 dias úteis' },
        { title: 'Aceitação', desc: 'Todos os bancos' },
        { title: 'Segurança', desc: 'Pagamento garantido' }
      ]
    }
  };
  
  const data = paymentData[paymentType];
  if (!data) return;
  
  // Atualizar título
  title.textContent = data.title;
  
  // Criar conteúdo do modal
  content.innerHTML = `
    <div class="payment-modal-content">
      <div class="payment-status">
        <div class="payment-status-icon">${data.icon}</div>
        <div class="payment-status-text">${data.status}</div>
      </div>
      
      <div class="payment-info">
        ${data.info}
      </div>
      
      <div class="payment-features">
        ${data.features.map(feature => `
          <div class="payment-feature">
            <h4>${feature.title}</h4>
            <p>${feature.desc}</p>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 25px; padding: 15px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border: 1px solid rgba(255, 193, 7, 0.2);">
        <p style="color: #FFC107; margin: 0; font-weight: 600;">
          ⚠️ Esta funcionalidade está em desenvolvimento e será disponibilizada em breve!
        </p>
      </div>
    </div>
  `;
  
  // Mostrar modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Adicionar event listener para fechar modal
  const closeBtn = document.getElementById('closePaymentModal');
  if (closeBtn) {
    closeBtn.onclick = () => closePaymentModal();
  }
  
  // Fechar ao clicar no overlay
  modal.onclick = (e) => {
    if (e.target === modal) {
      closePaymentModal();
    }
  };
}

// Fechar modal de pagamento
function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ===== FUNÇÕES PARA PÁGINA DE CATEGORIA =====
    
    // Obter parâmetro da URL
    function getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
    
    // Renderizar lista de categorias na sidebar
    function renderCategorySidebar(activeCategory = '') {
      const categoryList = document.getElementById('categoryList');
      if (!categoryList) return;
      
      const categories = [
        'Eletrônicos',
        'Informática', 
        'Smartphones',
        'Casa e Jardim',
        'Móveis',
        'Decoração',
        'Moda e Beleza',
        'Esportes',
        'Livros',
        'Saúde',
        'Automóveis',
        'Brinquedos',
        'Música',
        'Fotografia',
        'Jogos',
        'Pet Shop',
        'Viagem',
        'Escritório',
        'Ferramentas',
        'Outros'
      ];
      
      categoryList.innerHTML = categories.map(category => `
        <a href="category.html?category=${encodeURIComponent(category)}" 
           class="category-link ${activeCategory === category ? 'active' : ''}">
          ${category}
        </a>
      `).join('');
    }
    
    // Carregar produtos da categoria
    async function loadCategoryProducts(categoryName) {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        const data = await response.json();
        
        // Verificar a estrutura dos dados de forma mais robusta
        let products = [];
        
        if (Array.isArray(data)) {
          products = data;
        } else if (data && typeof data === 'object') {
          // Tentar diferentes propriedades possíveis
          if (data.products && Array.isArray(data.products)) {
            products = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            products = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            products = data.items;
          } else if (data.results && Array.isArray(data.results)) {
            products = data.results;
          }
        }
        
        // Filtrar produtos pela categoria com mapeamento inteligente
        const categoryProducts = products.filter(product => {
          if (!product || !product.category) return false;
          
          const productCategory = product.category.toLowerCase();
          const searchCategory = categoryName.toLowerCase();
          
          // Mapeamento de categorias similares
          const categoryMappings = {
            'eletrônicos': ['eletrônicos', 'eletronicos', 'eletrodomésticos', 'tv', 'smart tv'],
            'informática': ['informática', 'informatica', 'computadores', 'notebook', 'desktop', 'pc'],
            'smartphones': ['smartphones', 'smartphone', 'celular', 'telefone', 'mobile'],
            'casa e jardim': ['casa e jardim', 'casa', 'jardim', 'limpeza', 'organização'],
            'móveis': ['móveis', 'moveis', 'mesa', 'cadeira', 'sofá', 'sofa'],
            'decoração': ['decoração', 'decoracao', 'decoração', 'quadros', 'luminárias'],
            'moda e beleza': ['moda e beleza', 'moda', 'beleza', 'roupas', 'roupa', 'vestuário', 'cosméticos'],
            'esportes': ['esportes', 'esporte', 'fitness', 'academia', 'corrida'],
            'livros': ['livros', 'livro', 'literatura', 'educação'],
            'saúde': ['saúde', 'saude', 'medicina', 'farmacêuticos'],
            'automóveis': ['automóveis', 'automoveis', 'carros', 'carro', 'veículos'],
            'brinquedos': ['brinquedos', 'brinquedo', 'jogos infantis', 'infantil'],
            'música': ['música', 'musica', 'instrumentos', 'som', 'áudio'],
            'fotografia': ['fotografia', 'câmeras', 'cameras', 'foto'],
            'jogos': ['jogos', 'jogo', 'videogame', 'console', 'gaming'],
            'pet shop': ['pet shop', 'pet', 'animais', 'cachorro', 'gato'],
            'viagem': ['viagem', 'turismo', 'malas', 'bagagem'],
            'escritório': ['escritório', 'escritorio', 'papelaria', 'material'],
            'ferramentas': ['ferramentas', 'ferramenta', 'construção', 'reparos'],
            'outros': ['outros', 'diversos', 'geral']
          };
          
          // Verificar se a categoria do produto está mapeada para a categoria de busca
          const mappedCategories = categoryMappings[searchCategory] || [searchCategory];
          
          return mappedCategories.some(mappedCat => 
            productCategory.includes(mappedCat) || 
            mappedCat.includes(productCategory) ||
            productCategory === mappedCat
          );
        });
        
        renderCategoryProducts(categoryProducts);
        updateCategoryHeader(categoryName, categoryProducts.length);
        
      } catch (error) {
        console.error('Erro ao carregar produtos da categoria:', error);
        showToast('Erro ao carregar produtos da categoria');
        
        // Em caso de erro, mostrar estado vazio
        const productGrid = document.getElementById('categoryProductGrid');
        if (productGrid) {
          productGrid.innerHTML = `
            <div class="no-products">
              <h3>Erro ao carregar produtos</h3>
              <p>Não foi possível carregar os produtos desta categoria. Tente novamente mais tarde.</p>
              <a href="index.html" class="btn-primary">Voltar à Página Inicial</a>
            </div>
          `;
        }
      }
    }
    
    // Renderizar produtos da categoria
    function renderCategoryProducts(products) {
      const productGrid = document.getElementById('categoryProductGrid');
      if (!productGrid) return;
      
      if (products.length === 0) {
        productGrid.innerHTML = `
          <div class="no-products">
            <h3>Nenhum produto encontrado nesta categoria</h3>
            <p>Tente navegar para outra categoria ou voltar à página inicial.</p>
            <a href="index.html" class="btn-primary">Ver Todos os Produtos</a>
          </div>
        `;
        return;
      }
      
      productGrid.innerHTML = products.map(product => {
        const price = Number(product.price?.price_final || 0).toFixed(2);
        const stock = product.stock?.quantity || product.stock_quantity || 0;
        const image = getProductImage(product);
        
        return `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image">
              <img src="${image}" alt="${product.title}" loading="lazy">
              <div class="product-overlay">
                <button class="btn-quick-view" onclick="openProductDetailModal('${product.id}')">
                  Ver Detalhes
                </button>
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-title">${product.title}</h3>
              <p class="product-brand">${product.brand || 'Marca Desconhecida'}</p>
              <div class="product-price">R$ ${price}</div>
              <div class="product-stock">${stock > 0 ? `${stock} em estoque` : 'Fora de estoque'}</div>
              <div class="product-actions">
                <button class="btn-add-cart" onclick="handleAddToCart('${product.id}')" 
                        ${stock === 0 ? 'disabled' : ''}>
                  Adicionar ao Carrinho
                </button>
                <button class="btn-buy-now" onclick="handleBuyNow('${product.id}')" 
                        ${stock === 0 ? 'disabled' : ''}>
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
    
    // Atualizar cabeçalho da categoria
    function updateCategoryHeader(categoryName, productCount) {
      const categoryTitle = document.getElementById('categoryTitle');
      const categoryDescription = document.getElementById('categoryDescription');
      
      if (categoryTitle) {
        categoryTitle.textContent = categoryName;
      }
      
      if (categoryDescription) {
        categoryDescription.textContent = `${productCount} produto${productCount !== 1 ? 's' : ''} encontrado${productCount !== 1 ? 's' : ''} nesta categoria`;
      }
    }
    
    // Inicializar página de categoria
    function initializeCategoryPage() {
      const categoryName = getUrlParameter('category');
      
      if (!categoryName) {
        // Se não há categoria na URL, redirecionar para página inicial
        window.location.href = 'index.html';
        return;
      }
      
      // Renderizar sidebar de categorias
      renderCategorySidebar(categoryName);
      
      // Carregar produtos da categoria
      loadCategoryProducts(categoryName);
      
      // Atualizar título da página
      document.title = `${categoryName} - ADLN-Market`;
    }

    // ===== FUNÇÕES PARA PÁGINA DO CARRINHO =====
    
    // Renderizar página do carrinho
    function renderCartPage() {
      const container = document.getElementById('cartPageContainer');
      if (!container) return;
      
      if (state.cart.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-container">
            <div class="cart-empty-illustration">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" stroke="#4A5568" stroke-width="2" fill="rgba(0, 208, 132, 0.05)"/>
                <path d="M70 100 L90 120 L130 80" stroke="#00d084" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="60" y="140" width="80" height="20" rx="10" fill="#4A5568"/>
                <text x="100" y="155" text-anchor="middle" fill="#A0AEC0" font-size="12" font-family="Inter">🛒</text>
              </svg>
            </div>
            <h1 class="cart-empty-title">Seu carrinho está vazio</h1>
            <p class="cart-empty-subtitle">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho.<br>
              Que tal explorar nossa loja e encontrar produtos incríveis?
            </p>
            <div class="cart-empty-actions">
              <a href="index.html" class="cart-empty-btn cart-empty-btn-primary">Continuar Comprando</a>
              <button class="cart-empty-btn cart-empty-btn-secondary" onclick="openLoginModal()">Fazer Login</button>
            </div>
          </div>
        `;
        return;
      }
      
      const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal > 200 ? 0 : 15;
      const total = subtotal + shipping;
      
      container.innerHTML = `
        <div class="cart-layout">
          <div class="cart-items-list">
            <div class="cart-items-header">
              <h2 class="cart-items-title">Carrinho de Compras</h2>
              <span class="cart-items-count">${totalItems} ${totalItems === 1 ? 'item' : 'itens'}</span>
            </div>
            ${state.cart.map(item => `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                  <h3 class="cart-item-title">${item.title}</h3>
                  <p class="cart-item-brand">${item.brand || 'Marca Desconhecida'}</p>
                  <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                  <div class="cart-item-controls">
                    <div class="quantity-controls">
                      <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                      <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" 
                             onchange="updateCartQuantity('${item.id}', this.value)">
                      <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">Remover</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="cart-summary">
            <h3 class="cart-summary-title">Resumo do Pedido</h3>
            <div class="cart-summary-details">
              <div class="summary-row">
                <span class="summary-label">Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})</span>
                <span class="summary-value">R$ ${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Frete</span>
                <span class="summary-value">${shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
              </div>
              ${shipping > 0 ? `
                <div class="summary-row" style="font-size: 0.9rem; color: #00d084;">
                  <span class="summary-label">Frete grátis a partir de R$ 200,00</span>
                  <span class="summary-value">Faltam R$ ${(200 - subtotal).toFixed(2)}</span>
                </div>
              ` : ''}
            </div>
            <div class="summary-row summary-total">
              <span class="summary-label">Total</span>
              <span class="summary-value">R$ ${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()" ${state.cart.length === 0 ? 'disabled' : ''}>
              Finalizar Compra
            </button>
          </div>
        </div>
      `;
    }

    // Prosseguir para checkout (atualizada para página do carrinho)
    function proceedToCheckout() {
      if (state.cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
      }

      if (!state.currentUser) {
        showToast('Faça login para continuar com a compra');
        els.loginModal.classList.add('active');
        return;
      }

      // Verificar se tem endereços cadastrados
      if (state.addresses.length === 0) {
        showToast('Cadastre um endereço para continuar');
        openAddressModal();
        return;
      }

      createOrder();
    }

    // Criar pedido
    function createOrder() {
      if (state.cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
      }

      const newOrder = {
        id: `ADLN-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'Aguardando Pagamento',
        address: state.addresses.find(addr => addr.selected) || state.addresses[0]
      };

      state.orders.unshift(newOrder);
      saveOrders();

      state.cart = [];
      saveCart();

      // Se estivermos na página do carrinho, renderizar novamente
      if (document.getElementById('cartPageContainer')) {
        renderCartPage();
      }
      
      showToast('Pedido realizado com sucesso!');
      updateCartIcon();
      renderOrders();
    }

    // Renderizar pedidos
    function renderOrders() {
      if (state.orders.length === 0) {
        els.ordersContent.innerHTML = `<p class="cart-empty-message">Você ainda não fez nenhum pedido.</p>`;
        return;
      }

      els.ordersContent.innerHTML = state.orders.map(order => `
        <div class="order-item">
          <div class="order-header">
            <div><strong>Pedido:</strong> ${order.id}</div>
            <div><strong>Data:</strong> ${new Date(order.date).toLocaleDateString()}</div>
            <div class="status ${order.status.toLowerCase().replace(' ', '')}">${order.status}</div>
          </div>
          <div class="order-product-list">
            ${order.items.map(item => `<div class="product-item"><span>${item.quantity}x ${item.title}</span> <span>R$ ${(item.price * item.quantity).toFixed(2)}</span></div>`).join('')}
          </div>
          <div class="order-footer">
            <div class="total">Total: R$ ${order.total.toFixed(2)}</div>
            ${order.status === 'Aguardando Pagamento' ? `<button class="btn btn-danger" onclick="cancelOrder('${order.id}')" style="margin-top: 10px;">Cancelar Pedido</button>` : ''}
            ${order.status === 'Entregue' ? `<button class="btn" onclick="requestReturn('${order.id}')" style="margin-top: 10px;">Solicitar Devolução</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    // Abrir modal de pedidos
    function openOrdersModal() {
      renderOrders();
      els.ordersModal.classList.add('active');
    }

    // Cancelar pedido
    function cancelOrder(orderId) {
      const reason = prompt("Por favor, informe o motivo do cancelamento:");
      if (reason && reason.trim() !== "") {
        const order = state.orders.find(o => o.id === orderId);
        if (order && order.status === 'Aguardando Pagamento') {
          order.status = 'Cancelado';
          order.cancelReason = reason;
          order.cancelDate = new Date().toISOString();
          saveOrders();
          renderOrders();
          showToast('Pedido cancelado.');
        } else {
          showToast('Este pedido não pode ser cancelado.');
        }
      } else {
        showToast('O motivo do cancelamento é obrigatório.');
      }
    }

    // Solicitar devolução
    function requestReturn(orderId) {
      const reason = prompt("Por favor, informe o motivo da devolução:");
      if (reason && reason.trim() !== "") {
        const order = state.orders.find(o => o.id === orderId);
        if (order && order.status === 'Entregue') {
          order.returnRequested = true;
          order.returnReason = reason;
          order.returnDate = new Date().toISOString();
          saveOrders();
          renderOrders();
          showToast('Solicitação de devolução enviada.');
        } else {
          showToast('Este pedido não pode ser devolvido.');
        }
      } else {
        showToast('O motivo da devolução é obrigatório.');
      }
    }

    // ===== FUNÇÕES DE ENDEREÇOS =====

    // Buscar CEP
    async function fetchCEP(cep) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
      }
    }

    // Renderizar endereços
    function renderAddresses() {
      if (state.addresses.length === 0) {
        els.addressContent.innerHTML = `
          <p class="cart-empty-message">Nenhum endereço cadastrado.</p>
          <button class="btn primary" onclick="addNewAddress()">Adicionar Endereço</button>
        `;
        return;
      }

      els.addressContent.innerHTML = `
        <div class="address-list">
          ${state.addresses.map((addr, index) => `
            <div class="address-item ${addr.selected ? 'selected' : ''}" onclick="selectAddress(${index})">
              <div class="address-type">${addr.type}</div>
              <div class="address-details">
                ${addr.street}, ${addr.number}<br>
                ${addr.neighborhood} - ${addr.city}/${addr.state}<br>
                CEP: ${addr.cep}
                ${addr.complement ? `<br>Complemento: ${addr.complement}` : ''}
              </div>
              <div class="address-actions">
                <button class="btn" onclick="editAddress(${index})">Editar</button>
                <button class="btn btn-danger" onclick="deleteAddress(${index})">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn primary" onclick="addNewAddress()" style="margin-top: 16px;">Adicionar Novo Endereço</button>
      `;
    }

    // Selecionar endereço
    function selectAddress(index) {
      state.addresses.forEach(addr => addr.selected = false);
      state.addresses[index].selected = true;
      saveAddresses();
      renderAddresses();
    }

    // Adicionar novo endereço
    async function addNewAddress() {
      const type = prompt("Tipo do endereço (Residencial, Comercial, Entrega):");
      if (!type) return;

      const cep = prompt("CEP:");
      if (!cep) return;

      const cepData = await fetchCEP(cep);
      if (!cepData || cepData.erro) {
        showToast('CEP não encontrado');
        return;
      }

      const number = prompt("Número:");
      if (!number) return;

      const complement = prompt("Complemento (opcional):");

      const newAddress = {
        type: type,
        cep: cep,
        street: cepData.logradouro,
        number: number,
        neighborhood: cepData.bairro,
        city: cepData.localidade,
        state: cepData.uf,
        complement: complement || '',
        selected: state.addresses.length === 0
      };

      state.addresses.push(newAddress);
      saveAddresses();
      renderAddresses();
      showToast('Endereço adicionado com sucesso!');
    }

    // Editar endereço
    function editAddress(index) {
      const addr = state.addresses[index];
      const newType = prompt("Tipo do endereço:", addr.type);
      if (!newType) return;

      const newNumber = prompt("Número:", addr.number);
      if (!newNumber) return;

      const newComplement = prompt("Complemento:", addr.complement);

      state.addresses[index] = {
        ...addr,
        type: newType,
        number: newNumber,
        complement: newComplement || ''
      };

      saveAddresses();
      renderAddresses();
      showToast('Endereço atualizado!');
    }

    // Excluir endereço
    function deleteAddress(index) {
      if (confirm('Tem certeza que deseja excluir este endereço?')) {
        state.addresses.splice(index, 1);
        saveAddresses();
        renderAddresses();
        showToast('Endereço excluído!');
      }
    }

    // Abrir modal de endereços
    function openAddressModal() {
      renderAddresses();
      els.addressModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // ===== EVENT LISTENERS =====

    // Event listeners para novos modais (protegidos)
    if (els.backToProducts) {
      els.backToProducts.onclick = () => {
        els.productDetailPage.style.display = 'none';
        document.body.style.overflow = '';
      };
    }
    
    if (els.userOrdersBtn) {
      els.userOrdersBtn.onclick = openOrdersModal;
    }
    if (els.closeOrdersModal) {
      els.closeOrdersModal.onclick = () => {
        els.ordersModal.classList.remove('active');
        document.body.style.overflow = '';
      };
    }
    if (els.closeAddressModal) {
      els.closeAddressModal.onclick = () => {
        els.addressModal.classList.remove('active');
        document.body.style.overflow = '';
      };
    }

    // Fechar modais clicando fora (atualizado - removido cartModal)
    [els.ordersModal, els.addressModal].forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      };
    });

    // ===== EXPOSIÇÃO GLOBAL DE FUNÇÕES =====
    
    // Função para atualizar quantidade no modal de produto
    function updateQuantity(change) {
      const input = document.getElementById('productQuantity');
      if (!input) return;
      const currentValue = parseInt(input.value) || 1;
      const newValue = Math.max(1, Math.min(parseInt(input.max) || 10, currentValue + change));
      input.value = newValue;
    }

    // Expor funções globalmente para uso nos onclick do HTML
    window.openProductDetailModal = openProductDetailModal;
    window.handleAddToCart = handleAddToCart;
    window.handleBuyNow = handleBuyNow;
    window.removeFromCart = removeFromCart;
    window.updateCartQuantity = updateCartQuantity;
    window.openOrdersModal = openOrdersModal;
    window.cancelOrder = cancelOrder;
    window.requestReturn = requestReturn;
    window.openAddressModal = openAddressModal;
    window.addNewAddress = addNewAddress;
    window.selectAddress = selectAddress;
    window.editAddress = editAddress;
    window.deleteAddress = deleteAddress;
    window.updateQuantity = updateQuantity;
    window.selectCategoryFromSidebar = selectCategoryFromSidebar;
    window.openPaymentModal = openPaymentModal;
    window.closePaymentModal = closePaymentModal;
    window.openShippingModal = openShippingModal;
    window.closeShippingModal = closeShippingModal;

    // ===== INICIALIZAÇÃO CONDICIONAL POR PÁGINA =====
    
    // Função de inicialização
    function initializeApp() {
      // Detectar qual página estamos e inicializar funcionalidades correspondentes
      if (document.getElementById('productGrid')) {
        // Página inicial (index.html)
    loadProducts().then(() => {
      loadHomeProducts(); // Carregar produtos para as seções da home após carregar os principais
    });
    startCarouselAutoPlay(); // Iniciar auto-play do carrossel
      }
      
      if (document.getElementById('cartPageContainer')) {
        // Página do carrinho (cart.html)
        renderCartPage();
      }
      
      if (document.getElementById('categoryProductGrid')) {
        // Página de categoria (category.html)
        initializeCategoryPage();
      }
      
      // Funcionalidades comuns a todas as páginas
      checkLoggedUser();
      loadCategories();
      updateCartIcon(); // Atualizar ícone do carrinho
    }
    
    // ===== FUNCIONALIDADES MOBILE OTIMIZADAS =====
    
    
    // Detectar instalação PWA
    function detectPWAInstallation() {
      // Verificar se estamos em ambiente de desenvolvimento local
      if (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log('[PWA] Modo de desenvolvimento - funcionalidades PWA limitadas');
        return;
      }
      
      state.pwa.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                               window.navigator.standalone ||
                               document.referrer.includes('android-app://');
      
      // PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.pwa.deferredPrompt = e;
        state.pwa.isInstallable = true;
        
        // Mostrar prompt de instalação após delay
        setTimeout(() => {
          if (!state.pwa.isStandalone && !state.pwa.installPromptShown) {
            showInstallBanner();
          }
        }, 3000);
      });
      
      // Detecta quando PWA é instalada
      window.addEventListener('appinstalled', () => {
        state.pwa.isInstalled = true;
        hideInstallBanner();
        showNotification('App instalado com sucesso! 🎉', 'success');
        localStorage.setItem('pwaInstalled', 'true');
      });
      
      // Verificar se há update do PWA
      let refreshing = false;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      }
    }
    
    // Banner de instalação PWA
    function showInstallBanner() {
      const banner = document.createElement('div');
      banner.id = 'pwa-install-banner';
      banner.innerHTML = `
        <div class="pwa-banner-content">
          <div class="pwa-banner-icon">📱</div>
          <div class="pwa-banner-text">
            <strong>Instale o ADLN-Market!</strong>
            <small>Tenha acesso rápido e funcionalidade offline</small>
          </div>
          <div class="pwa-banner-actions">
            <button class="pwa-banner-btn" id="pwa-install-btn">Instalar</button>
            <button class="pwa-banner-btn secondary" id="pwa-dismiss-btn">✕</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(banner);
      
      // Event listeners
      document.getElementById('pwa-install-btn').onclick = () => {
        installPWA();
        localStorage.setItem('installPromptShown', 'true');
      };
      
      document.getElementById('pwa-dismiss-btn').onclick = () => {
        hideInstallBanner();
        localStorage.setItem('installPromptShown', 'true');
      };
      
      // Auto-hide após 10 segundos
      setTimeout(() => {
        if (document.getElementById('pwa-install-banner')) {
          hideInstallBanner();
        }
      }, 10000);
    }
    
    function hideInstallBanner() {
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        banner.remove();
      }
    }
    
    function installPWA() {
      if (state.pwa.deferredPrompt) {
        state.pwa.deferredPrompt.prompt();
        state.pwa.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] Usuário aceitou instalar');
          } else {
            console.log('[PWA] Usuário rejeitou instalação');
          }
          state.pwa.deferredPrompt = null;
        });
      }
    }
    
    // Notificação de update
    function showUpdateNotification() {
      const notification = document.createElement('div');
      notification.className = 'update-notification';
      notification.innerHTML = `
        <div class="update-content">
          <span class="update-text">📦 Nova versão disponível!</span>
          <button class="update-btn" id="update-btn">Atualizar</button>
          <button class="update-btn secondary" id="dismiss-update">Mais tarde</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      document.getElementById('update-btn').onclick = () => {
        window.location.reload();
      };
      
      document.getElementById('dismiss-update').onclick = () => {
        notification.remove();
      };
      
      // Auto-hide após 15 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 15000);
    }
    
    // ===== GESTOS DE TOQUE (TOUCH GESTURES) =====
    
    function initializeTouchGestures() {
      let startY = 0;
      let startX = 0;
      let currentY = 0;
      let currentX = 0;
      let isScrolling;
      
      document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        // Touch gesture handling simplified
      }, { passive: true });
      
      document.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        currentX = e.touches[0].clientX;
        
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;
        
        // Determinar se é scroll horizontal ou vertical
        if (isScrolling === null) {
          isScrolling = Math.abs(deltaX) > Math.abs(deltaY);
        }
        
        // Pull to Refresh (apenas em mobile)
        if (window.innerWidth <= 768 && !isScrolling && deltaY > 80 && window.scrollY <= 0) {
          if (!state.touch.pullToRefreshTriggered) {
            triggerPullToRefresh();
          }
        }
        
        // Swipe gestures para sidebar
        if (window.innerWidth <= 768 && isScrolling && Math.abs(deltaX) > 30) {
          if (deltaX > 0) {
            // Swipe da esquerda para direita - abrir sidebar de categorias
            if (!document.getElementById('categoriesSidebar').classList.contains('open')) {
              openCategoriesSidebar();
            }
          } else if (deltaX < -30) {
            // Swipe da direita para esquerda - fechar sidebar
            if (document.getElementById('categoriesSidebar').classList.contains('open')) {
              closeCategoriesSidebar();
            }
          }
        }
        
      }, { passive: true });
      
      document.addEventListener('touchend', () => {
        isScrolling = null;
        state.touch.pullToRefreshTriggered = false;
      }, { passive: true });
    }
    
    function triggerPullToRefresh() {
      state.touch.pullToRefreshTriggered = true;
      
      // Mostrar indicador visual
      const refreshIndicator = document.createElement('div');
      refreshIndicator.className = 'pull-to-refresh-indicator';
      refreshIndicator.innerHTML = '🔄 Atualizando...';
      document.body.insertBefore(refreshIndicator, document.body.firstChild);
      
      // Simular refresh
      setTimeout(() => {
        refreshIndicator.remove();
        
        // Recarregar dados
        if (document.getElementById('productGrid')) {
          loadProducts();
        }
        
        // Mostrar feedback
        showNotification('Conteúdo atualizado! ✨', 'success');
      }, 1500);
    }
    
    // ===== FUNÇÕES DE CONECTIVIDADE =====
    
    function initializeConnectivityHandling() {
      // Status de conexão
      window.addEventListener('online', () => {
        state.pwa.offline = false;
        hideOfflineIndicator();
        showNotification('Conexão restaurada! 🌐', 'success');
      });
      
      window.addEventListener('offline', () => {
        state.pwa.offline = true;
        showOfflineIndicator();
      });
      
      // Verificar status inicial
      if (state.pwa.offline) {
        showOfflineIndicator();
      }
    }
    
    function showOfflineIndicator() {
      if (document.getElementById('offline-indicator')) return;
      
      const indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.className = 'offline-indicator';
      indicator.innerHTML = '📡 Você está offline - Modo offline ativado';
      document.body.appendChild(indicator);
    }
    
    function hideOfflineIndicator() {
      const indicator = document.getElementById('offline-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
    
    // ===== NOTIFICAÇÕES PUSH =====
    
    function requestNotificationPermission() {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('[PWA] Permissão para notificações concedida');
            // Registrar para push notifications aqui
          }
        });
      }
    }
    
    // ===== PERFORMANCE MOBILE =====
    
    function optimizeForMobile() {
      if (window.innerWidth <= 768) {
        // Desabilitar hover effects em mobile
        document.body.classList.add('mobile-device');
        
        // Otimizar scroll
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Prevenção de zoom duplo toque
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
          const now = (new Date()).getTime();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        }, false);
      }
    }
    
    // Atualizar função de inicialização principal
    function initializeApp() {
      // Detectar qual página estamos e inicializar funcionalidades correspondentes
      if (document.getElementById('productGrid')) {
        // Página inicial (index.html)
        loadProducts().then(() => {
          loadHomeProducts(); // Carregar produtos para as seções da home após carregar os principais
        });
        startCarouselAutoPlay(); // Iniciar auto-play do carrossel
      }
      
      if (document.getElementById('cartPageContainer')) {
        // Página do carrinho (cart.html)
        renderCartPage();
      }
      
      if (document.getElementById('categoryProductGrid')) {
        // Página de categoria (category.html)
        initializeCategoryPage();
      }
      
      // Funcionalidades comuns a todas as páginas
      checkLoggedUser();
      loadCategories();
      updateCartIcon(); // Atualizar ícone do carrinho
      
      // ===== OTIMIZAÇÕES MOBILE =====
      optimizeForMobile();
      
      // ===== INICIALIZAR VALIDAÇÕES DE SENHA =====
      initializePasswordValidation();
      
      // ===== INTERCEPTAÇÃO DE URLs MALFORMADAS =====
      initializeUrlInterceptor();
    }
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
      initializeApp();
    }
    
    // ===== MENU HAMBÚRGUER AMAZON-STYLE =====
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const sideMenuClose = document.getElementById('sideMenuClose');
    
    function toggleSideMenu() {
        const wasActive = sideMenu.classList.contains('active');
        
        if (!wasActive) {
            // Abrir menu
            sideMenu.classList.add('active');
            sideMenuOverlay.classList.add('active');
            hamburgerMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            // Fechar menu
            closeSideMenu();
        }
    }
    
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        sideMenuOverlay.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners para o menu hambúrguer
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleSideMenu);
    }
    
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', closeSideMenu);
    }
    
    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', closeSideMenu);
    }
    
    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });
    
    // Barra de pesquisa toggle no mobile
    function toggleSearchBar() {
        const searchContainer = document.querySelector('.header-search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('active');
        }
    }
    
    // Adicionar ícone de busca no header mobile que ativa a barra de pesquisa
    function addMobileSearchIcon() {
        if (window.innerWidth <= 768) {
            const headerActions = document.querySelector('.header-nav-actions');
            if (headerActions && !document.getElementById('mobileSearchBtn')) {
                const searchBtn = document.createElement('button');
                searchBtn.id = 'mobileSearchBtn';
                searchBtn.innerHTML = '🔍';
                searchBtn.className = 'cart-icon-wrapper';
                searchBtn.style.fontSize = '18px';
                searchBtn.title = 'Buscar';
                searchBtn.addEventListener('click', toggleSearchBar);
                
                // Inserir antes do carrinho
                const cartWrapper = headerActions.querySelector('.cart-icon-wrapper');
                if (cartWrapper) {
                    headerActions.insertBefore(searchBtn, cartWrapper);
                } else {
                    headerActions.appendChild(searchBtn);
                }
            }
        } else {
            const mobileSearchBtn = document.getElementById('mobileSearchBtn');
            if (mobileSearchBtn) {
                mobileSearchBtn.remove();
            }
        }
    }
    
    // Executar quando a página carrear e quando a tela for redimensionada
    window.addEventListener('resize', addMobileSearchIcon);
    addMobileSearchIcon();
    
    // Inicialização completa
