"""
PDF Report Generation Service
Generates audit-friendly PDF reports for application reviews
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime
from typing import Optional

from app.models.schemas import SavedApplication


class ReportService:
    """Service for generating PDF reports."""
    
    def generate_application_report(self, app: SavedApplication) -> BytesIO:
        """
        Generate a comprehensive PDF report for an application.
        
        Args:
            app: SavedApplication object
            
        Returns:
            BytesIO buffer containing the PDF
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=6,
            spaceBefore=12
        )
        
        # Title
        story.append(Paragraph("Application Review Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Metadata Section
        story.append(Paragraph("Application Information", heading_style))
        metadata = [
            ['Application ID:', app.id],
            ['Industry Name:', app.application_data.industry_name],
            ['Submitted:', datetime.fromisoformat(app.submitted_at.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')],
            ['Status:', app.status.upper()],
            ['Square Feet:', app.application_data.square_feet],
        ]
        
        metadata_table = Table(metadata, colWidths=[2*inch, 4*inch])
        metadata_table.setStyle(TableStyle([
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#374151')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(metadata_table)
        story.append(Spacer(1, 0.2*inch))
        
        # AI Analysis Section
        story.append(Paragraph("AI Compliance Analysis", heading_style))
        story.append(Paragraph(
            f"<b>Overall Status:</b> {app.compliance_report.status.replace('_', ' ').upper()}",
            styles['Normal']
        ))
        story.append(Paragraph(
            f"<b>AI Confidence:</b> {app.compliance_report.confidence_score*100:.0f}%",
            styles['Normal']
        ))
        story.append(Paragraph(
            f"<b>Time Saved:</b> {int(app.time_saved_seconds / 60)} minutes",
            styles['Normal']
        ))
        story.append(Spacer(1, 0.1*inch))
        
        # Issues Section
        if app.compliance_report.issues:
            story.append(Paragraph("Compliance Issues", heading_style))
            
            issue_data = [['#', 'Severity', 'Type', 'Description', 'Officer Decision']]
            
            for idx, issue in enumerate(app.compliance_report.issues):
                # Get override decision
                override = None
                if app.issue_overrides:
                    override = app.issue_overrides.get(str(idx))
                
                if override:
                    if override.get('accepted'):
                        decision = "✓ Accepted"
                    else:
                        reason = override.get('reason', 'No reason provided')
                        decision = f"✗ Overridden: {reason[:30]}..."
                else:
                    decision = "- Pending"
                
                # Truncate description for table
                desc = issue.description
                if len(desc) > 60:
                    desc = desc[:60] + '...'
                
                issue_data.append([
                    str(idx+1),
                    issue.severity.upper(),
                    issue.issue_type.replace('_', ' ').title(),
                    desc,
                    decision
                ])
            
            issue_table = Table(issue_data, colWidths=[0.4*inch, 0.8*inch, 1.2*inch, 2.8*inch, 1.8*inch])
            issue_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,0), 9),
                ('FONTSIZE', (0,1), (-1,-1), 8),
                ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f3f4f6')])
            ]))
            story.append(issue_table)
            story.append(Spacer(1, 0.2*inch))
        
        # Missing Documents
        if app.compliance_report.missing_documents:
            story.append(Paragraph("Missing Documents", heading_style))
            for doc in app.compliance_report.missing_documents:
                story.append(Paragraph(f"• {doc}", styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Officer Notes
        if app.officer_notes:
            story.append(Paragraph("Officer Notes", heading_style))
            story.append(Paragraph(app.officer_notes, styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Final Decision
        if app.officer_action:
            story.append(Paragraph("Final Decision", heading_style))
            story.append(Paragraph(
                f"<b>Action:</b> {app.officer_action.upper()}",
                styles['Normal']
            ))
            if app.rejection_reason:
                story.append(Paragraph(
                    f"<b>Reason:</b> {app.rejection_reason}",
                    styles['Normal']
                ))
        
        # Footer
        story.append(Spacer(1, 0.3*inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        story.append(Paragraph(
            f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC",
            footer_style
        ))
        story.append(Paragraph("CivicAssist - AI-Assisted Industrial Compliance", footer_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer


def get_report_service():
    """Get report service instance."""
    return ReportService()
