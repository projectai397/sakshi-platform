#!/usr/bin/env python3
"""
Intelligent Inventory Management System
Predicts product velocity and optimizes stocking decisions
"""

import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class InventoryPredictor:
    def __init__(self):
        self.velocity_classifier = None
        self.demand_regressor = None
        self.category_encoder = LabelEncoder()
        self.condition_encoder = LabelEncoder()
        
    def predict_velocity(self, product_data):
        """
        Predict if product will be fast, medium, or slow seller
        
        Args:
            product_data: Dict with product features
        
        Returns:
            velocity: 'fast', 'medium', or 'slow'
            confidence: 0-1 confidence score
        """
        # Extract features
        features = self._extract_features(product_data)
        
        # Simple rule-based prediction (would use trained model in production)
        score = 0
        
        # Category impact
        fast_categories = ['electronics', 'clothing', 'accessories']
        if product_data.get('category', '').lower() in fast_categories:
            score += 3
        
        # Condition impact
        if product_data.get('condition') in ['new', 'like-new']:
            score += 2
        elif product_data.get('condition') == 'good':
            score += 1
        
        # Price impact (lower price = faster)
        price = product_data.get('price', 0)
        if price < 500:
            score += 2
        elif price < 1000:
            score += 1
        
        # Age impact
        age_days = product_data.get('ageInDays', 0)
        if age_days < 7:
            score += 2
        elif age_days < 30:
            score += 1
        
        # Determine velocity
        if score >= 6:
            velocity = 'fast'
            confidence = 0.85
        elif score >= 3:
            velocity = 'medium'
            confidence = 0.75
        else:
            velocity = 'slow'
            confidence = 0.70
        
        return velocity, confidence
    
    def predict_days_to_sell(self, product_data):
        """
        Predict how many days until product sells
        
        Args:
            product_data: Dict with product features
        
        Returns:
            days: Estimated days to sell
            confidence: 0-1 confidence score
        """
        velocity, _ = self.predict_velocity(product_data)
        
        # Base estimates by velocity
        if velocity == 'fast':
            days = np.random.randint(1, 7)
            confidence = 0.80
        elif velocity == 'medium':
            days = np.random.randint(7, 30)
            confidence = 0.70
        else:
            days = np.random.randint(30, 90)
            confidence = 0.60
        
        return int(days), confidence
    
    def identify_dead_stock(self, products, threshold_days=60):
        """
        Identify products likely to become dead stock
        
        Args:
            products: List of product dicts
            threshold_days: Days threshold for dead stock
        
        Returns:
            List of product IDs at risk
        """
        at_risk = []
        
        for product in products:
            age_days = product.get('ageInDays', 0)
            velocity, _ = self.predict_velocity(product)
            
            # Check if product is old and slow-moving
            if age_days > threshold_days and velocity == 'slow':
                at_risk.append({
                    'productId': product.get('id'),
                    'ageInDays': age_days,
                    'velocity': velocity,
                    'recommendation': 'markdown_price'
                })
            elif age_days > threshold_days * 0.7 and velocity == 'slow':
                at_risk.append({
                    'productId': product.get('id'),
                    'ageInDays': age_days,
                    'velocity': velocity,
                    'recommendation': 'promote'
                })
        
        return at_risk
    
    def optimize_stocking(self, category_data):
        """
        Recommend optimal stocking levels by category
        
        Args:
            category_data: Dict with category sales history
        
        Returns:
            Stocking recommendations
        """
        recommendations = {}
        
        for category, data in category_data.items():
            avg_daily_sales = data.get('avgDailySales', 0)
            current_stock = data.get('currentStock', 0)
            lead_time_days = data.get('leadTimeDays', 7)
            
            # Calculate safety stock (1 week buffer)
            safety_stock = avg_daily_sales * 7
            
            # Calculate reorder point
            reorder_point = (avg_daily_sales * lead_time_days) + safety_stock
            
            # Calculate optimal order quantity (2 weeks supply)
            optimal_quantity = avg_daily_sales * 14
            
            recommendations[category] = {
                'currentStock': current_stock,
                'safetyStock': int(safety_stock),
                'reorderPoint': int(reorder_point),
                'optimalQuantity': int(optimal_quantity),
                'status': 'adequate' if current_stock >= reorder_point else 'low',
                'action': 'none' if current_stock >= reorder_point else 'reorder'
            }
        
        return recommendations
    
    def predict_seasonal_demand(self, category, month):
        """
        Predict seasonal demand multiplier
        
        Args:
            category: Product category
            month: Month number (1-12)
        
        Returns:
            Demand multiplier (0.5-2.0)
        """
        # Seasonal patterns for India
        seasonal_patterns = {
            'clothing': {
                10: 1.8,  # Diwali
                11: 1.6,  # Diwali/Wedding season
                3: 1.4,   # Holi
                8: 1.3,   # Raksha Bandhan
            },
            'electronics': {
                10: 1.9,  # Diwali
                11: 1.7,  # Diwali
                1: 1.3,   # New Year
            },
            'home': {
                10: 1.6,  # Diwali
                11: 1.5,  # Diwali
            }
        }
        
        category_lower = category.lower()
        for key in seasonal_patterns:
            if key in category_lower:
                return seasonal_patterns[key].get(month, 1.0)
        
        return 1.0
    
    def calculate_turnover_rate(self, products):
        """
        Calculate inventory turnover rate
        
        Args:
            products: List of products with sales data
        
        Returns:
            Turnover metrics
        """
        total_products = len(products)
        sold_products = sum(1 for p in products if p.get('status') == 'sold')
        
        if total_products == 0:
            return {
                'turnoverRate': 0,
                'avgDaysToSell': 0,
                'fastMovers': 0,
                'slowMovers': 0
            }
        
        # Calculate average days to sell
        days_to_sell = [p.get('daysToSell', 0) for p in products if p.get('daysToSell')]
        avg_days = np.mean(days_to_sell) if days_to_sell else 0
        
        # Classify products
        fast_movers = sum(1 for p in products if self.predict_velocity(p)[0] == 'fast')
        slow_movers = sum(1 for p in products if self.predict_velocity(p)[0] == 'slow')
        
        return {
            'turnoverRate': round(sold_products / total_products, 2),
            'avgDaysToSell': int(avg_days),
            'fastMovers': fast_movers,
            'slowMovers': slow_movers,
            'totalProducts': total_products
        }
    
    def _extract_features(self, product_data):
        """Extract numerical features from product data"""
        features = []
        
        # Category (encoded)
        category = product_data.get('category', 'other')
        features.append(hash(category) % 100)
        
        # Condition (encoded)
        condition_map = {'new': 5, 'like-new': 4, 'good': 3, 'fair': 2, 'poor': 1}
        features.append(condition_map.get(product_data.get('condition', 'good'), 3))
        
        # Price (normalized)
        features.append(min(product_data.get('price', 0) / 10000, 1.0))
        
        # Age
        features.append(product_data.get('ageInDays', 0))
        
        # Views (if available)
        features.append(product_data.get('viewCount', 0))
        
        return features

def main():
    """CLI interface"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                'success': False,
                'error': 'No command provided'
            }))
            sys.exit(1)
        
        command = sys.argv[1]
        predictor = InventoryPredictor()
        
        if command == 'predict_velocity':
            product_data = json.loads(sys.argv[2])
            velocity, confidence = predictor.predict_velocity(product_data)
            
            print(json.dumps({
                'success': True,
                'velocity': velocity,
                'confidence': confidence
            }))
            
        elif command == 'predict_days':
            product_data = json.loads(sys.argv[2])
            days, confidence = predictor.predict_days_to_sell(product_data)
            
            print(json.dumps({
                'success': True,
                'daysToSell': days,
                'confidence': confidence
            }))
            
        elif command == 'dead_stock':
            products = json.loads(sys.argv[2])
            threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 60
            at_risk = predictor.identify_dead_stock(products, threshold)
            
            print(json.dumps({
                'success': True,
                'atRisk': at_risk,
                'count': len(at_risk)
            }))
            
        elif command == 'optimize_stocking':
            category_data = json.loads(sys.argv[2])
            recommendations = predictor.optimize_stocking(category_data)
            
            print(json.dumps({
                'success': True,
                'recommendations': recommendations
            }))
            
        elif command == 'turnover':
            products = json.loads(sys.argv[2])
            metrics = predictor.calculate_turnover_rate(products)
            
            print(json.dumps({
                'success': True,
                'metrics': metrics
            }))
            
        else:
            print(json.dumps({
                'success': False,
                'error': f'Unknown command: {command}'
            }))
            sys.exit(1)
        
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
