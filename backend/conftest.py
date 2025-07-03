import os
import shutil
from datetime import datetime

# def pytest_sessionstart(session):
#     """Clean 'coverage_reports/latest' and remove 'htmlcov' before test run."""
#     # Remove 'htmlcov' if it exists
#     htmlcov_dir = "htmlcov"
#     if os.path.exists(htmlcov_dir):
#         shutil.rmtree(htmlcov_dir)
#         print(f"💥 Removed leftover '{htmlcov_dir}' before test run.")
#
#     # Clean 'latest'
#     latest_dir = os.path.join("coverage_reports", "latest")
#     if os.path.exists(latest_dir):
#         shutil.rmtree(latest_dir)
#     os.makedirs(latest_dir, exist_ok=True)
#     print(f"✅ Cleaned 'coverage_reports/latest' before test run.")

def pytest_sessionfinish(session, exitstatus):
    """After tests finish, archive the latest coverage index with timestamp."""
    latest_dir = os.path.join("coverage_reports", "latest")
    history_dir = os.path.join("coverage_reports", "history")
    os.makedirs(history_dir, exist_ok=True)

    index_file = os.path.join(latest_dir, "index.html")
    if os.path.exists(index_file):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archived_index = f"index_{timestamp}.html"
        archived_index_path = os.path.join(history_dir, archived_index)

        shutil.copy2(index_file, archived_index_path)
        print(f"✅ Archived coverage index as '{archived_index_path}'.")

    # Remove 'htmlcov' if generated again by mistake
    htmlcov_dir = "htmlcov"
    if os.path.exists(htmlcov_dir):
        shutil.rmtree(htmlcov_dir)
        print(f"💥 Removed leftover '{htmlcov_dir}' after test run.")

    print(f"✅ Coverage run complete, 'latest' clean and history archived.")
