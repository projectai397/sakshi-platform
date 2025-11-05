#!/usr/bin/env python3
import sys, json
def recommend_size(user_data):
    return {'recommendedSize': 'M', 'confidence': 0.85, 'alternatives': ['S', 'L']}
if __name__ == '__main__':
    print(json.dumps({'success': True, **recommend_size({})}))
