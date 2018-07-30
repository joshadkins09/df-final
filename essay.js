var essay = "I have developed an interactive slideshow exploring the percent change in forest area by country between 1990 and 2015 using data from the world bank indicators. There are 13 slides (scenes) provided by the author highlighting interesting aspects of each region. Data is displayed in the left and the annotations for each scene are found in the light blue box on the right. Beneath the light blue box are flow controls that traverse the author-driven content. The first button restarts the slide show back to the first slide, next a button that will go back to the previous slide when beyond the first, then a field indicating the current slide number, and finally a button to move to the next slide if not on the last slide. Clicking any of these buttons (when the resulting state would be valid) triggers the parameters to be set for the requested slide change and the annotations on the right to change.\n\n"+

"The parameters for the narrative visualization are found beneath the chart itself. The list of countries currently displayed in the chart can be found directly below the plot (by abbreviation), color coded to match the color of its corresponding trace. Clicking on the abbreviated name of the country will toggle the visibility of the corresponding trace in the plot. Annotated details about each data point in a visible trace can be triggered by simply hovering over the data point on the desired trace. There is also a 'remove all' button, which removes all traces so that the user can toggle on only the traces they wish to see. When all traces have been removed, the button changes to 'restore all' which will activate all traces. This button is reset to its default value with triggered by another parameter change.\n\n"+

"Besides the remove/restore button, there are 4 primary parameters to the visualization that are utilized by scene changes in the author-driven content, but are fully available to the viewer so that they can do further filtering for viewer-driven content. At each scene or any point in the visualization, the viewer can modify existing parameters to trigger changes to the displayed data. The annotations associated with a particular scene in the author-driven content disappear when viewers begin applying their own filters to explore the data for themselves. The data can be filtered by region one at a time or all (if an income has been specified), by income group one at a time or all (if a region has been specified), minimum baseline forest area, and maximum baseline forest area. The latter two filters are meant to be used together so the viewer can specify they want to see results in a given forest size range. One thing to note is that because filtering with all countries and all income levels would display the entire dataset, I decided to restrict the use of the 'all' option to only one of those parameters at a time, so if all regions are selected, the 'all' income group option will be unavailable and vice-versa."
;
