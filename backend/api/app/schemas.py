from pydantic import BaseModel
from typing import Any, Dict, Optional

class SubmissionIn(BaseModel):
  payload: Dict[str, Any]
  source: Optional[str] = "tauri"

class SubmissionOut(BaseModel):
  id: str
