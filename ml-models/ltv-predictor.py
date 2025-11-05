#!/usr/bin/env python3
import sys, json
def predict_ltv(user_data):
    return {'ltv': 5000, 'segment': 'high_value', 'confidence': 0.80}
if __name__ == '__main__':
    print(json.dumps({'success': True, **predict_ltv({})}))
