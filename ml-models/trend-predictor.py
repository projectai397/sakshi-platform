#!/usr/bin/env python3
import sys, json
def predict_trends():
    return {'trends': ['vintage', 'sustainable', 'oversized'], 'confidence': 0.78}
if __name__ == '__main__':
    print(json.dumps({'success': True, **predict_trends()}))
