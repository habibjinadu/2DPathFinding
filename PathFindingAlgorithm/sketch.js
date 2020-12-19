


function removeFromArray (arr, elt) {  // this function removes a elt in an array called arr
   for (var i = arr.length -1; i >= 0; i--){ // loop through the array backwards
       if (arr[i] == elt){ // is the object in this index is equal to elt
           arr.splice(i,1); // remove object from the array
       }
   }
    
}

function heuristic (a,b){
    return dist (a.i,a.j,b.i,b.j); // calculate the straight light distance from point a to point b
}
var cols = 50; // Grid map with 50  columns
var rows = 50; // Grid map with 50 rows
var grid = new Array(cols); // Make a grid array with the amount of entries is equal to the number of columns
var w,h; // w and h variable describes the pixel width and height of each spot in the grid
var path = []; // holds the path from the starting point to the ending point


var openSet = []; // make a variable the holds all of the spots that may be explored
var closedSet = []; // stores all of the nodes that have been explored 
var start; // start spot
var end; // end spot
var done = 0; // represents the end of the search 


// create a Spot object
function Spot (i,j) {
    this.i = i; // i (column) position
    this.j = j; // j (row) position
    this.f = 0; //  f score (distance away from the starting spot)
    this.g = 0; //  g score (distance away from the end spot)
    this.h = 0; // h score (g_score + f_score) 
    this.neighbours = []; // surrounding tiles
    this.parent = null; // parent spot that discovered the spot
    
    // Displays the spot on the canvas
    this.show = function (col) {
        fill(col); // color the spot
        noStroke(); // remove the outline stroke for the spot
        rect(this.i * w, this.j * h, w-1, h-1); // draw the rectangle for the spot
        
    }
    
    //Adds the adjacent neighbours in the spot
    this.addNeighbours = function (grid){ 


        if (i < cols - 1){                      // if this spot is not at the right end of the grid
        this.neighbours.push(grid[i + 1][j]);  // Add the neighbour to the left
        }
        if (i > 0){                                 // if this spot is not at the left end of the grid
            this.neighbours.push(grid[i - 1] [j]);  // Add the neighbout to the left
        }
        
        if (j < rows - 1){                          // if this spot is not at bottom of the grid
            this.neighbours.push(grid[i] [j + 1]);  // add the neighbour to the bottom       
        }
        
        if (j > 0){                                 // if this spot is not at the top of the grid
            this.neighbours.push(grid[i] [j - 1]);  // add the neigbour to the top
        }
        
    }
}
function setup (){
    
    createCanvas(400,400); //create a screen with 400 by 400 pixels
    background(0); // background color is black
    console.log('A*'); 
    h = height/rows; // box height is screen height / rows
    w = width/cols; // box width is screen width / columns
    
    // Making a 2D array of spots
    for (var i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }
    console.log(grid);
    // Making a Spot object for each 2d array.
    for (var i = 0; i < cols; i++){         // for each i in columns
        for(var j = 0; j < rows; j++){      // for each j in rows
            grid[i][j] = new Spot (i,j); // make a new Spot object for all i and j in grid
        }
    }
    
    for (var i = 0; i < cols; i++){     // for all columns 
        for(var j = 0; j < rows; j++){  // for all rows
            grid[i][j].addNeighbours(grid); //add the neighbours for each spote
        }
    }
    
    
    
    start = grid[0][0]; // start spot is at position (0,0)
    end = grid[cols - 1][rows -20]; // end spot is at (cols-1, rows-20)
    
    openSet.push(start);  // put the starting spot at the beginning of the open set
}

function draw () {
    
    if (openSet.length > 0 && done == 0){ // is there are still spots in the open set
    // we can keep trying to find a solution
        var winner = 0;         // create a winner spot
        for (var i = 0; i < openSet.length; i++){ // for each i in open set
            if (openSet[i].f < openSet[winner].f) // if this spot in the openSet has a lower f score
                winner = i; // make it the winner Spot
        }
        var current = openSet[winner];          // is the winner spot is our end spot
        if (current == end) {                   // the algorithim is done
            done = 1;                           // the algorithm is done and you can exit the if statement.
            console.log("DONE like dinner!");
            //Find the path
            var temp = current;                 // create a temporary spot object
            path.push(temp);                    // put it at the end of the path
            while (temp.parent){                // if our temp spot has a parent
                path.push(temp.parent);         // put that parent spot at the end of the path
                temp = temp.parent;             // temp spot is now equal to the parent spot
            }
            
            
        }
        
        removeFromArray(openSet, current);      // remove current spot from the open set because it has been explored
        closedSet.push(current);                // put the current spot at the end of the closed set
        //WE STOPPED HERE!!!!!!!!!!!!!!!!
        
        var neighbours = current.neighbours;    // make a variable for the neighbours of current
        for (var i = 0; i < neighbours.length; i++){    //  for each neighbour of the current spot
            var neighbour = neighbours[i];      // pick the first neighbour of the current spot
            
            
            // calculating the G-score for the neighbours
            if (!closedSet.includes(neighbour)){  // if this neighbour is not in the closed set
                var tempG = current.g + 1;          // tempG variable holds the g-score of the current spot plus 1 
                if (openSet.includes(neighbour) && tempG < neighbour.g){    // if the neighbour is already in the open set AND it's G-score is higher that the newly calculated tempG
                    neighbour.g = tempG;                                    // then the new g-score of the neighbout is tempG
                    neighbour.parent = current;                             // the new parent is the current node
                }
                else if (openSet.includes(neighbour) && tempG >= neighbour.g)
                {
                    // do nothing
                }

                else{                           // or else if the neighbour is not in the open set
                    neighbour.g = tempG;        // assign a g_score to the neighbour
                    neighbour.parent = current; // the current spot is the parent of this neighbour
                    openSet.push(neighbour);    // add the neighbour to the open set
                }
            
            
            neighbour.h = heuristic(neighbour,end); // calculate the h_score for the neighbour (distance between the neighbout and the end spot)
            neighbour.f = neighbour.g + neighbour.h; // calculate the f score of the neighbour (g_score + h_score)
            neighbour.parent = current; //  
            }
        }
    }else {
    // no solution 
    }
    
    // visualize the individual spots in the grid
    for (var i = 0; i < cols; i++){ // for all i in cols
        for (var j = 0; j < rows; j++){ // for all j in rows
            grid[i][j].show(color(150,134,1)); // each grid[i][j] is this color
        }
    }
    
    // visualize the closed set on the grid in red
    for (var i = 0; i < closedSet.length; i++){ // for all i in the closed set
        closedSet[i].show(color(255,0,0));
    }
    
    // visualize the open set on the grid in black
    for (var i = 0; i < openSet.length; i++){ // for all i in the 
        openSet[i].show(color(0,0,0));
    }
    
    // visualize the path in green
    for (var i = 0; i < path.length; i++){
        path[i].show(color(0,255,0));
    }
    
    
}

