import os
import shutil

root = r"c:\Users\Princy Singh\OneDrive\Documents\GitHub\khfoods"

# Folders to delete
folders_to_delete = [
    os.path.join(root, "src", "access"),
    os.path.join(root, "src", "collections"),
    os.path.join(root, "src", "fields"),
    os.path.join(root, "src", "blocks"),
    os.path.join(root, "src", "EditorComp"),
    os.path.join(root, "src", "endpoints"),
    os.path.join(root, "src", "plugins"),
    os.path.join(root, "src", "app", "next"),
    os.path.join(root, "src", "app", "_admin_unused"),
    os.path.join(root, "src", "app", "(frontend)", "next"),
]

# Files to delete
files_to_delete = [
    os.path.join(root, "src", "payload.config.ts"),
    os.path.join(root, "src", "payload-types.ts"),
    os.path.join(root, "cleanup-payload.py"),
]

# Neutralize first (in case of locks)
for folder in folders_to_delete:
    if os.path.exists(folder):
        for dirpath, dirnames, filenames in os.walk(folder):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'w') as f: f.write("")
                except: pass

for folder in folders_to_delete:
    try:
        shutil.rmtree(folder, ignore_errors=True)
        print(f"Deleted folder: {folder}")
    except Exception as e:
        print(f"Error deleting folder {folder}: {e}")

for file in files_to_delete:
    try:
        if os.path.exists(file):
            os.remove(file)
            print(f"Deleted file: {file}")
    except Exception as e:
        print(f"Error deleting file {file}: {e}")
