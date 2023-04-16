function BubbleGraph(){

	var data;
	var bubbles = [];
	let years
	let yearString
	let marginSize = 35

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Household consumption of different food items by year';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'Household consumption of different food items by year';

    // Title to display above the plot.
    this.title = 'Household consumption of different food items by year';

	this.layout = {
		marginSize: marginSize,
	
		// Locations of margin positions. Left and bottom have double margin
		// size due to axis and tick labels.
		leftMargin: marginSize * 2,
		rightMargin: width - marginSize,
		topMargin: marginSize,
		bottomMargin: height - marginSize * 2,
		pad: 5,
	
		plotWidth: function() {
		  return this.rightMargin - this.leftMargin;
		},
	
		plotHeight: function() {
		  return this.bottomMargin - this.topMargin;
		},
	
		// Boolean to enable/disable background grid.
		grid: true,
	
		// Number of axis tick labels to draw so that they are not drawn on
		// top of one another.
		numXTickLabels: 10,
		numYTickLabels: 8,
	  };

	this.preload = function(){
		data = loadTable("./data/food/foodData.csv", "csv", "header");
	}

	this.setup = function (){

		years = [];
		
		for(let i = 5; i < data.getColumnCount(); i++){

			let s = data.columns[i]
			years.push(s)
			
			let button = createButton(s)
			button.parent('year-div')
			
			button.mousePressed(function(){

				yearString = this.elt.innerHTML
				let yearIndex = years.indexOf(yearString);

				this.currentYear = yearString;

				for(var i = 0; i<bubbles.length;i++){
					bubbles[i].setYear(yearIndex)
				}
				
			})

		}

		for(var i = 0; i < data.getRowCount();i++){
			let r = data.getRow(i);
			let name = r.getString("L1")

			if(name != ""){
				
				let d = [];
				let val = []
			
				for(let j = 0; j < years.length; j++){
					val = Number(r.get(years[j]));
					d.push(val);
					
				}

				var b = new Bubble(name, d);
				b.setYear(0);
				bubbles.push(b);
			}
		}
		
	}

	this.destroy = function() {
		const yearDiv = document.getElementById('year-div');

		let yearDivCild = yearDiv.lastElementChild;
		while (yearDivCild) {
			yearDiv.removeChild(yearDivCild);
			yearDivCild = yearDiv.lastElementChild;
		}

		bubbles = [];
	};
	
	this.draw = function(){
		background(200)
		translate(width/2, height/2);
		textAlign(CENTER);
		textSize(30)
		text(1974, 0, -250)

		for(var i = 0; i < bubbles.length; i++){
			bubbles[i].update(bubbles);
			bubbles[i].show();
		}

		
	}

	
}

function Bubble(_name, _data)
{
    this.name = _name;
	this.pos = createVector(0,0);
	this.dir = createVector(0,0);
	this.id = randomID();

	this.data = _data;

	this.clr = color(random(0,255),random(0,255),random(0,255))
	this.size = 20;
	this.targetSize = this.size;



	this.show = function(){
        
		stroke(1)
		fill(this.clr);
		ellipse(this.pos.x, this.pos.y, this.size)
		noStroke()
		fill(15);
		textSize(15)
		text(this.name, this.pos.x, this.pos.y)
    
		
        this.pos.add(this.dir);

		if(this.size<this.targetSize){
			this.size += 1
		}
		else if (this.size>this.targetSize){
			this.size -= 1;
		}
	}

	this.setYear = function(year_index){
		let v = this.data[year_index]
		this.targetSize = map(v, 0, 3600, 5, 200)
	}

	this.update = function(_bubbles){
        this.dir = createVector(0,0)

		for(var i = 0; i < _bubbles.length; i++){
			if(_bubbles[i].id != this.id){

                let vect = p5.Vector.sub(this.pos, _bubbles[i].pos);
                let d = vect.mag();

                if(d < this.size/2 + _bubbles[i].size/2){
                    if(d == 0){
                        this.dir.add(p5.Vector.random2D())
                    }
                    else{
                    //console.log("collision")
                        this.dir.add(vect);
                    }
                }
			}
		}
        this.dir.normalize()
	}

}

function randomID(){
	let alpha = "abcdefghijklmnopqrstuvwxyz0123456789"
	let s = ""
	for(var i = 0; i < 10; i++){
		s += alpha[floor(random(0,alpha.length))];
	}
	return s
}
