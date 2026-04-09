import os
import shutil

root = r"c:\Users\Princy Singh\OneDrive\Documents\GitHub\khfoods"

paths_to_delete = [
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
    os.path.join(root, "src", "payload.config.ts"),
    os.path.join(root, "src", "payload-types.ts"),
]

for path in paths_to_delete:
    try:
        if os.path.isdir(path):
            shutil.rmtree(path)
            print(f"Deleted directory: {path}")
        elif os.path.isfile(path):
            os.remove(path)
            print(f"Deleted file: {path}")
    except Exception as e:
        print(f"Error deleting {path}: {e}")
