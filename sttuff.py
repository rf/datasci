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
  lengths.append(float(row[7]))

plt.ioff()

thing = plt.hist(lengths, 200)
plt.savefig("length_plot.png")
plt.close()

rows_by_review_length = sorted(rows, lambda a, b: int(a[7]) - int(b[7]))
print rows_by_review_length[-1]
print rows_by_review_length[-2]
print rows_by_review_length[-3]

print "\n\n"

makers = {}
for row in rows:
  if row[0] in makers:
    makers[row[0]] += 1
  else:
    makers[row[0]] = 1

sorted_makers = sorted(makers, lambda a, b: makers[b] - makers[a])
for maker in sorted_makers:
  print maker, makers[maker]

helpfullness = [];
for row in rows:
  helpfullness.append(float(row[5]))

print 'pearson correlation btwn lengthand helpfullness:', stats.pearsonr(lengths, helpfullness)

plt.figure()
plt.scatter(helpfullness, lengths)
plt.axis([0, 1, 0, 26332])
plt.xlabel("Helpfullness")
plt.ylabel("Length")
plt.savefig("length_helpfullness_scatter.png")
plt.close()
