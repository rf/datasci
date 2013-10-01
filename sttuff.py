from __future__ import division
import csv

rows = []

for row in csv.reader(open("laptops.csv", "rb")) :
  rows.append(row)

total_realnamers = 0
realnamers_verified = 0
for row in rows:
  if row[2] == "1":
    total_realnamers += 1

    if row[3] == "1":
      realnamers_verified += 1

print "realnamers verified purchase", realnamers_verified / total_realnamers

total_verified = 0
verified_realnamers = 0
for row in rows:
  if row[2] == "1":
    total_verified += 1

    if row[3] == "1":
      verified_realnamers += 1

print "verified realnamers purchase", verified_realnamers / total_verified

