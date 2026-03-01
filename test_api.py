import pytest
import json
import pandas as pd
import numpy as np
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['service'] == 'ML Service'

def test_forecast_endpoint(client):
    """Test forecasting endpoint"""
    # Create sample data
    sample_data = [
        {f'value_{i}': np.random.randint(100, 200)}
        for i in range(100)
    ]

    # Sample data for forecast
    data = {
        'data': [{'value': i + np.random.normal(0, 10)} for i in range(50, 150)],
        'columnName': 'value',
        'periods': 30
    }

    response = client.post('/api/forecast',
                          data=json.dumps(data),
                          content_type='application/json')

    assert response.status_code == 200
    data_response = json.loads(response.data)
    assert data_response['success'] is True
    assert 'forecast' in data_response
    assert len(data_response['forecast']) == 30
    assert 0 <= data_response['confidence'] <= 100

def test_forecast_missing_column(client):
    """Test forecast with missing column"""
    data = {
        'data': [{'value': i} for i in range(50)],
        'columnName': 'nonexistent',
        'periods': 30
    }

    response = client.post('/api/forecast',
                          data=json.dumps(data),
                          content_type='application/json')

    assert response.status_code == 400
    data_response = json.loads(response.data)
    assert data_response['success'] is False

def test_anomalies_endpoint(client):
    """Test anomaly detection endpoint"""
    # Create data with outlier
    data = {
        'data': [{'value': v} for v in list(range(100, 150)) + [500]],
        'columnName': 'value',
        'sensitivity': 0.95
    }

    response = client.post('/api/anomalies',
                          data=json.dumps(data),
                          content_type='application/json')

    assert response.status_code == 200
    data_response = json.loads(response.data)
    assert data_response['success'] is True
    assert 'anomalies' in data_response
    assert data_response['anomaly_count'] > 0

def test_insights_endpoint(client):
    """Test insights generation endpoint"""
    data = {
        'data': [{'value': np.random.normal(100, 15)} for _ in range(100)],
        'columnName': 'value'
    }

    response = client.post('/api/insights',
                          data=json.dumps(data),
                          content_type='application/json')

    assert response.status_code == 200
    data_response = json.loads(response.data)
    assert data_response['success'] is True
    assert 'insights' in data_response
    assert len(data_response['insights']) > 0

def test_missing_data_field(client):
    """Test with missing data field"""
    data = {
        'columnName': 'value',
        'periods': 30
    }

    response = client.post('/api/forecast',
                          data=json.dumps(data),
                          content_type='application/json')

    assert response.status_code == 400
    data_response = json.loads(response.data)
    assert data_response['success'] is False

def test_404_endpoint(client):
    """Test 404 error"""
    response = client.get('/nonexistent')
    assert response.status_code == 404
