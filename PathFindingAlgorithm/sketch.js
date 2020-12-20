



function removeFromArray (arr, elt) {  // this function removes a elt in an array called arr
   for (var i = arr.length -1; i >= 0; i--){ // loop through the array backwards
       if (arr[i] == elt){ // is the object in this index is equal to elt
           arr.splice(i,1); // remove object from the array
       }
   }
    
}
function heuristic (a,b){
    return dist(a.i,a.j,b.i,b.j) * 10*w; // calculate the straight light distance from point a to point b
}
var cols = 20; // Grid map with 50  columns
var rows = 20; // Grid map with 50 rows
var grid = new Array(cols); // Make a grid array what will contain the amount of spots in the array
var w,h; // w and h variable describes the pixel width and height of each spot in the grid
var path = []; // holds the path from the starting point to the ending point


var openSet = []; // make a variable the holds all of the spots that may be explored
var closedSet = []; // stores all of the nodes that have been explored 
var start; // start spot
var end; // end spot
var startFinding = false;  // is a key is pressed start finding will be true
//var done = 0; // represents the end of the search and looping can stop


// create a Spot object
function Spot (i,j) {
    this.i = i; // i (column) position
    this.j = j; // j (row) position
    this.f = 0; //  f score (distance away from the starting spot)
    this.g = 0; //  g score (distance away from the end spot)
    this.h = 0; // h score (g_score + f_score) 
    this.neighbours = []; // surrounding tiles
    this.parent = null; // parent spot that discovered the spot
    this.wall = false; // if true, the spot is an obstacle. If false, the object is walkable
    
    //if (random(1) < 0.3)        // 30% of the time this will be true
        //this.wall = true;       // this spot is a wall 30% of the time
    // Displays the spot on the canvas
    this.show = function (col) {
        if (this.wall == true)          // if this spot is a wall
            fill(0);            // color it black
        else     
            fill(col); // color the spot     
        noStroke(); // remove the outline stroke for the spot
        rect(this.i * w, this.j * h, w-1, h-1); // draw the rectangle for the spot
        
    }
    
    //Adds the adjacent neighbours in the spot
    this.addNeighbours = function (grid){ 


        if (i < cols - 1){                      // if this spot is not at the right end of the grid
            this.neighbours.push(grid[i + 1][j]);   // Add the neighbour to the right
            if (j < rows - 1)
                this.neighbours.push(grid[i+1][j+1]);   // Add neighbour to the bottom right
            if (j > 0)
                this.neighbours.push(grid[i+1][j-1]);   // Add neighbour to the top right
        }

        if (i > 0){                                 // if this spot is not at the left end of the grid
            this.neighbours.push(grid[i - 1] [j]);  // Add the neighbour to the left
            if (j < rows - 1)                           // if this spot is not at the bottom
                this.neighbours.push(grid[i-1][j+1]);   // Add neighbour to the bottom left
            if (j > 0)                              // if this spot is not at the top
            this.neighbours.push(grid[i-1][j-1]);   // Add neighbour to the top left
        }
        
        if (j < rows - 1){                          // if this spot is not at bottom of the grid
            this.neighbours.push(grid[i] [j + 1]);  // add the neighbour to the bottom       
        }
        
        if (j > 0){                                 // if this spot is not at the top of the grid
            this.neighbours.push(grid[i] [j - 1]);  // add the neigbour to the top
        }
        
    }
}
function mousePressed()
{
    
    
}

function keyPressed()
{
        if (keyCode === ENTER)
            startFinding = true;       // start path finding
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
            grid[i][j] = new Spot (i,j);    // make a new Spot object for all i and j in grid
        }
    }
    
    for (var i = 0; i < cols; i++){     // for all columns 
        for(var j = 0; j < rows; j++){  // for all rows
            grid[i][j].addNeighbours(grid); //add the neighbours for each spote
        }
    }
    
    
    
    start = grid[0][0]; // start spot is at position (0,0)
    end = grid[19][19]; // end spot is at (cols-1, rows-20).
    
    openSet.push(start);  // put the starting spot at the beginning of the open set.
    for (var i = 0; i < cols; i++)
    
        for (var j = 0; j < rows; j++)
        {
            grid[i][j].h = heuristic(grid[i][j], end);  // make the heuristic (dist to end) for all spots
            grid[i][j].f = grid[i][j].g + grid[i][j].h; // compute the f score for all spots 
        }  
        
}


function draw () {

    if (mouseX < 400 && mouseY < 400 && mouseIsPressed)     // if the mouse is currentply pressed and is within the grid boundary
    {
        for (var x = 0; x < 20; x++)
        {
            for(var y = 0; y < 20; y++)
            {
                if (grid[x][y].i*w < mouseX && (grid[x][y].i*w + w) > mouseX && grid[x][y].j*h < mouseY && (grid[x][y].j*h + h) > mouseY) // if the mouse if pressed over a box
                    grid[x][y].wall = true;   // make it a wall
            }
        }
    }
   
    if (openSet.length > 0 && startFinding == true){ // if there are still spots in the open set and a key has been pressed
    // we can keep trying to find a solution
        var winner = 0;         // create a winner spot
        for (var i = 0; i < openSet.length; i++){ // for each i in open set
            if (openSet[i].f < openSet[winner].f) // if this spot in the openSet has a lower f score
                winner = i; // make it the winner Spot
        }
        var current = openSet[winner];          // is the winner spot is our end spot
        if (current == end) {                   // the algorithim is done
            noLoop()                            // do not loop anymore.
            console.log("DONE like dinner!");

        }
            //Find the path
            var temp = current;                 // create a temporary spot object
            path.push(temp);                    // put it at the end of the path
            while (temp.parent){                // if our temp spot has a parent
                path.push(temp.parent);         // put that parent spot at the end of the path
                temp = temp.parent;             // temp spot is now equal to the parent spot
            }
            
            
        
        
        removeFromArray(openSet, current);      // remove current spot from the open set because it has been explored
        closedSet.push(current);                // put the current spot at the end of the closed set

        
        var neighbours = current.neighbours;    // make a variable for the neighbours of current
        for (var i = 0; i < neighbours.length; i++){    //  for each neighbour of the current spot
            var neighbour = neighbours[i];      // pick the first neighbour of the current spot
            
            
            // calculating the G-score for the neighbours
            if (!closedSet.includes(neighbour) && neighbour.wall == false){  // if this neighbour is not in the closed set && the neighbour is not a wall

                if (neighbour.i == current.i || neighbour.j == current.j)       // if this is not a diagonal neighbour
                    var tempG = current.g + 10*w;          // tempG variable holds the g-score of the current spot plus 10
                else 
                    var tempG = current.g + 14*w;           // tempG variable holds the g-score of the current spot plus 14 because travelling diagonally is longer distance by root(2)

                if (openSet.includes(neighbour) && tempG < neighbour.g){    // if the neighbour is already in the open set AND it's G-score is higher that the newly calculated tempG
                    neighbour.g = tempG;                                    // then the new g-score of the neighbout is tempG
                    neighbour.parent = current;                             // the new parent is the current spot because it is a better path to that spot
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

    // visualize the path in green
    for (var i = 0; i < path.length; i++){ // for all spots in the path 
        path[i].show(color(0,255,0));       // display the color in green
    }
    path = [];


    // visualize the open set on the grid in black
    for (var i = 0; i < openSet.length; i++){ // for all i in the open set 
        openSet[i].show(color(255,255,255));  // display the color white
    }
    

    
    
    
}

