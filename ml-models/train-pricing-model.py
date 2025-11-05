#!/usr/bin/env python3
"""
ML Model Training Script for Dynamic Pricing
Trains a Random Forest model to predict optimal pricing adjustments
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def train_pricing_model(training_data):
    """Train Random Forest model for pricing optimization"""
    
    # Convert to DataFrame
    df = pd.DataFrame(training_data)
    
    if len(df) < 50:
        return {
            'success': False,
            'error': 'Insufficient training data (minimum 50 samples required)'
        }
    
    # Feature engineering
    df['price_per_day'] = df['finalPrice'] / (df['soldInDays'] + 1)
    df['demand_indicator'] = df['viewCount'] / (df['soldInDays'] + 1)
    df['price_efficiency'] = df['finalPrice'] / (df['originalPrice'] + 1)
    
    # Encode categorical variables
    label_encoders = {}
    categorical_cols = ['category', 'condition', 'brand']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le
    
    # Features for training
    feature_cols = [
        'category_encoded',
        'condition_encoded',
        'brand_encoded',
        'originalPrice',
        'sevaTokens',
        'soldInDays',
        'viewCount',
        'seasonalityScore',
        'demand_indicator'
    ]
    
    X = df[feature_cols]
    y = df['price_efficiency']  # Target: how well the price performed
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train Random Forest model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'pricing-model.joblib')
    encoders_path = os.path.join(os.path.dirname(__file__), 'label-encoders.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(label_encoders, encoders_path)
    
    # Feature importance
    feature_importance = dict(zip(feature_cols, model.feature_importances_))
    
    return {
        'success': True,
        'metrics': {
            'mae': float(mae),
            'r2_score': float(r2),
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'feature_importance': {k: float(v) for k, v in feature_importance.items()}
        },
        'model_path': model_path
    }

def main():
    try:
        # Read training data from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({'success': False, 'error': 'No training data provided'}))
            sys.exit(1)
        
        training_data = json.loads(sys.argv[1])
        
        # Train model
        result = train_pricing_model(training_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
        if result['success']:
            sys.exit(0)
        else:
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
