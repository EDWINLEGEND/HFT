"""
CivicAssist - Main Streamlit Application
Main entry point for the Streamlit frontend.

Features:
- Page configuration and styling
- Sidebar navigation menu (Home, Applicant Mode, Officer Mode)
- Layout placeholders (no API calls yet)

Reference: Inspired by OLD/ui/app.py structure but simplified for Phase 1
"""

import streamlit as st

# Page configuration
st.set_page_config(
    page_title="CivicAssist - AI Compliance Assistant",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for professional styling
st.markdown("""
    <style>
        .main-header {
            font-size: 3em;
            font-weight: bold;
            color: #1E88E5;
            text-align: center;
            margin-bottom: 0.2em;
        }
        .sub-header {
            font-size: 1.5em;
            color: #555555;
            text-align: center;
            margin-bottom: 1em;
        }
        .info-box {
            background-color: #f0f8ff;
            border-left: 5px solid #1E88E5;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .feature-card {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
""", unsafe_allow_html=True)

# Sidebar Navigation
with st.sidebar:
    st.image("https://via.placeholder.com/250x150.png?text=CivicAssist", use_container_width=True)
    st.title("🏛️ CivicAssist")
    st.markdown("---")
    
    st.markdown("### Navigation")
    st.page_link("app.py", label="🏠 Home", icon="🏠")
    st.page_link("pages/2_📝_Applicant_Mode.py", label="📝 Applicant Mode", icon="📝")
    st.page_link("pages/3_⚖️_Officer_Mode.py", label="⚖️ Officer Mode", icon="⚖️")
    
    st.markdown("---")
    st.markdown("### About")
    st.info("**CivicAssist** is an AI-powered compliance assistant for industrial approval applications.")
    
    st.markdown("---")
    st.markdown("#### Phase 1: Foundation")
    st.caption("✅ Clean architecture established")
    st.caption("⏳ AI integration coming in Phase 2")

# Main Content
st.markdown("<div class='main-header'>⚖️ CivicAssist</div>", unsafe_allow_html=True)
st.markdown("<div class='sub-header'>AI-Assisted Industrial Compliance Verification</div>", unsafe_allow_html=True)

# Hero Image
st.image("https://source.unsplash.com/1200x400/?government,technology", use_container_width=True)

# Introduction
st.markdown("## Welcome to CivicAssist")
st.markdown("""
**CivicAssist** is a human-in-the-loop compliance assistant that helps government officers 
and applicants streamline the industrial approval process. Our system analyzes applications 
against relevant regulations, flags potential issues, and provides structured, explainable insights.
""")

# Key Features
st.markdown("## 🎯 Key Features")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
        <div class='feature-card'>
            <h3>📄 Document Analysis</h3>
            <p>Upload and analyze industrial application documents against government regulations.</p>
        </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
        <div class='feature-card'>
            <h3>🔍 Compliance Check</h3>
            <p>Automated compliance verification with explainable AI-powered insights.</p>
        </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
        <div class='feature-card'>
            <h3>✅ Actionable Reports</h3>
            <p>Generate structured reports with checklists and recommendations.</p>
        </div>
    """, unsafe_allow_html=True)

# User Modes
st.markdown("## 👥 Choose Your Mode")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📝 Applicant Mode")
    st.write("""
    **For Industries & Businesses**
    
    - Run pre-submission compliance checks
    - Get instant feedback on missing documents
    - Receive actionable checklists
    - Reduce resubmission cycles
    """)
    if st.button("Go to Applicant Mode", use_container_width=True):
        st.switch_page("pages/2_📝_Applicant_Mode.py")

with col2:
    st.markdown("### ⚖️ Officer Mode")
    st.write("""
    **For Government Officials**
    
    - Review submitted applications efficiently
    - View AI-generated compliance insights
    - Make informed decisions with explainable reports
    - Save time on manual verification
    """)
    if st.button("Go to Officer Mode", use_container_width=True):
        st.switch_page("pages/3_⚖️_Officer_Mode.py")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #888;'>
    <p><strong>Phase 1: Foundation Setup</strong></p>
    <p>This is a placeholder interface. Full functionality will be available in Phase 2.</p>
    <p>Backend API: <a href='http://localhost:8000/docs' target='_blank'>http://localhost:8000/docs</a></p>
</div>
""", unsafe_allow_html=True)
