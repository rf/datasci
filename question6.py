s = [
  [0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
  [1, 0, 1, 0, 1, 0]
]

def h1 (x):
  return (2*x + 1) % 6

def h2 (x):
  return (3*x + 2) % 6

def h3 (x):
  return (5*x + 2) % 6

permutations = [[],[],[]];

for i in range(0, 6):
  permutations[0].append(h1(i))

for i in range(0, 6):
  permutations[1].append(h2(i))

for i in range(0, 6):
  permutations[2].append(h3(i))

def minhash (permutation, document):
  for ii in permutations[permutation]:
    if s[document][ii] == 1:
      return ii

print permutations

print

for i in range(0, 4):
  print "Signature of document", i+1, ":", minhash(0, i), minhash(1, i), minhash(2, i)
