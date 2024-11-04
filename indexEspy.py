import os
import csv
import pysolr
import argparse

__location__ = os.path.dirname(os.path.realpath(__file__))

#"ref_uuid"

solr = pysolr.Solr('https://solr2020.library.albany.edu:8984/solr/espy', always_commit=True, timeout=10)

solr.ping()

parser = argparse.ArgumentParser()
parser.add_argument('state', help='The state abbreviation that you want to index, such as NY for New York or AR for Arkansas.')
args = parser.parse_args()



filePath = os.path.join(__location__, "espySolr" + args.state + ".csv")
    
if not os.path.isfile(filePath):
    raise Exception("File 'espySolr" + args.state + ".csv' does not exist in current directory.")

else:

    #if file.startswith("espySolr"):
    print ("Indexing espySolr" + args.state + ".csv...")
    
    rowTotal = 0
    with open(filePath, newline='', encoding="utf8") as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            rowTotal += 1
    
    rowCount = 0
    with open(filePath, newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',')
        for row in reader:
            rowCount += 1
            if rowCount > 0:
                record = {k: v for k, v in row.items() if v != ""}
                #print (record)
                if "date_execution" in record.keys():
                    print ("(" + str(rowCount) + "/" + str(rowTotal) + ") Indexing " + record["id"] + " " + record["name"] + " " + record["date_execution"] + "...")
                else:
                    print ("(" + str(rowCount) + "/" + str(rowTotal) + ") Indexing " + record["id"] + " " + record["name"] + "...")
                
                solr.add(record)