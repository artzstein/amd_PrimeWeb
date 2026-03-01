from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from models.forecasting import TimeSeriesForecaster
from models.anomaly_detection import AnomalyDetector
from models.insights import InsightGenerator
import logging
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize models
forecaster = TimeSeriesForecaster()
anomaly_detector = AnomalyDetector()
insight_generator = InsightGenerator()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ML Service',
        'timestamp': pd.Timestamp.now().isoformat()
    }), 200

@app.route('/api/forecast', methods=['POST'])
def forecast():
    """Time-series forecasting endpoint"""
    try:
        data = request.get_json()

        if not data or 'data' not in data or 'columnName' not in data:
            return jsonify({
                'success': False,
                'error': 'data and columnName are required'
            }), 400

        df = pd.DataFrame(data['data'])
        column_name = data['columnName']
        periods = data.get('periods', 30)

        if column_name not in df.columns:
            return jsonify({
                'success': False,
                'error': f'Column {column_name} not found'
            }), 400

        # Generate forecast
        forecast_result = forecaster.forecast(df, column_name, periods)

        return jsonify({
            'success': True,
            'forecast': forecast_result['forecast'].tolist(),
            'confidence': forecast_result['confidence'],
            'accuracy': forecast_result.get('accuracy', 0),
            'lower_bound': forecast_result.get('lower_bound', []).tolist() if 'lower_bound' in forecast_result else [],
            'upper_bound': forecast_result.get('upper_bound', []).tolist() if 'upper_bound' in forecast_result else []
        }), 200
    except Exception as e:
        logger.error(f'Forecast error: {str(e)}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/anomalies', methods=['POST'])
def detect_anomalies():
    """Anomaly detection endpoint"""
    try:
        data = request.get_json()

        if not data or 'data' not in data or 'columnName' not in data:
            return jsonify({
                'success': False,
                'error': 'data and columnName are required'
            }), 400

        df = pd.DataFrame(data['data'])
        column_name = data['columnName']
        sensitivity = data.get('sensitivity', 0.95)

        if column_name not in df.columns:
            return jsonify({
                'success': False,
                'error': f'Column {column_name} not found'
            }), 400

        # Detect anomalies
        anomalies = anomaly_detector.detect(df, column_name, sensitivity)

        return jsonify({
            'success': True,
            'anomalies': anomalies['anomalies'],
            'anomaly_count': len(anomalies['anomalies']),
            'confidence': anomalies['confidence']
        }), 200
    except Exception as e:
        logger.error(f'Anomaly detection error: {str(e)}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/insights', methods=['POST'])
def generate_insights():
    """Generate insights from data"""
    try:
        data = request.get_json()

        if not data or 'data' not in data or 'columnName' not in data:
            return jsonify({
                'success': False,
                'error': 'data and columnName are required'
            }), 400

        df = pd.DataFrame(data['data'])
        column_name = data['columnName']

        if column_name not in df.columns:
            return jsonify({
                'success': False,
                'error': f'Column {column_name} not found'
            }), 400

        # Generate insights
        insights = insight_generator.generate(df, column_name)

        return jsonify({
            'success': True,
            'insights': insights['insights'],
            'confidence': insights['confidence']
        }), 200
    except Exception as e:
        logger.error(f'Insights generation error: {str(e)}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=os.getenv('FLASK_ENV') == 'development', host='0.0.0.0', port=port)
