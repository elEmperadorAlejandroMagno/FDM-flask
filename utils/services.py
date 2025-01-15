import requests
import json
from utils.constants import URL


def get_products(filter):
  if filter == 'sauce':
    return get_products_sauce()
  elif filter == 'merchandising':
    return get_products_merch()
  else:
    url = f"{URL['API_URL']}/products"
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

def get_products_sauce():
  url = f"{URL['API_URL']}/products?type=sauce"
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
  url = f"{URL['API_URL']}/products?type=merchandising"
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
  url = f"{URL['API_URL']}/products/{id}"
  print(url)
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

def post_product(product):
  url = f"{URL['API_URL']}/products"
  try:
    response = requests.post(url, json=product)
    response.raise_for_status()
    data = response.json()
    return data
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def delete_product(id):
  url = f"{URL['API_URL']}/products/{id}"
  try:
    response = requests.delete(url)
    response.raise_for_status()
    return True
  except requests.RequestException as e:
    print(f"Request error: {e}")
  return False

def update_product(id, product):
  url = f"{URL['API_URL']}/products/{id}"
  try:
    response = requests.put(url, json=product)
    response.raise_for_status()
    data = response.json()
    return data
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None
  
