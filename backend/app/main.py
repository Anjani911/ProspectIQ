from fastapi import FastAPI

app = FastAPI(
    title="ProspectIQ",
    description="AI-powered business opportunity intelligence platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to ProspectIQ",
        "status": "API is running"
    }