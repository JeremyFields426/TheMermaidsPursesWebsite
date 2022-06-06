#!/usr/bin/env python3

import pandas as pd
import re

filename = "../../Egg-incubation-dummydata-24Sept21.xlsx"

df = pd.DataFrame(pd.read_excel(filename, dtype='str'))
df.fillna('nan', inplace=True)
cols = {'Institution':'[a-zA-Z\s]', 
	'Exhibit':'[a-zA-Z\s]', 
	'Potential Dam(s) (Studbook Number)':'[\d#]+', 
	'Dam(s) House name or ID':'[\w]+',
	'Potential Sire(s) (Studbook Number)':'[\d#]+', 
	'Sire(s) House name or ID':'[\w]+', 
	'DATE LAID ':'[0-1][0-9]/[0-3][0-9]/[1-2][0-9][0-9][0-9]', 
	'DATE RETRIEVED':'[0-1][0-9]/[0-3][0-9]/[1-2][0-9][0-9][0-9]', 
	'Is a yolk present?':'[yes]|[no]', 
	'House ID of Yolked eggs':'[\w]', 
	'mass of egg':'([0-9]*[.])?[0-9]+', 
	'Temperature of tank':'([0-9]*[.])?[0-9]+', 
	'Date Shipped':'[0-1][0-9]/[0-3][0-9]/[1-2][0-9][0-9][0-9]', 
	'Location shipped':'[a-zA-Z\s]'}
#cols is a dictionary that maps column names to regular expressions that match the allowable strings in the column

incorrectColumns = set()
notInDataset = set()
for title in list(cols.keys()):
	#title = title.strip()
	#print(title)
	for line in df[title]:
		try:	
			if not re.match(cols[title], line) and line != 'nan':
				incorrectColumns.add(title)
		except KeyError:
			notInDataset.add(title)
			print("%s Key Error" %title)

for title in notInDataset:
	print("%s is not in the dataset" %title)

for title in incorrectColumns:
	print("%s must be formatted like %s" %(title, cols[title]))
if "Temperature of tank" not in incorrectColumns:
	try:
		for val in df["Temperature of tank"]:
			val = val.replace("FCfc","")
			val = int(val)
			if val > 45:
				val = int((val-32)*5/9) 
	except(ValueError):
		print("Temperature of tank must be formatted like: ([0-9]*[.])?[0-9]+")
	#df.loc[:,"Temperature of tank"] = df.loc[:,"Temperature of tank"].strip("F", "C", "f", "c")
	#df.loc[:,"Temperature of tank"] = int(df.loc[:,"Temperature of tank"])
	#if df.loc[:,"Temperature of tank"] > 45: 
		#df.loc[:,"Temperature of tank"] = int((df.loc[:,"Temperature of tank"] - 32)*5/9)
