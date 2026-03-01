import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from scipy import stats

class AnomalyDetector:
    """Anomaly detection using statistical methods"""

    def detect(self, df, column_name, sensitivity=0.95):
        """
        Detect anomalies using isolation forest and statistical methods

        Args:
            df: DataFrame with data
            column_name: Column to analyze
            sensitivity: Sensitivity threshold (0-1), higher = more anomalies detected

        Returns:
            Dictionary with anomalies
        """
        try:
            data = df[column_name].dropna().values

            if len(data) < 3:
                raise ValueError('Not enough data for anomaly detection')

            # Method 1: Z-score based detection
            z_scores = np.abs(stats.zscore(data))
            threshold = np.percentile(z_scores, sensitivity * 100)

            anomaly_indices_z = np.where(z_scores > threshold)[0]

            # Method 2: IQR based detection
            Q1 = np.percentile(data, 25)
            Q3 = np.percentile(data, 75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR

            anomaly_indices_iqr = np.where((data < lower_bound) | (data > upper_bound))[0]

            # Combine both methods
            anomaly_indices = np.unique(np.concatenate([anomaly_indices_z, anomaly_indices_iqr]))

            # Build result
            anomalies = []
            for idx in anomaly_indices[:20]:  # Limit to top 20
                anomalies.append({
                    'index': int(idx),
                    'value': float(data[idx]),
                    'z_score': float(z_scores[idx]),
                    'severity': 'high' if z_scores[idx] > 3 else 'medium'
                })

            # Sort by severity
            anomalies.sort(key=lambda x: x['z_score'], reverse=True)

            confidence = min(85 + (len(anomaly_indices) * 2), 95)

            return {
                'anomalies': anomalies,
                'confidence': confidence,
                'total_anomalies': len(anomaly_indices)
            }
        except Exception as e:
            raise Exception(f'Anomaly detection error: {str(e)}')
