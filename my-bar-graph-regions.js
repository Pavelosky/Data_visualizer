function BarGraphRegions(){
    var data;
    var LIST_OF_REGIONS = [];
    var bars = [];


    this.name = 'Life Expectancy per region per year';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'Life Expectancy per region per year';

    // Title to display above the plot.
    this.title = 'Life Expectancy per region per year';

    this.xAxisLabel = 'Region';
    this.yAxisLabel = 'Age';

    let marginSize = 45;
    
    this.layout = {
        marginSize: marginSize,
    
        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2 - 80,
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
        data = loadTable("data/life-expectancy/Life Expectancy at Birth - https___data.world_datasets_time-series.xlsx - Life Expectancy at Birth.csv", "csv", "header");
    }

    this.setup = function(){

        const regions = data.getColumn('Region');

        LIST_OF_REGIONS = regions.filter((region, index) => {
            return regions.indexOf(region) === index && region != '';
        });

        this.createBars(1960);
        this.prepareSelect();
        this.addListenerToYearsChanging();
    }

    this.createBars = function(year) {
        let offset = 75;

        LIST_OF_REGIONS.forEach((region) => {
            const allRegionRows = data.findRows(region, 'Region');

            const filteredRows = allRegionRows.filter((row) => {
                return row.obj.Year === year + '';
            })

            let sum = 0;
            filteredRows.forEach((row) => {
                sum += Number(row.obj['Life Expectancy']);
            });

            const avg = sum / filteredRows.length;

            bars.push(new Bar(avg, this.layout.leftMargin + offset, this.layout.bottomMargin, region));

            offset += 75;
        });
    }

    this.draw = function(){
        background(255);

        textSize(35)
        text(this.title, width/2, 50)

        bars.forEach((bar) => {
            bar.show();
        });

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        textSize(25)
        drawAxisLabels(this.xAxisLabel,
                    this.yAxisLabel,
                    this.layout);
    }

    this.addListenerToYearsChanging = function(){
        this.select.elt.addEventListener('change', (e) => {
            year = e.target.value;
            bars = [];
            this.createBars(year);
        });
    }


    this.prepareSelect = function(){
        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(350, 40);
    
        for(let i = 1960; i<= 2015; i++) {
            const yearOption = document.createElement('option');
            yearOption.setAttribute('value', i);
            yearOption.innerHTML = i;
    
            this.select.elt.appendChild(yearOption);
        }
    }

    this.destroy = function() {
        this.select.remove();
        bars = [];
    }
}

function Bar(h, x, y, country){
    this.h = map(h, 0, 90, 0, 255)
    this.width = 40
    this.pos = createVector(x,y)
    this.clr = color(200, 100, 150)
    this.country = country;

    this.show = function(){
        fill(100 + h, 100, this.h)
        rect(this.pos.x, this.pos.y - this.h, this.width, this.h)

        this._showText()
    }

    this._showText = function() {
        fill(50);
        textSize(15);
        textAlign(LEFT);
        text(country, this.pos.x, this.pos.y + 20, this.width);
        textAlign(CENTER);
        text(int(h), this.pos.x + this.width / 2, this.pos.y - this.h - 10);
    }
};