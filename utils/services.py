import requests

def get_products_sauce():
  url = "http://localhost:1234/products?type=sauce"
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
  url = "http://localhost:1234/products?type=merchandising"
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

