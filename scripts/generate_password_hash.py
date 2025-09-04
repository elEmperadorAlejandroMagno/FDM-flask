from werkzeug.security import generate_password_hash

def get_password_hash(password: str) -> str:
    """Return the hashed password."""
    return generate_password_hash(password)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python generate_password_hash.py <password>")
        sys.exit(1)
    password = sys.argv[1]
    print(get_password_hash(password))