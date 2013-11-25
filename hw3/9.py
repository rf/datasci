from math import sqrt

def dist (a, b):
  return sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

def findcentroid (args):
  x = 0
  y = 0
  for a in args:
    x += a[0]
    y += a[1]
  x /= len(args)
  y /= len(args)
  return (x, y)

points = [(3, 2), (0, 8), (6, 5)]
centroid = (3, 5)

sse = 0

for p in points:
  sse += dist(p, centroid)

print sse

import itertools

for a in itertools.combinations(points, 2):
  for b in itertools.combinations(points, 1):
    
    itsthere = False
    for asdf in a:
      if asdf == b[0]: 
        itsthere = True

    if not itsthere:
      print a, 'and', b
      print 'centroid of a:', findcentroid(a)
      print 'error:', dist(a[0], findcentroid(a))**2 + dist(a[1], findcentroid(a))**2
      print ''
