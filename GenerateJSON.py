#!/usr/bin/python

from openpyxl.reader.excel import load_workbook
import json,pprint


def main():
	years = {}
	speaker_years = {}
	data = {'years':years,'speaker_years':speaker_years}
	wb = load_workbook(filename=r'speakers.xlsx')
	sheet = wb.get_sheet_by_name('Raw Data')
	for row in sheet.rows:
		year_value = row[0].value
		if year_value != None and year_value != 'year':
			if year_value not in years:
				years[year_value] = blank_year()
			parse_row(row, years[year_value],speaker_years)
	f = open('data.json','w')
	f.write(json.dumps(data,indent=4,sort_keys=True))
	f.close()

def parse_row(row, year,speaker_years):
	if row[1].value != None:
		add_to_list(row[1].value,row[0].value,speaker_years)
		parse_speaker_from_row(row,year)
	if row[10].value != None:
		parse_event_from_row(row,year)

def parse_speaker_from_row(row,year):
	name = row[1].value
	sp = get_or_create(year['speakers'],'name',name)
	sp['degree'] = row[3].value
	sp['degree_from'] = row[4].value
	sp['sex'] = row[5].value
	sp['affiliation'] = row[6].value
	if 'talks' in sp:
		sp['talks'].append(row[10].value)
	else:
		sp['talks'] = [row[10].value]

def parse_event_from_row(row,year):
	title = row[10].value
	ev = get_or_create(year['events'],'title',title)
	ev['abstract'] = row[11].value
	add_to_list('speakers',row[1].value,ev)
	add_to_list('topic',row[7].value,ev)
	add_to_list('topic',row[8].value,ev)
	add_to_list('topic',row[9].value,ev)
	
def add_to_list(list_name,identifier_value,dictionary):
	if identifier_value == None:
		return
	if list_name not in dictionary:
		dictionary[list_name] = []
	l = dictionary[list_name]
	if identifier_value not in l:
		l.append(identifier_value)

def get_or_create(l,identifier,identifier_value):
	for item in l:
		if item[identifier] == identifier_value:
			return item
	item = {identifier:identifier_value}
	l.append(item)
	return item


def blank_year():
	return {'speakers':[], 'events':[], 'attendees':0}

if __name__ == '__main__':
	main()
