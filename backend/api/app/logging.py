
import logging
from logging.handlers import RotatingFileHandler
from pythonjsonlogger import json

def setup_loggers():
    root = logging.getLogger()
    # prevent duplicate setup on reload
    if root.handlers:
        return

    root.setLevel(logging.INFO)

    file_handler = RotatingFileHandler(
        "/app/logs/access.log",
        maxBytes=20_000_000,   # 20 MB
        backupCount=5 # max nb of files for rotation
    )

    file_handler.setFormatter(
      json.JsonFormatter(
          "%(asctime)s %(name)s %(levelname)s %(message)s"
      )
    )

    ### logs via "docker compose logs -f"
    console = logging.StreamHandler()
    console.setFormatter(
      logging.Formatter(
        "%(asctime)s | %(name)s | %(levelname)s | %(message)s"
      )
    )

    root.addHandler(file_handler)
    root.addHandler(console)

    # include logs from uvicorn/fastapi components
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        logger = logging.getLogger(name)
        logger.handlers.clear()
        logger.propagate = True

