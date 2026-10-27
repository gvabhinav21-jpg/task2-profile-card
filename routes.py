from flask import Blueprint, jsonify, render_template

from config import DB_PATH
from shared.api import json_error, json_payload, row_to_dict
from shared.database import execute, fetch_all, fetch_one

bp = Blueprint("profiles", __name__)

PROFILE_COLUMNS = (
    "id",
    "name",
    "job_title",
    "bio",
    "avatar_url",
    "skills",
    "theme",
    "github",
    "linkedin",
    "twitter",
    "portfolio",
    "created_at",
)


def serialize_profile(row):
    data = row_to_dict(row)
    return {column: data[column] for column in PROFILE_COLUMNS}


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route("/api/profiles", methods=["GET"])
def get_profiles():
    try:
        profiles = fetch_all(DB_PATH, "SELECT * FROM profiles ORDER BY id DESC")
        return jsonify([serialize_profile(profile) for profile in profiles])
    except Exception as exc:
        return json_error(str(exc), 500)


@bp.route("/api/profile", methods=["POST"])
def create_profile():
    try:
        data = json_payload()
        name = data.get("name", "").strip()
        job_title = data.get("job_title", "").strip()
        bio = data.get("bio", "").strip()
        avatar_url = data.get("avatar_url", "").strip()
        skills = data.get("skills", "").strip()
        theme = data.get("theme", "glass").strip()
        github = data.get("github", "").strip()
        linkedin = data.get("linkedin", "").strip()
        twitter = data.get("twitter", "").strip()
        portfolio = data.get("portfolio", "").strip()

        if not name:
            return json_error("Name is required")
        if not job_title:
            return json_error("Job Title is required")

        profile_id = execute(
            DB_PATH,
            """
            INSERT INTO profiles (name, job_title, bio, avatar_url, skills, theme, github, linkedin, twitter, portfolio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (name, job_title, bio, avatar_url, skills, theme, github, linkedin, twitter, portfolio),
            return_id=True,
        )
        profile = fetch_one(DB_PATH, "SELECT * FROM profiles WHERE id = ?", (profile_id,))
        return jsonify(serialize_profile(profile)), 201
    except Exception as exc:
        return json_error(str(exc), 500)
