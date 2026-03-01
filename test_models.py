import pytest
import numpy as np
import pandas as pd
from models.forecasting import TimeSeriesForecaster
from models.anomaly_detection import AnomalyDetector
from models.insights import InsightGenerator

class TestTimeSeriesForecaster:
    def setup_method(self):
        self.forecaster = TimeSeriesForecaster()
        # Create sample time series data
        self.data = pd.DataFrame({
            'value': np.random.randint(100, 200, 100)
        })

    def test_forecast_returns_correct_structure(self):
        result = self.forecaster.forecast(self.data, 'value', 30)

        assert 'forecast' in result
        assert 'confidence' in result
        assert 'accuracy' in result
        assert len(result['forecast']) == 30

    def test_forecast_confidence_in_range(self):
        result = self.forecaster.forecast(self.data, 'value', 30)

        assert 0 <= result['confidence'] <= 100
        assert 0 <= result['accuracy'] <= 100

    def test_forecast_bounds_exist(self):
        result = self.forecaster.forecast(self.data, 'value', 30)

        assert 'lower_bound' in result
        assert 'upper_bound' in result
        assert len(result['lower_bound']) == 30
        assert len(result['upper_bound']) == 30

    def test_forecast_with_insufficient_data(self):
        small_data = self.data.head(1)

        with pytest.raises(Exception):
            self.forecaster.forecast(small_data, 'value', 30)


class TestAnomalyDetector:
    def setup_method(self):
        self.detector = AnomalyDetector()
        # Create sample data with some outliers
        self.data = pd.DataFrame({
            'value': list(range(100, 150)) + [500] + list(range(150, 200))
        })

    def test_anomaly_detection_returns_structure(self):
        result = self.detector.detect(self.data, 'value', 0.95)

        assert 'anomalies' in result
        assert 'confidence' in result
        assert 'total_anomalies' in result
        assert isinstance(result['anomalies'], list)

    def test_anomaly_detection_finds_outliers(self):
        result = self.detector.detect(self.data, 'value', 0.95)

        # Should detect the outlier at value 500
        assert len(result['anomalies']) > 0
        assert any(a['value'] == 500 for a in result['anomalies'])

    def test_anomaly_confidence_in_range(self):
        result = self.detector.detect(self.data, 'value', 0.95)

        assert 0 <= result['confidence'] <= 100

    def test_anomaly_detection_with_insufficient_data(self):
        small_data = self.data.head(1)

        with pytest.raises(Exception):
            self.detector.detect(small_data, 'value', 0.95)


class TestInsightGenerator:
    def setup_method(self):
        self.generator = InsightGenerator()
        # Create sample data
        self.data = pd.DataFrame({
            'value': np.random.normal(100, 15, 1000)
        })

    def test_insight_generation_returns_structure(self):
        result = self.generator.generate(self.data, 'value')

        assert 'insights' in result
        assert 'confidence' in result
        assert 'statistics' in result
        assert isinstance(result['insights'], list)

    def test_insight_generation_returns_insights(self):
        result = self.generator.generate(self.data, 'value')

        assert len(result['insights']) > 0
        assert len(result['insights']) <= 5

    def test_statistics_in_insights(self):
        result = self.generator.generate(self.data, 'value')
        stats = result['statistics']

        assert 'mean' in stats
        assert 'median' in stats
        assert 'std_dev' in stats
        assert 'min' in stats
        assert 'max' in stats

    def test_insight_confidence_in_range(self):
        result = self.generator.generate(self.data, 'value')

        assert 0 <= result['confidence'] <= 100

    def test_insight_generation_with_insufficient_data(self):
        small_data = self.data.head(1)

        with pytest.raises(Exception):
            self.generator.generate(small_data, 'value')
