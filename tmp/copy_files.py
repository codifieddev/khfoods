import shutil
import os

def copy_dir(src, dst):
    if os.path.exists(src):
        if not os.path.exists(dst):
            os.makedirs(dst)
        for item in os.listdir(src):
            s = os.path.join(src, item)
            d = os.path.join(dst, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Source {src} does not exist")

base = r"c:\Users\Princy Singh\Downloads\allied-surplus"
ref = os.path.join(base, "reference")

copy_dir(os.path.join(ref, "src"), os.path.join(base, "src"))
copy_dir(os.path.join(ref, "app", "_components"), os.path.join(base, "app", "_components"))
copy_dir(os.path.join(ref, "public"), os.path.join(base, "public"))
copy_dir(os.path.join(ref, "redux"), os.path.join(base, "redux"))
shutil.copy2(os.path.join(ref, "data", "products.ts"), os.path.join(base, "data", "products.ts"))
print("Done")
