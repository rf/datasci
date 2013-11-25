
def hash(x):
  return ((3 * x) + 7) % 11

for i in range(0,11):
  print i, hash(i), bin(hash(i))
