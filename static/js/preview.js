import { refs } from "./dom.js";

const DEFAULT_BIO =
    "Your story will appear here. Start typing in the form to see your card update live in real-time!";

export function getInitials(name) {
    if (!name) return "RS";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function updateCardName() {
    const value = refs.inputName.value.trim();
    refs.cardName.textContent = value || "Your Name";
    refs.cardAvatarFallback.textContent = getInitials(value);
}

export function updateCardTitle() {
    refs.cardTitle.textContent = refs.inputTitle.value.trim() || "Professional Title";
}

export function updateCardBio() {
    refs.cardBio.textContent = refs.inputBio.value.trim() || DEFAULT_BIO;
}

export function updateCardAvatar() {
    const url = refs.inputAvatar.value.trim();
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        refs.cardAvatar.src = url;
        refs.cardAvatar.classList.remove("hidden");
        refs.cardAvatarFallback.classList.add("hidden");

        refs.cardAvatar.onerror = () => {
            refs.cardAvatar.classList.add("hidden");
            refs.cardAvatarFallback.classList.remove("hidden");
        };
    } else {
        refs.cardAvatar.classList.add("hidden");
        refs.cardAvatarFallback.classList.remove("hidden");
    }
}

export function updateCardSkills() {
    const skillsText = refs.inputSkills.value.trim();
    refs.cardSkills.innerHTML = "";

    if (!skillsText) {
        ["HTML5", "CSS3", "JavaScript"].forEach((skill) => {
            const badge = document.createElement("span");
            badge.className = "skill-badge";
            badge.textContent = skill;
            refs.cardSkills.appendChild(badge);
        });
        return;
    }

    const skillsArray = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

    skillsArray.forEach((skill) => {
        const badge = document.createElement("span");
        badge.className = "skill-badge";
        badge.textContent = skill;
        refs.cardSkills.appendChild(badge);
    });
}

export function updateSocialLink(inputEl, anchorEl) {
    const value = inputEl.value.trim();
    if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
        anchorEl.href = value;
        anchorEl.classList.remove("hidden");
    } else {
        anchorEl.classList.add("hidden");
    }
}

export function updateCardTheme(themeName) {
    refs.liveCard.className = "profile-card";
    refs.liveCard.classList.add(`theme-${themeName}`);

    const themeBgColors = {
        glass: "#0a0e17",
        "dark-neon": "#040710",
        "royal-gold": "#050a12",
        "ocean-breeze": "#012035",
    };
    document.body.style.backgroundColor = themeBgColors[themeName] || "#0a0e17";

    refs.liveCard.classList.remove("animate-pop");
    void refs.liveCard.offsetWidth;
    refs.liveCard.classList.add("animate-pop");
}
