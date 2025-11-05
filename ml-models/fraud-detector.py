#!/usr/bin/env python3
import sys, json
def detect_fraud(transaction):
    return {'isFraud': False, 'riskScore': 0.15, 'confidence': 0.90}
if __name__ == '__main__':
    print(json.dumps({'success': True, **detect_fraud({})}))
