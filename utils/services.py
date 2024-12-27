import requests
import json
from utils.url import imageUrl

def get_products_sauce():
  url = f"{imageUrl}/products?type=sauce"
  try: 
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data
  except requests.RequestException as e:
    print(f"Request erro: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def get_products_merch():
  url = f"{imageUrl}/products?type=merchandising"
  try: 
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data
  except requests.RequestException as e:
    print(f"Request erro: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def get_product_by_id(id):
  url = f"{imageUrl}/products/{id}"
  try:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def get_json_products(): 
  with open('products.json') as f: 
    return json.load(f)
  
