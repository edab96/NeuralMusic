import pandas as pd


column_names = ["Mozart", "Bach", "Schubert", "Liszt", "Linkin Park"]

df = pd.DataFrame(columns = column_names)

newdict = {"Mozart" : False, "Bach" : True, "Schubert" : False, "Liszt" : False, "Linkin Park" : False}

df = df.append(newdict, ignore_index=True)

#print(df.head())

from csv import writer
from datetime import datetime


def append_list_as_row(file_name, list_of_elem):
    # Open file in append mode
    with open(file_name, 'a+', newline='') as write_obj:
        # Create a writer object from csv module
        csv_writer = writer(write_obj)
        # Add contents of list as last row in the csv file
        csv_writer.writerow(list_of_elem)

newrow = [datetime.now(), False, True, True, False, False]

append_list_as_row('app/requests/song_requests.csv', newrow)


