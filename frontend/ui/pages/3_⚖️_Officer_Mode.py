"""
Officer Mode - Application Review
Officer-facing interface for reviewing applications.

Placeholder for:
- Application review workflow
- Compliance report display
- Decision support tools

NOTE: This is a PLACEHOLDER for Phase 1. Actual functionality will be added in Phase 2.
"""

import streamlit as st

st.set_page_config(
    page_title="Officer Mode - CivicAssist",
    page_icon="⚖️",
    layout="wide"
)

# Header
st.title("⚖️ Officer Mode")
st.subheader("Application Review & Decision Support")

st.markdown("---")

# Info Box
st.info("""
**Welcome, Officer!**

This mode provides AI-powered assistance for reviewing industrial approval applications.
The system analyzes submitted applications, flags issues, and provides explainable insights
to help you make informed decisions faster and more accurately.
""")

# Key Features
st.markdown("## 🎯 Key Features")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        label="⏱️ Time Saved",
        value="Not available",
        help="Estimated time saved using AI assistance (Phase 2)"
    )

with col2:
    st.metric(
        label="📊 Confidence Score",
        value="Not available",
        help="AI confidence in analysis (Phase 2)"
    )

with col3:
    st.metric(
        label="🔍 Regulation Coverage",
        value="Not available",
        help="Percentage of regulations reviewed (Phase 2)"
    )

with col4:
    st.metric(
        label="⚠️ Issues Found",
        value="Not available",
        help="Number of flagged issues (Phase 2)"
    )

st.markdown("---")

# Application Selection
st.markdown("## 📁 Select Application to Review")

# Placeholder application list
application_id = st.selectbox(
    "Choose an application:",
    ["No applications available (Phase 1)", "Sample: ABC Textile Mill - ID-2024-001", "Sample: XYZ Steel Factory - ID-2024-002"],
    index=0
)

if "Sample:" in application_id:
    st.success(f"✅ Loaded: **{application_id}**")
    
    # Application Details Section
    st.markdown("---")
    st.markdown("## 📋 Application Details")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Basic Information")
        st.write("**Industry Name:** ABC Textile Mill")
        st.write("**Application ID:** ID-2024-001")
        st.write("**Submission Date:** January 2, 2024")
        st.write("**Industry Type:** Textile Manufacturing")
        st.write("**Location:** Kochi, Kerala")
    
    with col2:
        st.markdown("### Application Metrics")
        st.write("**Square Footage:** 5,000 sq. ft.")
        st.write("**Number of Employees:** 50")
        st.write("**Water Source:** Municipal supply")
        st.write("**Distance to Homes:** 500 meters")
        st.write("**Power Consumption:** 100 kW")
    
    # AI Compliance Analysis
    st.markdown("---")
    st.markdown("## 🤖 AI-Generated Compliance Analysis")
    
    st.warning("""
    **Phase 1 Notice:** AI analysis is not yet implemented.
    
    In Phase 2, this section will display:
    - Overall compliance status
    - Detailed issue breakdown
    - Regulation references with traceability
    - Risk categorization (Low/Medium/High)
    - Department-specific tagging
    """)
    
    # Sample Report
    with st.expander("📊 View Sample Compliance Report"):
        tab1, tab2, tab3, tab4 = st.tabs(["Overview", "Issues", "Documents", "Recommendations"])
        
        with tab1:
            st.markdown("### Compliance Overview")
            st.markdown("**Status:** Partially Compliant")
            st.progress(0.65)
            st.caption("65% compliant with regulations")
            
            st.markdown("**Confidence Score:** 85%")
            st.markdown("**Regulation Coverage:** 92%")
            st.markdown("**Critical Issues:** 2")
            st.markdown("**Medium Issues:** 3")
            st.markdown("**Low Issues:** 1")
        
        with tab2:
            st.markdown("### Flagged Issues")
            
            st.error("""
            **🔴 High Risk - Distance to Residential Area**
            - **Issue:** Distance (500m) meets minimum but is at the threshold
            - **Regulation:** Kerala Industrial Policy 2023, Clause 4.2.1
            - **Department:** Local Body
            - **Action Required:** Request justification or increase buffer zone
            """)
            
            st.warning("""
            **🟡 Medium Risk - Incomplete Waste Management Plan**
            - **Issue:** Hazardous waste disposal procedures not detailed
            - **Regulation:** Hazardous Waste Rules 2016, Section 8
            - **Department:** Environment
            - **Action Required:** Request updated waste management plan
            """)
            
            st.info("""
            **🟢 Low Risk - Fire Safety Certificate Pending**
            - **Issue:** Fire safety NOC not yet submitted
            - **Regulation:** National Building Code, Fire Safety Chapter
            - **Department:** Fire Department
            - **Action Required:** Request fire safety NOC
            """)
        
        with tab3:
            st.markdown("### Document Checklist")
            
            st.markdown("#### ✅ Submitted Documents")
            st.markdown("- ✓ Application form")
            st.markdown("- ✓ Site plan blueprint")
            st.markdown("- ✓ Water source approval")
            st.markdown("- ✓ Employee details")
            
            st.markdown("#### ❌ Missing Documents")
            st.markdown("- ✗ Fire safety certificate")
            st.markdown("- ✗ Environmental clearance")
            st.markdown("- ✗ Updated waste management plan")
        
        with tab4:
            st.markdown("### Recommendations")
            
            st.markdown("**For Officer:**")
            st.markdown("1. Request missing fire safety certificate before proceeding")
            st.markdown("2. Ask applicant to update waste management plan with hazardous waste details")
            st.markdown("3. Consider site inspection for buffer zone verification")
            
            st.markdown("**For Applicant:**")
            st.markdown("1. Submit fire safety NOC from Fire Department")
            st.markdown("2. Provide detailed hazardous waste disposal procedures")
            st.markdown("3. Consider increasing distance to residential area if feasible")
    
    # Officer Actions
    st.markdown("---")
    st.markdown("## ✍️ Officer Actions")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📧 Request Missing Documents", type="primary", use_container_width=True):
            st.info("⏳ This action will be available in Phase 2")
    
    with col2:
        if st.button("✅ Approve Application", use_container_width=True):
            st.info("⏳ This action will be available in Phase 2")
    
    with col3:
        if st.button("❌ Reject Application", use_container_width=True):
            st.info("⏳ This action will be available in Phase 2")
    
    # Notes Section
    st.markdown("---")
    st.markdown("## 📝 Officer Notes")
    notes = st.text_area(
        "Add internal notes (not visible to applicant):",
        placeholder="Enter your observations and notes here...",
        height=100
    )
    
    if st.button("💾 Save Notes"):
        st.info("⏳ Note saving will be available in Phase 2")

else:
    st.info("👆 Please select an application to review.")
    st.warning("**Phase 1 Notice:** Application data integration is not yet implemented. Sample data shown above for demonstration purposes.")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #888;'>
    <p><strong>CivicAssist Officer Mode</strong> | Phase 1: UI Foundation</p>
    <p>Full AI-powered compliance analysis and decision support will be available in Phase 2.</p>
</div>
""", unsafe_allow_html=True)
