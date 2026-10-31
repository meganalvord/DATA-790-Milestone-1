
from pathlib import Path
import shutil

# The repository's main directory
repo_dir = Path(__file__).resolve().parent

# Original Milestone 1 files and their Milestone 2 destinations
file_groups = {
    "original_pdfs": [f"rag_sp{i}.pdf" for i in range(1, 8)],
    "original_websites": [
        "sp_wb3.htm", "sp_wb4.htm", "sp_wb5.htm",
        "sp_wp1.htm", "sp_wp2.htm"
    ],
}

# Copy PDFs and HTML files
for folder, filenames in file_groups.items():
    destination = repo_dir / "corpus" / "original_files" / folder
    destination.mkdir(parents=True, exist_ok=True)

    for filename in filenames:
        shutil.copy2(repo_dir / filename, destination / filename)

# Copy CSV files
csv_destination = repo_dir / "corpus" / "original_files"
csv_destination.mkdir(parents=True, exist_ok=True)

for filename in ["sp_table2.csv", "sp_table3.csv"]:
    shutil.copy2(repo_dir / filename, csv_destination / filename)

print("Original Milestone 1 corpus files copied successfully.")
