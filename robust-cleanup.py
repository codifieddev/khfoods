import os
import shutil
import time

root = r"c:\Users\Princy Singh\OneDrive\Documents\GitHub\khfoods"

folders = [
    r"src\access",
    r"src\collections",
    r"src\fields",
    r"src\blocks",
    r"src\EditorComp",
    r"src\endpoints",
    r"src\plugins",
    r"src\app\next",
    r"src\app\_admin_unused",
    r"src\app\(frontend)\next",
]

files = [
    r"src\payload.config.ts",
    r"src\payload-types.ts",
]

for folder in folders:
    path = os.path.join(root, folder)
    if os.path.exists(path):
        print(f"Trying to delete {path}...")
        for _ in range(3): # retry
            try:
                shutil.rmtree(path)
                print(f"DEL-SUCCESS: {path}")
                break
            except Exception as e:
                print(f"DEL-ERROR: {path} - {e}")
                time.sleep(1)

for file in files:
    path = os.path.join(root, file)
    if os.path.exists(path):
        try:
            os.remove(path)
            print(f"DEL-FILE: {path}")
        except Exception as e:
            print(f"DEL-FILE-ERROR: {path} - {e}")
