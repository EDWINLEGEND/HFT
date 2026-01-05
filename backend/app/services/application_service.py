
import json
import os
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.schemas import ApplicationSubmission, SavedApplication

class ApplicationService:
    """
    Service for managing industrial application persistence.
    Uses a simple file-based JSON storage for Phase 4 MVP.
    """
    
    def __init__(self, data_file: str = "./data/applications.json"):
        self.data_file = data_file
        self._ensure_data_file()
        
    def _ensure_data_file(self):
        """Ensure the data file exists."""
        if not os.path.exists(os.path.dirname(self.data_file)):
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            
        if not os.path.exists(self.data_file):
            with open(self.data_file, 'w') as f:
                json.dump([], f)
                
    def _load_applications(self) -> List[Dict]:
        """Load all applications from file."""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
            
    def _save_applications(self, apps: List[Dict]):
        """Save all applications to file."""
        with open(self.data_file, 'w') as f:
            json.dump(apps, f, indent=2, default=str)
            
    def submit_application(self, submission: ApplicationSubmission, time_saved: float = 0.0) -> SavedApplication:
        """
        Save a new application submission.
        """
        apps = self._load_applications()
        
        # Create new saved application record
        new_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        
        saved_app = SavedApplication(
            id=new_id,
            submitted_at=timestamp,
            status="submitted",
            time_saved_seconds=time_saved,
            **submission.dict()
        )
        
        # Convert to dict for storage (handle datetime)
        app_dict = saved_app.dict()
        app_dict['submitted_at'] = timestamp.isoformat()
        app_dict['compliance_report']['generated_at'] = submission.compliance_report.generated_at.isoformat()
        
        apps.append(app_dict)
        self._save_applications(apps)
        
        return saved_app
        
    def get_all_applications(self) -> List[SavedApplication]:
        """
        Get all submitted applications.
        """
        apps = self._load_applications()
        return [SavedApplication(**app) for app in apps]
        
    def get_application_by_id(self, app_id: str) -> Optional[SavedApplication]:
        """
        Get a specific application by ID.
        """
        apps = self._load_applications()
        for app in apps:
            if app['id'] == app_id:
                return SavedApplication(**app)
        return None

    def review_application(self, app_id: str, review_data: Dict[str, Any]) -> Optional[SavedApplication]:
        """
        Update application with officer review.
        """
        apps = self._load_applications()
        for i, app in enumerate(apps):
            if app['id'] == app_id:
                # Update fields
                app['status'] = 'approved' if review_data['action'] == 'approve' else 'rejected' if review_data['action'] == 'reject' else 'under_review'
                app['officer_action'] = review_data['action']
                app['officer_notes'] = review_data.get('notes')
                app['rejection_reason'] = review_data.get('rejection_reason')
                
                # Save
                apps[i] = app
                self._save_applications(apps)
                return SavedApplication(**app)
        return None
    
    def update_overrides(self, app_id: str, overrides: Dict[str, Any]) -> Optional[SavedApplication]:
        """
        Update issue override decisions for an application.
        """
        apps = self._load_applications()
        for i, app in enumerate(apps):
            if app['id'] == app_id:
                app['issue_overrides'] = overrides
                apps[i] = app
                self._save_applications(apps)
                return SavedApplication(**app)
        return None
    
    def delete_application(self, app_id: str) -> bool:
        """
        Delete an application by ID.
        Returns True if deleted, False if not found.
        """
        apps = self._load_applications()
        initial_count = len(apps)
        apps = [app for app in apps if app['id'] != app_id]
        
        if len(apps) < initial_count:
            self._save_applications(apps)
            return True
        return False
