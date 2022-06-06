import matplotlib.pyplot as plt
import json
import numpy as np
import pandas as pd

dictionary = json.load(open('file.json', 'r'))
xAxis = [key for key, value in dictionary.items()]
yAxis = [value for key, value in dictionary.items()]
plt.grid(True)

## LINE GRAPH ##
plt.plot(xAxis,yAxis, color='maroon', marker='o')
plt.xlabel('variable')
plt.ylabel('value')

fig, ax = plt.subplots()
ax.set_title('Click on legend line to toggle line on/off')
line1leg, = ax.plot(0, 0, lw=2, c='r', label='Female 1')
line1, = ax.plot(xAxis, yAxis, 'ro', lw=0, label='_nolegend_')
leg = ax.legend(fancybox=True, shadow=True)
leg.get_frame().set_alpha(0.4)


# we will set up a dict mapping legend line to orig line, and enable
# picking on the legend line
lines = [line1]
lined = dict()
for legline, origline in zip(leg.get_lines(), lines):
    legline.set_picker(5)  # 5 pts tolerance
    lined[legline] = origline


def onpick(event):
    # on the pick event, find the orig line corresponding to the
    # legend proxy line, and toggle the visibility
    legline = event.artist
    origline = lined[legline]
    vis = not origline.get_visible()
    origline.set_visible(vis)
    # Change the alpha on the line in the legend so we can see what lines
    # have been toggled
    #if not vis:
    #    legline.set_alpha(2)
    #    legline.set_marker('^')
    #else:
    #    legline.set_linewidth(3)
    #    legline.set_marker('<')
    if vis:
        legline.set_alpha(1.0)
    else:
        legline.set_alpha(0.2)
    fig.canvas.draw()

fig.canvas.mpl_connect('pick_event', onpick)

plt.show()