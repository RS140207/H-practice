import os
import sys

print(f"CWD: {os.getcwd()}")
files = os.listdir('.')
print(f"Files: {files}")

if '.env' in files:
    print(".env exists.")
    try:
        with open('.env', 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"Content length: {len(content)}")
        print("First 15 chars:", repr(content[:15]))
        if "GEMINI_API_KEY" in content:
            print("GEMINI_API_KEY found in text")
        else:
            print("GEMINI_API_KEY NOT found in text")
    except Exception as e:
        print(f"Error reading .env: {e}")
else:
    print(".env does not exist")
