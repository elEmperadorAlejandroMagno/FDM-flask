from werkzeug.security import generate_password_hash
from cs50 import get_string


password = get_string("introduce password: ")
password = generate_password_hash('password')
print(password)
password_hash = "32768:8:1$xoip6J2ClXx6jSc0$302e0f54531309f591e688de7b0e5da9fa0056e56f3a7c97b1781d011e8ff40e3763c293f466d17fde3f581377be0bee002f44e2094a2d1f404b80d354b9ef15"