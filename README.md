#This is a collection of random javascript things that I've made over time.
#Most of these things will require [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) in chrome or [Greasemonkey](https://addons.mozilla.org/en-Us/firefox/addon/greasemonkey/) in firefox
Better edline -> edline/
========================
####Type: Userscript
#####Tested in chrome with ecmascript5 using tampermonkey
####Details:

Screenshots:  
![A screenshot](/_edline_screen1.png?raw=true "(((OLD SCREENSHOT))) The different colors that grades can have")  
![A screenshot](/_edline_screen2.png?raw=true "Individual class grades")  
![A screenshot](/_edline_screen3.png?raw=true "The category metrics screen")  

This is a pair of userscripts that I use to make edline more usable.  Added functionality:
- Shows the grade next to the class on the private report menu
- Adds colors corresponding to grades
- Adds assignments viewing menu where they are sorted by category
- Differentiates + and - grades (A+, B-, 0, etc.)
- Upcoming assignments, excused assignments, late assignments, and graded assignments all sorted with color
- Many metrics
  - Assignment grade (Letter + percent)
  - Effect on overall grade
    - How much it hurts the overall grade
	- The total amount that it benifits your grade
	- How much of your grade each point is worth
	- How much you could gain if you scored a higher grade


####Installation:
1. Create a two userscripts with the header defined below
2. Give them @match arguments of:
  - main.js -> `https://www.edline.net/UserDocList.page`
  - gradepage.js -> `https://www.edline.net/pages/*/*`
3. Either:
  - Paste the file below the header and delete the @require
  - Clone the repository and change the @require to the file location
4. Visit edline and click refresh

```
// ==UserScript==
// @name         Better edline -> insert name here
// @namespace    http://github.com/John2143658709/
// @version      0.1
// @description  An edline manager
// @author       John2143658709
// @match        insert match text defined above here
// @grant        none
// @require      file:///PATH/TO/YOUR/FILE/HERE
// ==/UserScript==
```
One Way Reddit -> onewayreddit.js
=================================

####Type: Userscript
#####Tested in chrome with ecmascript5 using tampermonkey
####Details:
- Click the rank button on reddit to hide submissions.
- `b` to reload the plugin (for use with RES infinite mode
- `d` to temporarily unhide all hidden submissions

####Installation
1. Create a userscript with a with the header

```
// ==UserScript==
// @name         One way reddit
// @namespace    http://github.com/John2143658709/
// @version      0.1
// @description  click rank to hide
// @author       John2143658709
// @match        http://www.reddit.com/
// @grant        none
// ==/UserScript==
```
2. Paste the script below the header
