import sys
import json

src_file = sys.argv[1]
dst_dir = sys.argv[2]

exports = json.load(open(src_file))

for row in exports:
    with open(f'{dst_dir}/{row["filename"]}.json', 'w') as target:
        json.dump(row, target, indent=2)