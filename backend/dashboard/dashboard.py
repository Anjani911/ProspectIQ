import pandas as pd
import streamlit as st
import plotly.express as px

business = pd.read_csv("businesses.csv")
opportunity = pd.read_csv("opportunities.csv")

st.set_page_config(
    page_title="ProspectIQ Dashboard",
    layout="wide"
)

st.title("ProspectIQ Analytics Dashboard")

c1,c2,c3,c4 = st.columns(4)

c1.metric(
    "Businesses",
    len(business)
)

c2.metric(
    "Websites",
    business["has_website"].sum()
)

c3.metric(
    "Website %",
    round(
        business["has_website"].mean()*100,
        1
    )
)

c4.metric(
    "Opportunities",
    len(opportunity)
)

st.divider()

fig = px.pie(
    business,
    names="category",
    title="Business Categories"
)

st.plotly_chart(fig,use_container_width=True)

fig2 = px.histogram(
    business,
    x="website_score",
    title="Website Score Distribution"
)

st.plotly_chart(fig2,use_container_width=True)

fig3 = px.bar(
    opportunity,
    x="priority",
    title="Opportunity Priority"
)

st.plotly_chart(fig3,use_container_width=True)

fig4 = px.bar(
    opportunity,
    x="status",
    title="Opportunity Status"
)

st.plotly_chart(fig4,use_container_width=True)

st.dataframe(business)