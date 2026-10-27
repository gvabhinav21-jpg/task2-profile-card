async function request(url, options, errorMessage) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(errorMessage);
    }
    return response.json();
}

export function fetchProfiles() {
    return request("/api/profiles", {}, "Failed to fetch history");
}

export function saveProfile(profile) {
    return request(
        "/api/profile",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
        },
        "Failed to save profile"
    );
}
