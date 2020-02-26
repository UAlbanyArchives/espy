require 'traject'
require 'traject_plus'
#require 'macros/csv'

#extend Macros::Csv
extend TrajectPlus::Macros
extend TrajectPlus::Macros::Csv

settings do
  provide "solr.url", "https://solr.library.albany.edu:8984/solr/espy"
  provide 'reader_class_name', 'TrajectPlus::CsvReader'
end

#to_field "institution", literal("University of Hogwarts")

#to_field "id", extract_xpath("//oai:record//oai:metadata/oai_dc:dc/dc:identifier"), first_only
#to_field "title", extract_xpath("//oai:metadata/oai_dc:dc/dc:title")
#to_field "rights", extract_xpath("//oai:metadata/oai_dc:dc/dc:rights")
#to_field "creator", extract_xpath("//oai:metadata/oai_dc:dc/dc:creator")
#to_field "description", extract_xpath("//oai:metadata/oai_dc:dc/dc:description")
#to_field "creator", extract_xpath("//oai:metadata/oai_dc:dc/dc:format")

to_field 'last_name', column('last_name'), strip