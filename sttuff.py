from __future__ import division
import csv
from scipy import stats

rows = []

for row in csv.reader(open("laptops.csv", "rb")):
  rows.append(row)

rows = rows[1:]

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

release_to_review_times = []

for row in rows:
  release_to_review_times.append(int(row[1]))

#qs = stats.scoreatpercentile(release_to_review_times, [0, 25, 50, 75, 100])
print "min &", stats.scoreatpercentile(release_to_review_times, 0), "\\\\"
print "Q1 &", stats.scoreatpercentile(release_to_review_times, 25), "\\\\"
print "median &", stats.scoreatpercentile(release_to_review_times, 50), "\\\\"
print "Q3 &", stats.scoreatpercentile(release_to_review_times, 75), "\\\\"
print "max &", stats.scoreatpercentile(release_to_review_times, 100), "\\\\"

import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt

lengths = []
for row in rows:
  lengths.append(int(row[7]))

plt.ioff()

thing = plt.hist(lengths, 200)
plt.savefig("length_plot.png")
plt.close()
