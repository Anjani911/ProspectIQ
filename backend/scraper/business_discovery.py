import time
import requests


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

CATEGORY_TAGS = {
    "boutique": ("shop", "clothes"),
    "clothing": ("shop", "clothes"),
    "fashion": ("shop", "clothes"),
    "salon": ("shop", "hairdresser"),
    "beauty": ("shop", "beauty"),
    "restaurant": ("amenity", "restaurant"),
    "cafe": ("amenity", "cafe"),
    "bakery": ("shop", "bakery"),
    "jewelry": ("shop", "jewelry"),
    "pharmacy": ("amenity", "pharmacy"),
    "supermarket": ("shop", "supermarket"),
    "furniture": ("shop", "furniture"),
    "electronics": ("shop", "electronics"),
    "gym": ("leisure", "fitness_centre"),
    "hotel": ("tourism", "hotel"),
}


def geocode_location(location: str):
    response = requests.get(
        NOMINATIM_URL,
        params={
            "q": location,
            "format": "json",
            "limit": 1,
        },
        headers={
            "User-Agent": "ProspectIQ/0.1"
        },
        timeout=20,
    )

    response.raise_for_status()

    results = response.json()

    if not results:
        raise ValueError(
            f"Location not found: {location}"
        )

    time.sleep(1)

    return (
        float(results[0]["lat"]),
        float(results[0]["lon"]),
    )


def discover_businesses(
    category: str,
    location: str,
    radius_meters: int = 5000,
    max_results: int = 20,
):
    category = category.strip().lower()

    if category not in CATEGORY_TAGS:
        raise ValueError(
            f"Unsupported category: {category}"
        )

    tag_key, tag_value = CATEGORY_TAGS[category]

    latitude, longitude = geocode_location(location)

    query = f"""
    [out:json][timeout:30];

    nwr
      ["{tag_key}"="{tag_value}"]
      (around:{radius_meters},{latitude},{longitude});

    out center tags;
    """

    response = requests.post(
        OVERPASS_URL,
        data=query,
        headers={
            "User-Agent": "ProspectIQ/0.1"
        },
        timeout=60,
    )

    response.raise_for_status()

    data = response.json()

    businesses = []
    seen = set()

    for element in data.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name")

        if not name:
            continue

        external_id = (
            f"{element['type']}/{element['id']}"
        )

        if external_id in seen:
            continue

        seen.add(external_id)

        center = element.get("center", {})

        latitude_value = element.get(
            "lat",
            center.get("lat"),
        )

        longitude_value = element.get(
            "lon",
            center.get("lon"),
        )

        address_parts = [
            tags.get("addr:housenumber"),
            tags.get("addr:street"),
            tags.get("addr:city"),
            tags.get("addr:state"),
            tags.get("addr:postcode"),
        ]

        address = ", ".join(
            part for part in address_parts if part
        )

        website = (
            tags.get("website")
            or tags.get("contact:website")
        )

        phone = (
            tags.get("phone")
            or tags.get("contact:phone")
        )

        email = (
            tags.get("email")
            or tags.get("contact:email")
        )

        businesses.append({
            "external_id": external_id,
            "name": name,
            "category": category,
            "location": address or location,
            "website_url": website,
            "phone": phone,
            "email": email,
            "latitude": latitude_value,
            "longitude": longitude_value,
            "source": "openstreetmap",
        })

        if len(businesses) >= max_results:
            break

    return businesses


if __name__ == "__main__":
    results = discover_businesses(
        category="boutique",
        location="Raipur, Chhattisgarh",
        max_results=10,
    )

    print(f"Found {len(results)} businesses.")

    for business in results:
        print(business)