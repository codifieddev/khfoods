import os
import shutil
import time

root = r"c:\Users\Princy Singh\OneDrive\Documents\GitHub\khfoods"

# Folders to delete (source + modules)
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
    r"node_modules",
    r".next",
]

# Files to delete
files = [
    r"src\payload.config.ts",
    r"src\payload-types.ts",
    r"pnpm-lock.yaml",
]

def force_delete(path):
    if not os.path.exists(path): return
    print(f"Deleting {path}...")
    for i in range(5):
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            print(f"Successfully deleted {path}")
            return
        except Exception as e:
            print(f"Attempt {i+1} failed for {path}: {e}")
            time.sleep(2)

for f in folders: force_delete(os.path.join(root, f))
for f in files: force_delete(os.path.join(root, f))
