"""
Home Page - CivicAssist
Landing page with project overview and feature highlights.
"""

import streamlit as st

st.set_page_config(
    page_title="Home - CivicAssist",
    page_icon="🏠",
    layout="wide"
)

# Redirect to main app
st.switch_page("app.py")
