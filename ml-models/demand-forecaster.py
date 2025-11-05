#!/usr/bin/env python3
import sys, json
def forecast_demand(category):
    return {'forecast': [100, 120, 110, 130], 'trend': 'increasing'}
if __name__ == '__main__':
    print(json.dumps({'success': True, **forecast_demand('')}))
