# austin_health_snomed_ct


--------------------------------------------------------
		Requirements Analysis
--------------------------------------------------------

1. User should be able to upload a csv file consisting of tgt_code
2. The contents of the file should be displayed in a tabular form
3. There should be option to find parents for the selected tgt_code column and the parents should be displayed in a new column
4. The user should be able to select any parent as preferred parent and click on the aggregate parent option.
5. When aggregated, all the records consisting of the same parent should get the same selected parent as preferred parent and the one without the selected parent should have the same tgt_code as preferred parent
6. The code and label should be displayed in different column
7. There should be option to export the new data into a csv file which consists of fields (tgt_code, tgt_label, preferred parent, preferred parent label)



--------------------------------------------------------
		Code File Description
--------------------------------------------------------
	
index.html (The main HTML web page file)

csv_loader.js (Javascript file to load uploaded csv file in the web page)

jquery.tabletoCSV.js (Javascript file to export table from web page to a csv file)

austin_health.png (Image file for logo in the web page)



--------------------------------------------------------
	Instructions to Run the Web Page in Local Machine
--------------------------------------------------------

Clone the austin_health repo in the local machine

Open the index.html file in the web browser
