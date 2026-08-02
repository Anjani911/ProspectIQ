def calculate_website_score(analysis: dict) -> int:
    """
    Calculate a 0-100 website quality score
    based on the website analysis results.
    """

    score = 100

    if not analysis.get("has_https", False):
        score -= 20

    if not analysis.get("meta_description"):
        score -= 15

    if analysis.get("images_without_alt", 0) > 0:
        score -= 10

    if analysis.get("text_length", 0) < 300:
        score -= 15

    if not analysis.get("headings", {}).get("h1"):
        score -= 10

    return max(score, 0)