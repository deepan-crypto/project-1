#!/usr/bin/env python3
import re
import sys

def resolve_conflicts(filepath):
    """Resolve Git merge conflicts by keeping changes from master branch."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match Git conflict markers
        # We want to keep everything between ======= and >>>>>>> master
        # and remove everything between <<<<<<< HEAD and =======
        pattern = r'<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> master\n'
        
        # Replace conflicts with master branch content (group 2)
        resolved_content = re.sub(pattern, r'\2', content, flags=re.DOTALL)
        
        # Write back the resolved content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(resolved_content)
        
        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    files = [
        "./controllers/authController.js",
        "./controllers/pollController.js",
        "./controllers/userController.js",
        "./models/User.js",
        "./routes/auth.js",
        "./routes/polls.js",
        "./utils/emailService.js",
        "./server.js"
    ]
    
    for filepath in files:
        if resolve_conflicts(filepath):
            print(f"✓ Resolved conflicts in {filepath}")
        else:
            print(f"✗ Failed to resolve {filepath}")
