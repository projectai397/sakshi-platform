#!/usr/bin/env python3
"""
ML Prediction Script for Dynamic Pricing
Uses trained model to predict optimal pricing adjustments in real-time
"""

import sys
import json
import numpy as np
import pandas as pd
import joblib
import os

def predict_price_adjustment(factors):
    """Predict optimal price adjustment factor"""
    
    try:
        # Load trained model and encoders
        model_path = os.path.join(os.path.dirname(__file__), 'pricing-model.joblib')
        encoders_path = os.path.join(os.path.dirname(__file__), 'label-encoders.joblib')
        
        if not os.path.exists(model_path):
            return {
                'adjustmentFactor': 1.0,
                'confidence': 0.0,
                'message': 'Model not trained yet'
            }
        
        model = joblib.load(model_path)
        label_encoders = joblib.load(encoders_path)
        
        # Prepare features
        category_encoded = label_encoders['category'].transform([factors.get('category', 'clothing')])[0]
        condition_encoded = label_encoders['condition'].transform([factors.get('condition', 'good')])[0]
        brand_encoded = 0  # Default for unknown brands
        
        try:
            brand_encoded = label_encoders['brand'].transform([factors.get('brand', 'Unknown')])[0]
        except:
            pass  # Use default if brand not in training data
        
        # Calculate derived features
        view_count = factors.get('viewCount', 0)
        age_in_days = factors.get('ageInDays', 1)
        demand_indicator = view_count / (age_in_days + 1)
        
        # Create feature vector
        features = pd.DataFrame([{
            'category_encoded': category_encoded,
            'condition_encoded': condition_encoded,
            'brand_encoded': brand_encoded,
            'originalPrice': 100,  # Normalized base price
            'sevaTokens': 15,  # Default seva tokens
            'soldInDays': age_in_days,
            'viewCount': view_count,
            'seasonalityScore': factors.get('seasonalityScore', 0.5),
            'demand_indicator': demand_indicator
        }])
        
        # Predict price efficiency
        prediction = model.predict(features)[0]
        
        # Convert price efficiency to adjustment factor
        # Price efficiency of 1.0 means optimal, >1.0 means can increase, <1.0 means should decrease
        adjustment_factor = float(prediction)
        
        # Clamp adjustment factor to reasonable range (0.7 to 1.3)
        adjustment_factor = max(0.7, min(1.3, adjustment_factor))
        
        # Calculate confidence based on model certainty
        # Use prediction variance from ensemble
        confidence = 0.75  # Placeholder - would calculate from model variance
        
        return {
            'adjustmentFactor': adjustment_factor,
            'confidence': confidence,
            'prediction': float(prediction),
            'message': 'ML prediction successful'
        }
        
    except Exception as e:
        return {
            'adjustmentFactor': 1.0,
            'confidence': 0.0,
            'error': str(e),
            'message': 'Prediction failed, using default'
        }

def main():
    try:
        # Read factors from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                'adjustmentFactor': 1.0,
                'confidence': 0.0,
                'error': 'No factors provided'
            }))
            sys.exit(1)
        
        factors = json.loads(sys.argv[1])
        
        # Get prediction
        result = predict_price_adjustment(factors)
        
        # Output result as JSON
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            'adjustmentFactor': 1.0,
            'confidence': 0.0,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
