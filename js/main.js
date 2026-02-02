(function(){
    const EMAIL = 'drvigneshsnephro@gmail.com';

    // Mobile menu
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if(toggle && navLinks){
        toggle.addEventListener('click', function(){
            const isActive = navLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive);
        });
        // close on link click
        navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
            navLinks.classList.remove('active');
            toggle.setAttribute('aria-expanded','false');
        }));
    }

    // Set aria-current for links that match current hash or path
    function setAriaCurrent(){
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            try{
                const href = link.getAttribute('href');
                // Simple logic: if href matches hash, or if href is part of pathname
                // For multi-page, we should check if window.location.pathname ends with the href (if it's a file)
                // or if it matches the hash.
                if(href){
                    if(href === window.location.hash){
                         link.setAttribute('aria-current','page');
                    } else if (href !== '#' && href.includes('.html') && window.location.pathname.endsWith(href)) {
                         link.setAttribute('aria-current','page');
                    } else {
                         link.removeAttribute('aria-current');
                    }
                }
            }catch(e){}
        });
    }
    setAriaCurrent();
    window.addEventListener('hashchange', setAriaCurrent);

    // Scrollspy: keep nav state updated as the user scrolls.
    const sectionIds = ['about','services','conditions','education','faq','contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const byId = new Map(sectionIds.map(id => [id, document.querySelector('.nav-links a[href="#'+id+'"]')]));
    if('IntersectionObserver' in window && sections.length){
        const spy = new IntersectionObserver((entries)=>{
            // pick the most visible intersecting section
            const visible = entries
                .filter(e=>e.isIntersecting)
                .sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
            if(!visible || !visible.target || !visible.target.id) return;
            byId.forEach((link, id) => {
                if(!link) return;
                if(id === visible.target.id) link.setAttribute('aria-current','page');
                else link.removeAttribute('aria-current');
            });
        },{threshold:[0.12,0.25,0.5,0.75],rootMargin:'-20% 0px -65% 0px'});
        sections.forEach(s=>spy.observe(s));
    }

    // Toast utility
    let toastEl = document.querySelector('.toast');
    if(!toastEl){
        toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.setAttribute('role','status');
        toastEl.setAttribute('aria-live','polite');
        document.body.appendChild(toastEl);
    }
    let toastTimer = null;
    function showToast(text){
        toastEl.textContent = text;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2400);
    }

    // Copy email shortcut
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if(copyEmailBtn){
        copyEmailBtn.addEventListener('click', async ()=>{
            try{
                await navigator.clipboard.writeText(EMAIL);
                showToast('Email copied to clipboard');
            }catch(e){
                // Fallback for older browsers
                const ta = document.createElement('textarea');
                ta.value = EMAIL;
                ta.setAttribute('readonly','');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try{ document.execCommand('copy'); showToast('Email copied'); }
                catch(err){ showToast('Copy not supported'); }
                document.body.removeChild(ta);
            }
        });
    }

    // Simple contact form handler: open default mail client with prefilled values
    window.handleContactSubmit = function(e){
        e.preventDefault();
        const name = encodeURIComponent(document.getElementById('name').value.trim());
        const subject = encodeURIComponent(document.getElementById('subject').value.trim());
        const email = encodeURIComponent(document.getElementById('email').value.trim());
        const phone = encodeURIComponent(document.getElementById('phone').value.trim());
        const message = encodeURIComponent(document.getElementById('message').value.trim());

        const bodyLines = [
            'Name: '+name,
            'Email: '+email,
            phone ? ('Phone: '+phone) : '',
            '',
            'Message:',
            message
        ].filter(Boolean).join('%0D%0A');

        const mailto = 'mailto:'+EMAIL
                     + '?subject=' + subject
                     + '&body=' + bodyLines;

        // open mail client
        window.location.href = mailto;
        return false;
    };

    // Simple image error handling
    document.querySelectorAll('img').forEach(img=>{
        img.addEventListener('error', function(){
            this.style.display = 'none';
            this.setAttribute('alt','Image not available');
        });
    });

    // Add subtle reduce-motion friendly intersection observer for cards
    if('IntersectionObserver' in window){
        const obs = new IntersectionObserver((entries)=>{
            entries.forEach(ent=>{
                if(ent.isIntersecting){
                    ent.target.style.opacity='1';
                    ent.target.style.transform='translateY(0)';
                    obs.unobserve(ent.target);
                }
            });
        },{threshold:0.12,rootMargin:'0px 0px -30px 0px'});
        document.querySelectorAll('.qual-card,.service-card,.condition-item').forEach((el)=>{
            el.style.opacity='0';
            el.style.transform='translateY(10px)';
            el.style.transition='opacity .6s ease, transform .6s ease';
            obs.observe(el);
        });
    }

})();
