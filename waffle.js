function DataWaffle(){

    var data;
    var waffles = [];
    var waffle;
    var days = [];

    let marginSize = 25
    
    this.name = 'What students eat throughout the week';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'Eating_habits';

    // Title to display above the plot.
    this.title = 'What students eat throughout the week';

    this.preload = function() {
        data = loadTable("./data/eating-habits/finalData.csv", "csv", "header");
    }

    this.setup = function() {

        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" 
                ];

        var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out', 'Skipped meal', 'Left overs' ]

        for(var i = 0; i < days.length; i++){
            if(i < 4)
                waffles.push(new Waffle(80 + i * 220, 100, 200, 200, 10, 10, data, days[i], values))
            else{
                waffles.push(new Waffle(80 + (i-4) *220, 340, 200, 200, 10, 10, data, days[i], values))
            }
        }
    }

    this.draw = function() {
        background(255);

        textSize(25)
        text(this.title, 250, 50)

        for(var i = 0; i < waffles.length; i++){
            waffles[i].draw();
        }
        for(var i = 0; i < waffles.length; i++){
            waffles[i].checkMouse(mouseX, mouseY);
        }
    }
}

function Box (x, y, width, height, category){
    
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    
    
    this.category = category;
    
    this.mouseOver = function(mouseX, mouseY){
        //checking if pointer is over the box
        if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height){
            return this.category.name
        }
        return false
    }
    
    this.draw = function(){
        fill(category.color );
        stroke(1)
        rect(this.x, this.y, this.width, this.height);
        
    }
}

function Waffle(x, y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues){
    
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.boxes_down = boxes_down;
    this.boxes_across = boxes_across;
    
    this.column = table.getColumn(columnHeading);
    this.possibleValues = possibleValues;

    colors = ["red", "green", "blue", "purple", "yellow", "orange"];
    
   
    let categories = []
    let boxes = []

    
    this.categoryLocation = function(categoryName){
        for(var i = 0; i < categories.length; i++){
            if(categoryName == categories[i].name){
                return i;
            }
        }
        return -1;
    }
    
    this.addCategories = function(){
        for(var i = 0; i < this.possibleValues.length; i++){
            categories.push({
                "name": this.possibleValues[i],
                "count": 0,
                "color": colors[i % colors.length]
            })
        }
        
        
        for(var i = 0; i < this.column.length; i++){
            var catLocation = this.categoryLocation(this.column[i])
            
            if(catLocation != -1){
                categories[catLocation].count++
            }
        }
        
        //go through the categories and add proportions
        
        for(var i = 0; i < categories.length; i++){
            categories[i].boxes = round((categories[i].count / this.column.length) * (boxes_down * boxes_across))
        }
        
    }
    
    this.addBoxes = function (){
        var currentCategory = 0;
        var currentCategoryBox = 0;
        
        var boxWidth = width / this.boxes_across;
        var boxHeight = height / this.boxes_down;
        
        for(var i = 0; i < this.boxes_down; i++){
            boxes.push([])
            for(var j = 0; j < this.boxes_across; j++){
                if(currentCategoryBox == categories[currentCategory].boxes){
                    currentCategoryBox = 0;
                    currentCategory++;
                }
                
                boxes[i].push(new Box(x + (j * boxWidth), y + (i * boxHeight), boxWidth, boxHeight, categories[currentCategory]));
                
                currentCategoryBox++;
            }
        }
    }
    
    //add Categories and boxes
    this.addCategories();
    this.addBoxes();
    
    this.draw = function(){
        for(var i = 0; i < boxes.length; i++){
            for(var j = 0; j < boxes[i].length; j++){
                if(boxes[i][j].category != undefined){
                    boxes[i][j].draw();
                }
            }
            fill(30)
            noStroke()
            textSize(15);
            textAlign(LEFT);
            text(columnHeading, this.x, this.y - 5)
        }

    }
    
    this.checkMouse = function(mouseX, mouseY){
        for(var i = 0; i < boxes.length; i++){
            for(var j = 0; j < boxes[i].length; j++){
                if(boxes[i][j] != undefined){
                    var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                    if(mouseOver){
                        push();
                        fill(0)
                        textSize(20);
                        var tWidth = textWidth(mouseOver);
                        textAlign(LEFT, TOP)
                        rect(mouseX, mouseY, tWidth +20, 40);
                        fill(255);
                        text(mouseOver, mouseX +10, mouseY +10);
                        pop();
                        break;
                    }
                }
            }
    
        }
    }     
}


