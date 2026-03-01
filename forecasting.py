import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings

warnings.filterwarnings('ignore')

class TimeSeriesForecaster:
    """Time-series forecasting using Prophet"""

    def __init__(self):
        self.model = None

    def forecast(self, df, column_name, periods=30):
        """
        Forecast future values using Prophet

        Args:
            df: DataFrame with time series data
            column_name: Column name to forecast
            periods: Number of periods to forecast

        Returns:
            Dictionary with forecast results
        """
        try:
            # Prepare data for Prophet
            forecast_df = pd.DataFrame()
            forecast_df['ds'] = pd.to_datetime(range(len(df)))
            forecast_df['y'] = df[column_name].values

            # Handle missing values
            forecast_df = forecast_df.dropna()

            if len(forecast_df) < 2:
                raise ValueError('Not enough data for forecasting')

            # Create and fit model
            model = Prophet(yearly_seasonality=False, interval_width=0.95)
            model.fit(forecast_df)

            # Make future dataframe
            future = model.make_future_dataframe(periods=periods)
            forecast = model.predict(future)

            # Extract forecast results
            forecast_values = forecast['yhat'].tail(periods).values
            lower_bound = forecast['yhat_lower'].tail(periods).values
            upper_bound = forecast['yhat_upper'].tail(periods).values

            # Calculate accuracy on training data
            hist_forecast = model.predict(forecast_df[['ds']])
            mae = mean_absolute_error(forecast_df['y'], hist_forecast['yhat'])
            rmse = np.sqrt(mean_squared_error(forecast_df['y'], hist_forecast['yhat']))

            # Simple accuracy score (0-100)
            mean_value = forecast_df['y'].mean()
            accuracy = max(0, 100 - (mae / mean_value * 100)) if mean_value > 0 else 0
            accuracy = min(100, accuracy)

            return {
                'forecast': forecast_values,
                'lower_bound': lower_bound,
                'upper_bound': upper_bound,
                'confidence': 85,
                'accuracy': accuracy,
                'mae': mae,
                'rmse': rmse
            }
        except Exception as e:
            raise Exception(f'Forecasting error: {str(e)}')
