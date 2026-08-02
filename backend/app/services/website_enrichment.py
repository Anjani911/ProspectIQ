from app.services.website_analyzer import analyze_website
from app.services.web_scoring import calculate_website_score


def enrich_business(business):
    """
    Analyze a business website and update the business object.
    """

    if not business.website_url:
        return business

    analysis = analyze_website(business.website_url)

    if "error" in analysis:
        return business

    business.has_website = True
    business.website_score = calculate_website_score(analysis)
    business.is_outdated = business.website_score < 50

    return business
