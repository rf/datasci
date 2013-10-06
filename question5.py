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
  foundindex = 99
  permutation = permutations[permutation]
  for ii in range(0, 5):
    if s[document][ii] == 1:
      if permutation[ii] < foundindex:
        foundindex = permutation[ii]
  return foundindex

sigs = []
documents = []

for i in range(0, 4):
  print "Signature of document", i+1, ":", minhash(0, i), minhash(1, i), minhash(2, i)
  sigs.append(set([minhash(0, i), minhash(1, i), minhash(2, i)]))

  # also build s as sets
  documents.append(set())
  for jj in range(0, 6):
    if s[i][jj] == 1:
      documents[i] |= set([jj])

def jaccard (a, b):
  return float(len(a & b)) / float(len(a | b))

print sigs
print documents

for ii in range(0, 4):
  for jj in range(ii, 4):
    if ii != jj:
      print "s", ii+1, "and s", jj+1, "estimation", jaccard(sigs[ii], sigs[jj]), "actual", jaccard(documents[ii], documents[jj])
