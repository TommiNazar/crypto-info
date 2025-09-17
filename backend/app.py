from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import time

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde tu frontend de React

# Configuración
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
CACHE_DURATION = 300  # Segundos para cachear los datos
cache = {"data": None, "timestamp": 0}

def get_crypto_data():
    """Obtiene datos de las criptomonedas con cache básico"""
    current_time = time.time()
    
    # Si tenemos datos en cache y no han expirado, los usamos
    if cache["data"] and (current_time - cache["timestamp"]) < CACHE_DURATION:
        return cache["data"]
    
    try:
        # Hacer petición a CoinGecko API
        response = requests.get(
            f"{COINGECKO_API_URL}/coins/markets",
            params={
                "vs_currency": "usd",
                "order": "market_cap_desc",
                "per_page": 20,
                "page": 1,
                "sparkline": False,
                "price_change_percentage": "24h"
            }
        )
        response.raise_for_status()  # Lanza error para respuestas no exitosas
        
        data = response.json()
        
        # Guardar en cache
        cache["data"] = data
        cache["timestamp"] = current_time
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from CoinGecko: {e}")
        return None

@app.route('/api/cryptocurrencies', methods=['GET'])
def get_cryptocurrencies():
    try:
        data = get_crypto_data()
        if data is None:
            # Intentar devolver datos cacheados incluso si la solicitud actual falla
            if cache['data']:
                return jsonify(cache['data'])
            return jsonify({"error": "No se pudieron obtener los datos"}), 500
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        # Manejar error 429 específicamente
        if hasattr(e.response, 'status_code') and e.response.status_code == 429:
            # Registrar el error y posiblemente usar datos cacheados
            print("Rate limit excedido. Usando datos cacheados.")
            if cache['data']:
                return jsonify(cache['data'])
            return jsonify({"error": "Límite de solicitudes excedido. Intenta más tarde."}), 429
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/api/cryptocurrencies/<coin_id>', methods=['GET'])
def get_coin_detail(coin_id):
    """Endpoint para obtener detalles de una criptomoneda específica"""
    try:
        # Obtener información detallada
        detail_response = requests.get(f"{COINGECKO_API_URL}/coins/{coin_id}")
        detail_response.raise_for_status()
        detail_data = detail_response.json()
        
        # Obtener datos históricos para el gráfico (últimos 7 días)
        history_response = requests.get(
            f"{COINGECKO_API_URL}/coins/{coin_id}/market_chart",
            params={
                "vs_currency": "usd",
                "days": 7,
                "interval": "daily"
            }
        )
        history_response.raise_for_status()
        history_data = history_response.json()
        
        # Combinar datos
        result = {
            "detail": detail_data,
            "history": history_data
        }
        
        return jsonify(result)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching details for {coin_id}: {e}")
        return jsonify({"error": "No se pudieron obtener los datos"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({"status": "OK", "message": "Server is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)