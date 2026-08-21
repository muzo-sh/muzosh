"""
GET /api/repos?user=yourusername

Fetches a GitHub user's public, non-fork repos, ranks them by stars and
recency, and returns the top few as JSON for the portfolio's project grid.

This is a Vercel Python Serverless Function: Vercel runs `do_GET` whenever
a request hits /api/repos. No dependencies beyond the Python standard
library, so there's nothing to install.
"""

from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import urllib.error

# EDIT ME: your GitHub username, used if the request doesn't pass ?user=
DEFAULT_GITHUB_USERNAME = "muzo-sh"

REPOS_TO_SHOW = 6


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)
        username = params.get("user", [DEFAULT_GITHUB_USERNAME])[0]

        try:
            repos = fetch_top_repos(username, limit=REPOS_TO_SHOW)
            status = 200
            body = {"repos": repos}
        except urllib.error.HTTPError as e:
            status = 502
            body = {"error": f"GitHub API returned {e.code} for user '{username}'"}
        except Exception as e:
            status = 500
            body = {"error": str(e)}

        payload = json.dumps(body).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        # Cache at the edge for an hour; avoids hammering GitHub's rate limit.
        self.send_header("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400")
        self.end_headers()
        self.wfile.write(payload)

    # GitHub API requests need a User-Agent header or they get rejected.
    def log_message(self, format, *args):
        # Silence default request logging in the serverless environment.
        return


def fetch_top_repos(username: str, limit: int = 6):
    url = (
        f"https://api.github.com/users/{urllib.parse.quote(username)}/repos"
        "?sort=updated&per_page=50&type=owner"
    )
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "portfolio-site",
            "Accept": "application/vnd.github+json",
        },
    )

    with urllib.request.urlopen(request, timeout=8) as response:
        data = json.loads(response.read().decode("utf-8"))

    non_fork_repos = [repo for repo in data if not repo.get("fork") and not repo.get("archived")]

    # Rank by stars first, then most recently pushed.
    non_fork_repos.sort(
        key=lambda r: (r.get("stargazers_count", 0), r.get("pushed_at", "")),
        reverse=True,
    )

    return [
        {
            "name": repo["name"],
            "description": repo.get("description") or "No description yet.",
            "url": repo["html_url"],
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count", 0),
        }
        for repo in non_fork_repos[:limit]
    ]
