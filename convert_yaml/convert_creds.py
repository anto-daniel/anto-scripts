#!/usr/bin/env python3

import yaml
import sys

if len(sys.argv) != 2:
    print("Argument is reqd !!!")
    print("argument is yaml readable file")
    sys.exit() 

filename = sys.argv[1]
creds_file = "creds.yaml"
creds = {}
b = creds["credentials"] = []

with open(filename) as f:
    
    data = yaml.load(f, Loader=yaml.FullLoader)
    for k,v in data.items():
        a = {}
        a['name'] = k
        a['type'] = "value"
        a['value'] = v
        b.append(a)

print(creds)
with open(creds_file, "w") as f:
    data = yaml.dump(creds, f)

      
