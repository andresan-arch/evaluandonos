def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple brace counter
    stack = []
    lines = content.split('\n')
    for i, line in enumerate(lines):
        for char in line:
            if char == '{':
                stack.append(('{', i + 1))
            elif char == '}':
                if not stack:
                    print(f"Extra closing brace at line {i + 1}")
                    return
                stack.pop()
    
    if stack:
        for char, line in stack:
            print(f"Unclosed brace at line {line}")
    else:
        print("Braces are balanced")

if __name__ == "__main__":
    import sys
    check_braces(r'g:\Otros ordenadores\Asus\Desktop\Evaluandonos\index.html')
