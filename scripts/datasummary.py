import matplotlib.pyplot as plt
import json
import numpy as np
import pandas as pd
import tkinter as tk

dictionary = json.load(open('file.json', 'r'))
dict_series = pd.Series(dictionary)




master = tk.Tk()

def write_slogan():
    info_message = dict_series.describe()
    tk.Label(master, text=info_message).grid(row=2, column=1) 

btn = tk.Button(master, text='See Data Summary', command=write_slogan)
btn.grid(row=3, column=1, sticky=tk.W, pady=4)

master.mainloop()