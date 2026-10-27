import { fetchProfiles } from "./api.js";
import { refs } from "./dom.js";
import {
    getInitials,
    updateCardAvatar,
    updateCardBio,
    updateCardName,
    updateCardSkills,
    updateCardTheme,
    updateCardTitle,
    updateSocialLink,
} from "./preview.js";
import { escapeHTML } from "./utils.js";

export async function fetchHistory() {
    try {
        const profiles = await fetchProfiles();
        renderHistory(profiles);
    } catch (error) {
        console.error("Error fetching history:", error);
        refs.historyGrid.innerHTML = `
            <div class="loading-history">
                <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i>
                <p>Failed to load profile history.</p>
            </div>
        `;
    }
}

function renderHistory(profiles) {
    refs.historyGrid.innerHTML = "";

    if (profiles.length === 0) {
        refs.historyGrid.innerHTML = `
            <div class="loading-history">
                <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>No profile cards saved in this studio yet.</p>
            </div>
        `;
        return;
    }

    profiles.forEach((profile) => {
        const item = document.createElement("div");
        item.className = "history-card-item";

        let avatarHTML = "";
        if (
            profile.avatar_url &&
            (profile.avatar_url.startsWith("http://") || profile.avatar_url.startsWith("https://"))
        ) {
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

        item.addEventListener("click", () => {
            loadProfileIntoForm(profile);
        });

        refs.historyGrid.appendChild(item);
    });
}

function loadProfileIntoForm(profile) {
    refs.inputName.value = profile.name;
    refs.inputTitle.value = profile.job_title;
    refs.inputBio.value = profile.bio;
    refs.inputAvatar.value = profile.avatar_url;
    refs.inputSkills.value = profile.skills;

    refs.inputGithub.value = profile.github || "";
    refs.inputLinkedin.value = profile.linkedin || "";
    refs.inputTwitter.value = profile.twitter || "";
    refs.inputPortfolio.value = profile.portfolio || "";

    refs.themeRadios.forEach((radio) => {
        if (radio.value === profile.theme) radio.checked = true;
    });

    updateCardName();
    updateCardTitle();
    updateCardBio();
    updateCardAvatar();
    updateCardSkills();

    updateSocialLink(refs.inputGithub, refs.linkGithub);
    updateSocialLink(refs.inputLinkedin, refs.linkLinkedin);
    updateSocialLink(refs.inputTwitter, refs.linkTwitter);
    updateSocialLink(refs.inputPortfolio, refs.linkPortfolio);

    updateCardTheme(profile.theme);

    document.querySelector(".workspace").scrollIntoView({ behavior: "smooth" });
}
