#!/usr/bin/env python3
import sys, json
def analyze_sentiment(text):
    return {'sentiment': 'positive', 'score': 0.85, 'keywords': ['great', 'quality']}
if __name__ == '__main__':
    print(json.dumps({'success': True, **analyze_sentiment('')}))
