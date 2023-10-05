import shutil
import os

def cleanup_function(id: str):
    try:
        parent_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        directory_path = os.path.join(parent_directory, "repo", id)
        print(directory_path)
        shutil.rmtree(directory_path)
    except OSError as e:
        print("deleting directory error", e)
