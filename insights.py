import pandas as pd
import numpy as np
from scipy import stats

class InsightGenerator:
    """Generate insights from data"""

    def generate(self, df, column_name):
        """
        Generate insights from data

        Args:
            df: DataFrame with data
            column_name: Column to analyze

        Returns:
            Dictionary with insights
        """
        try:
            data = df[column_name].dropna()

            if len(data) < 2:
                raise ValueError('Not enough data for insight generation')

            insights = []

            # Basic statistics
            mean_val = data.mean()
            median_val = data.median()
            std_val = data.std()
            min_val = data.min()
            max_val = data.max()

            # Insight 1: Mean vs Median
            if abs(mean_val - median_val) > std_val:
                insights.append(
                    f'Data shows significant skewness with mean ({mean_val:.2f}) '
                    f'differing notably from median ({median_val:.2f}). '
                    'Consider checking for outliers.'
                )

            # Insight 2: Variation
            cv = (std_val / mean_val * 100) if mean_val != 0 else 0
            if cv > 50:
                insights.append(
                    f'High variability detected (CV: {cv:.1f}%). '
                    'Data shows significant fluctuations.'
                )
            elif cv < 10:
                insights.append(
                    f'Low variability detected (CV: {cv:.1f}%). '
                    'Data is relatively stable.'
                )

            # Insight 3: Trend
            if len(data) > 10:
                recent = data.tail(len(data)//3).mean()
                past = data.head(len(data)//3).mean()
                change_pct = ((recent - past) / past * 100) if past != 0 else 0

                if change_pct > 10:
                    insights.append(f'Upward trend detected: {change_pct:.1f}% increase')
                elif change_pct < -10:
                    insights.append(f'Downward trend detected: {change_pct:.1f}% decrease')
                else:
                    insights.append('Data shows stable trend without significant changes')

            # Insight 4: Distribution
            skewness = stats.skew(data)
            kurtosis = stats.kurtosis(data)

            if abs(skewness) > 1:
                skew_type = 'right' if skewness > 0 else 'left'
                insights.append(f'Data is highly skewed to the {skew_type}')

            # Insight 5: Range
            range_val = max_val - min_val
            insights.append(
                f'Data range: {min_val:.2f} to {max_val:.2f} (span: {range_val:.2f})'
            )

            # Ensure we have at least 3 insights
            if len(insights) < 3:
                insights.append(f'Mean value: {mean_val:.2f}, Std Dev: {std_val:.2f}')

            return {
                'insights': insights[:5],  # Return top 5 insights
                'confidence': 80,
                'statistics': {
                    'mean': float(mean_val),
                    'median': float(median_val),
                    'std_dev': float(std_val),
                    'min': float(min_val),
                    'max': float(max_val)
                }
            }
        except Exception as e:
            raise Exception(f'Insight generation error: {str(e)}')
