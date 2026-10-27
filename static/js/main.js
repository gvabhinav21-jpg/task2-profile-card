import { saveProfile } from "./api.js";
import { refs } from "./dom.js";
import { fetchHistory } from "./history.js";
import {
    updateCardAvatar,
    updateCardBio,
    updateCardName,
    updateCardSkills,
    updateCardTheme,
    updateCardTitle,
    updateSocialLink,
} from "./preview.js";

const DEFAULT_BIO =
    "Your story will appear here. Start typing in the form to see your card update live in real-time!";

document.addEventListener("DOMContentLoaded", () => {
    refs.inputName.addEventListener("input", updateCardName);
    refs.inputTitle.addEventListener("input", updateCardTitle);
    refs.inputBio.addEventListener("input", updateCardBio);
    refs.inputAvatar.addEventListener("input", updateCardAvatar);
    refs.inputSkills.addEventListener("input", updateCardSkills);

    refs.inputGithub.addEventListener("input", () => updateSocialLink(refs.inputGithub, refs.linkGithub));
    refs.inputLinkedin.addEventListener("input", () =>
        updateSocialLink(refs.inputLinkedin, refs.linkLinkedin)
    );
    refs.inputTwitter.addEventListener("input", () =>
        updateSocialLink(refs.inputTwitter, refs.linkTwitter)
    );
    refs.inputPortfolio.addEventListener("input", () =>
        updateSocialLink(refs.inputPortfolio, refs.linkPortfolio)
    );

    refs.themeRadios.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            updateCardTheme(event.target.value);
        });
    });

    refs.downloadBtn.addEventListener("click", () => {
        const name = refs.inputName.value.trim() || "profile";

        refs.downloadBtn.disabled = true;
        refs.downloadBtn.innerHTML =
            '<i class="fa-solid fa-circle-notch fa-spin"></i> Rendering image...';

        html2canvas(refs.liveCard, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2,
        })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = `${name.replace(/\s+/g, "_")}_identity_card.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            })
            .catch((error) => {
                console.error("Image export failed:", error);
                alert("Failed to export card image. Please try again.");
            })
            .finally(() => {
                refs.downloadBtn.disabled = false;
                refs.downloadBtn.innerHTML =
                    '<i class="fa-solid fa-download"></i> Export Card as PNG';
            });
    });

    refs.profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let theme = "glass";
        refs.themeRadios.forEach((radio) => {
            if (radio.checked) theme = radio.value;
        });

        refs.submitBtn.disabled = true;
        refs.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        try {
            await saveProfile({
                name: refs.inputName.value.trim(),
                job_title: refs.inputTitle.value.trim(),
                bio: refs.inputBio.value.trim(),
                avatar_url: refs.inputAvatar.value.trim(),
                skills: refs.inputSkills.value.trim(),
                theme,
                github: refs.inputGithub.value.trim(),
                linkedin: refs.inputLinkedin.value.trim(),
                twitter: refs.inputTwitter.value.trim(),
                portfolio: refs.inputPortfolio.value.trim(),
            });

            fetchHistory();
            refs.profileForm.reset();
            refs.themeRadios[0].checked = true;

            refs.cardName.textContent = "Your Name";
            refs.cardTitle.textContent = "Professional Title";
            refs.cardBio.textContent = DEFAULT_BIO;
            refs.cardAvatar.classList.add("hidden");
            refs.cardAvatarFallback.classList.remove("hidden");
            refs.cardAvatarFallback.textContent = "RS";

            [refs.linkGithub, refs.linkLinkedin, refs.linkTwitter, refs.linkPortfolio].forEach((link) =>
                link.classList.add("hidden")
            );

            updateCardSkills();
            updateCardTheme("glass");

            alert("Identity profile card saved to studio history!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error saving profile. Please try again.");
        } finally {
            refs.submitBtn.disabled = false;
            refs.submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Profile';
        }
    });

    updateCardSkills();
    fetchHistory();
});
