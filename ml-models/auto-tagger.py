#!/usr/bin/env python3
import sys, json
def tag_product(text):
    return {'tags': ['vintage', 'denim', 'casual'], 'category': 'clothing'}
if __name__ == '__main__':
    print(json.dumps({'success': True, **tag_product('')}))
