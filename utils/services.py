import requests
import os

URL = os.getenv('API_URL')

def get_products():
    url = f"{URL}/products"
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
  url = f"{URL}/products?type=sauce"
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
    url = f"{URL}/products?type=merch"
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

def get_product_by_id(id):
  url = f"{URL}/products/{id}"
  try:
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    return data[0]
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def post_product(product):
  url = f"{URL}/products"
  try:
    response = requests.post(url, json=product)
    response.raise_for_status()
    data = response.json()
    return True
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None

def delete_product(id):
  url = f"{URL}/products/{id}"
  try:
    response = requests.delete(url)
    response.raise_for_status()
    return True
  except requests.RequestException as e:
    print(f"Request error: {e}")
    return False

def update_product(id, product):
  url = f"{URL}/products/{id}"
  try:
    response = requests.put(url, json=product)
    response.raise_for_status()
    data = response.json()
    if data.get('updatedProduct') == False:
      return False
    return data.get('updatedProduct')
  except requests.RequestException as e:
    print(f"Request error: {e}")
  except (KeyError, ValueError) as e:
    print(f"Data error: {e}")
  return None
  