document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const inputName = document.getElementById('input-name');
    const inputTitle = document.getElementById('input-title');
    const inputBio = document.getElementById('input-bio');
    const inputAvatar = document.getElementById('input-avatar');
    const inputSkills = document.getElementById('input-skills');
    
    // Social Inputs
    const inputGithub = document.getElementById('input-github');
    const inputLinkedin = document.getElementById('input-linkedin');
    const inputTwitter = document.getElementById('input-twitter');
    const inputPortfolio = document.getElementById('input-portfolio');
    
    const themeRadios = document.getElementsByName('theme-radio');
    const profileForm = document.getElementById('profile-form');
    const submitBtn = document.getElementById('submit-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Live preview elements
    const liveCard = document.getElementById('live-card');
    const cardName = document.getElementById('card-name');
    const cardTitle = document.getElementById('card-title');
    const cardBio = document.getElementById('card-bio');
    const cardAvatar = document.getElementById('card-avatar');
    const cardAvatarFallback = document.getElementById('card-avatar-fallback');
    const cardSkills = document.getElementById('card-skills');
    
    // Social Anchors inside card
    const linkGithub = document.getElementById('link-github');
    const linkLinkedin = document.getElementById('link-linkedin');
    const linkTwitter = document.getElementById('link-twitter');
    const linkPortfolio = document.getElementById('link-portfolio');

    // History elements
    const historyGrid = document.getElementById('history-grid');

    let historyData = [];

    // Real-time input binding listeners
    inputName.addEventListener('input', updateCardName);
    inputTitle.addEventListener('input', updateCardTitle);
    inputBio.addEventListener('input', updateCardBio);
    inputAvatar.addEventListener('input', updateCardAvatar);
    inputSkills.addEventListener('input', updateCardSkills);
    
    // Social bindings
    inputGithub.addEventListener('input', () => updateSocialLink(inputGithub, linkGithub));
    inputLinkedin.addEventListener('input', () => updateSocialLink(inputLinkedin, linkLinkedin));
    inputTwitter.addEventListener('input', () => updateSocialLink(inputTwitter, linkTwitter));
    inputPortfolio.addEventListener('input', () => updateSocialLink(inputPortfolio, linkPortfolio));

    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateCardTheme(e.target.value);
        });
    });

    // Helper: get name initials for fallback avatar
    function getInitials(name) {
        if (!name) return 'RS';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // Dynamic UI updates
    function updateCardName() {
        const value = inputName.value.trim();
        cardName.textContent = value || 'Your Name';
        cardAvatarFallback.textContent = getInitials(value);
    }

    // Dynamic Title
    function updateCardTitle() {
        cardTitle.textContent = inputTitle.value.trim() || 'Professional Title';
    }

    // Dynamic Bio
    function updateCardBio() {
        cardBio.textContent = inputBio.value.trim() || 'Your story will appear here. Start typing in the form to see your card update live in real-time!';
    }

    // Dynamic Avatar
    function updateCardAvatar() {
        const url = inputAvatar.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            cardAvatar.src = url;
            cardAvatar.classList.remove('hidden');
            cardAvatarFallback.classList.add('hidden');
            
            cardAvatar.onerror = () => {
                cardAvatar.classList.add('hidden');
                cardAvatarFallback.classList.remove('hidden');
            };
        } else {
            cardAvatar.classList.add('hidden');
            cardAvatarFallback.classList.remove('hidden');
        }
    }

    // Dynamic Skills
    function updateCardSkills() {
        const skillsText = inputSkills.value.trim();
        cardSkills.innerHTML = '';
        
        if (!skillsText) {
            ['HTML5', 'CSS3', 'JavaScript'].forEach(s => {
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.textContent = s;
                cardSkills.appendChild(badge);
            });
            return;
        }

        const skillsArray = skillsText.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        skillsArray.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            cardSkills.appendChild(badge);
        });
    }

    // Dynamic Social anchors
    function updateSocialLink(inputEl, anchorEl) {
        const val = inputEl.value.trim();
        if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
            anchorEl.href = val;
            anchorEl.classList.remove('hidden');
        } else {
            anchorEl.classList.add('hidden');
        }
    }

    // Dynamic Theme transitions
    function updateCardTheme(themeName) {
        liveCard.className = 'profile-card';
        liveCard.classList.add(`theme-${themeName}`);
        
        // Add subtle background mood lighting changes
        const themeBgColors = {
            'glass': '#0a0e17',
            'dark-neon': '#040710',
            'royal-gold': '#050a12',
            'ocean-breeze': '#012035'
        };
        document.body.style.backgroundColor = themeBgColors[themeName] || '#0a0e17';

        // Animate pop entry
        liveCard.classList.remove('animate-pop');
        void liveCard.offsetWidth; 
        liveCard.classList.add('animate-pop');
    }

    // Export profile card image using html2canvas
    downloadBtn.addEventListener('click', () => {
        const name = inputName.value.trim() || 'profile';
        
        // Display loading feedback
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Rendering image...';

        html2canvas(liveCard, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2 // High resolution scale
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${name.replace(/\s+/g, '_')}_identity_card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Image export failed:', err);
            alert('Failed to export card image. Please try again.');
        }).finally(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Export Card as PNG';
        });
    });

    // Submit form to API
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = inputName.value.trim();
        const title = inputTitle.value.trim();
        const bio = inputBio.value.trim();
        const avatar = inputAvatar.value.trim();
        const skills = inputSkills.value.trim();
        
        // Social handles
        const github = inputGithub.value.trim();
        const linkedin = inputLinkedin.value.trim();
        const twitter = inputTwitter.value.trim();
        const portfolio = inputPortfolio.value.trim();
        
        let theme = 'glass';
        themeRadios.forEach(radio => {
            if (radio.checked) theme = radio.value;
        });

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, job_title: title, bio, avatar_url: avatar, skills, theme,
                    github, linkedin, twitter, portfolio
                })
            });

            if (!response.ok) throw new Error('Failed to save profile');
            
            fetchHistory();
            profileForm.reset();
            themeRadios[0].checked = true;
            
            // Reset preview
            cardName.textContent = 'Your Name';
            cardTitle.textContent = 'Professional Title';
            cardBio.textContent = 'Your story will appear here. Start typing in the form to see your card update live in real-time!';
            cardAvatar.classList.add('hidden');
            cardAvatarFallback.classList.remove('hidden');
            cardAvatarFallback.textContent = 'RS';
            
            // Reset social links inside preview
            [linkGithub, linkLinkedin, linkTwitter, linkPortfolio].forEach(lnk => lnk.classList.add('hidden'));
            
            updateCardSkills();
            updateCardTheme('glass');
            
            alert('Identity profile card saved to studio history!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Profile';
        }
    });

    // Fetch and load registry history
    async function fetchHistory() {
        try {
            const response = await fetch('/api/profiles');
            if (!response.ok) throw new Error('Failed to fetch history');
            
            historyData = await response.json();
            renderHistory(historyData);
        } catch (error) {
            console.error('Error fetching history:', error);
            historyGrid.innerHTML = `
                <div class="loading-history">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i>
                    <p>Failed to load profile history.</p>
                </div>
            `;
        }
    }

    // Render registry cards
    function renderHistory(profiles) {
        historyGrid.innerHTML = '';
        
        if (profiles.length === 0) {
            historyGrid.innerHTML = `
                <div class="loading-history">
                    <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>No profile cards saved in this studio yet.</p>
                </div>
            `;
            return;
        }

        profiles.forEach(profile => {
            const item = document.createElement('div');
            item.className = 'history-card-item';
            
            let avatarHTML = '';
            if (profile.avatar_url && (profile.avatar_url.startsWith('http://') || profile.avatar_url.startsWith('https://'))) {
                avatarHTML = `<img src="${escapeHTML(profile.avatar_url)}" alt="Avatar" class="history-avatar" onerror="this.outerHTML='<div class=&quot;history-fallback&quot;>${getInitials(profile.name)}</div>'">`;
            } else {
                avatarHTML = `<div class="history-fallback">${getInitials(profile.name)}</div>`;
            }

            item.innerHTML = `
                ${avatarHTML}
                <div class="history-details">
                    <div class="history-name">${escapeHTML(profile.name)}</div>
                    <div class="history-title">${escapeHTML(profile.job_title)}</div>
                    <span class="history-theme-tag">${escapeHTML(profile.theme)}</span>
                </div>
            `;

            // Load profile values when clicked
            item.addEventListener('click', () => {
                loadProfileIntoForm(profile);
            });

            historyGrid.appendChild(item);
        });
    }

    // Load values back to form & card
    function loadProfileIntoForm(profile) {
        inputName.value = profile.name;
        inputTitle.value = profile.job_title;
        inputBio.value = profile.bio;
        inputAvatar.value = profile.avatar_url;
        inputSkills.value = profile.skills;
        
        // Social handles
        inputGithub.value = profile.github || '';
        inputLinkedin.value = profile.linkedin || '';
        inputTwitter.value = profile.twitter || '';
        inputPortfolio.value = profile.portfolio || '';

        themeRadios.forEach(radio => {
            if (radio.value === profile.theme) radio.checked = true;
        });

        // Trigger previews
        updateCardName();
        updateCardTitle();
        updateCardBio();
        updateCardAvatar();
        updateCardSkills();
        
        updateSocialLink(inputGithub, linkGithub);
        updateSocialLink(inputLinkedin, linkLinkedin);
        updateSocialLink(inputTwitter, linkTwitter);
        updateSocialLink(inputPortfolio, linkPortfolio);
        
        updateCardTheme(profile.theme);
        
        document.querySelector('.workspace').scrollIntoView({ behavior: 'smooth' });
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Init
    updateCardSkills();
    fetchHistory();
});
