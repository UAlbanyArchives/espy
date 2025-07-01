import os
import csv
import json
import pysolr
import requests
import argparse

__location__ = os.path.dirname(os.path.realpath(__file__))

def queryManifest(manifest_url, canvas_index):
    if manifest_url and canvas_index is not None:
        canvas_index = int(canvas_index)
        response = requests.get(manifest_url, timeout=10)
        response.raise_for_status()
        manifest = response.json()

        items = manifest.get("items", [])
        #print (f"{canvas_index} --> {manifest_url}")
        #print (len(items))

        if canvas_index < len(items):
            canvas = items[canvas_index]
        else:
            print(f"Warning: canvas index {canvas_index} out of range for manifest {manifest_url}")

        return canvas

def add_canvas(record, manifest_field, index_field):
    manifest = record.get(manifest_field)
    index = record.get(index_field)
    field_name = f"{manifest_field.split("_")[0]}_canvas_ssm"

    if index and manifest != False:
        canvases = []
        #print (f"{len(index.split("|"))} and {len(manifest.split("; "))}")
        for inc, page in enumerate(manifest.split("; ")):
            #print (f"looking for {index} in --> {page}")
            canvas = queryManifest(page, index.split("|")[inc])
            canvases.append(json.dumps(canvas))
        record[field_name] = canvases
    return record


solr = pysolr.Solr('https://solr2020.library.albany.edu:8984/solr/espy2', always_commit=True, timeout=10)

solr.ping()

parser = argparse.ArgumentParser()
parser.add_argument('state', help='The state abbreviation that you want to index, such as NY for New York or AR for Arkansas.')
parser.add_argument('path', help='The path containing the csv to index from.')
args = parser.parse_args()

indexDir = args.path

filePath = os.path.join(indexDir, "espy" + args.state + ".csv")
if not os.path.isfile(filePath):
    raise Exception("File 'espy" + args.state + ".csv' does not exist in current directory.")
else:

    #if file.startswith("espy"):
    print ("Indexing espy" + args.state + ".csv...")
    
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
                if "date_execution" in record.keys():
                    date_ex = record["date_execution"]
                else:
                    date_ex = ""

                print (f"({rowCount}/{rowTotal-1}) Indexing {record["id"]} {record["name"]} {date_ex}...")

                record = add_canvas(record, "index_card_manifest", "index_card_index")
                record = add_canvas(record, "big_card_manifest", "big_card_index")
                record = add_canvas(record, "reference_material_manifest", "reference_material_index")

                field_fixes = [
                    "index_card_files",
                    "index_card_manifest",
                    "index_card_id",
                    "big_card_files",
                    "big_card_manifest",
                    "big_card_id",
                    "reference_material_files",
                    "reference_material_manifest",
                    "reference_material_id"
                ]
                field_fixes2 = [
                    "index_card_index",
                    "big_card_index",
                    "reference_material_index"
                ]
                
                if record["index_card_manifest"].startswith("https://media.archives.albany.edu/"):
                    record["thumbnail_ss"] = record["index_card_manifest"].replace("manifest.json", "thumbnail.jpg")

                for field in field_fixes:
                    if field in record.keys():
                        record[field + "_ssm"] = record[field].split("; ")
                        del record[field]
                for field in field_fixes2:
                    if field in record.keys():
                        record[field + "_ssm"] = record[field].split("|")
                        del record[field]
                
                solr.add(record)