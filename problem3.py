from __future__ import division
import math

hyperplanes = [
  [1,-1,1,-1,1,-1],
  [-1,-1,1,1,-1,1],
  [1,1,1,1,1,1]
]

u = [1, 0.25, 0, 0, 0.5, 0] 
v = [0.75, 0, 0, 0.2, 0.4, 0]
w = [0, 0.1, 0.75, 0, 0, 1]

def dot (a, b):
  return sum(map(lambda a, b: a * b, a, b))

def sketch (vector, hyperplanes):
  output = []
  for hyperplane in hyperplanes:
    prod = dot(vector, hyperplane)
    if (prod > 0): prod = 1
    elif (prod < 0): prod = -1
    output.append(prod)

  return output

print sketch(u, hyperplanes)
print sketch(v, hyperplanes)
print sketch(w, hyperplanes)

def magnitude (vector):
  return math.sqrt(sum(map(lambda a: a * a, vector)))

def similarity (a, b):
  return dot(a, b) / (magnitude(a) * magnitude(b))

print "Similarity sketch(u) sketch(v):", similarity(sketch(u, hyperplanes), sketch(v, hyperplanes))
print "Similarity sketch(u) sketch(w):", similarity(sketch(u, hyperplanes), sketch(w, hyperplanes))
