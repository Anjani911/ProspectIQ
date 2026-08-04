import pandas as pd

from app.database.connection import engine

businesses = pd.read_sql(
    "SELECT * FROM businesses",
    engine
)

opportunities = pd.read_sql(
    "SELECT * FROM opportunities",
    engine
)

businesses.to_csv(
    "businesses.csv",
    index=False
)

opportunities.to_csv(
    "opportunities.csv",
    index=False
)

print("Export successful!")