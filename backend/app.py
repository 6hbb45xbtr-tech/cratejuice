from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'CrateJuice API',
        'status': 'running',
        'version': '1.0.0'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

@app.route('/api/tracks')
def get_tracks():
    # Placeholder for tracks endpoint
    return jsonify({
        'tracks': [],
        'message': 'No tracks available yet'
    })

if __name__ == '__main__':
    # Debug mode only in development, not in production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)