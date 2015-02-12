/* =========================================================================
 *
 * main.js
 *
 *  Handles running tests
 *
 * ========================================================================= */
// UTIL
// --------------------------------------
function testIntersection(rect1, rect2) {
    if (rect1.x < (rect2.x + rect2.width) && (rect1.x + rect1.width) > rect2.x &&
        rect1.y < (rect2.y + rect2.height) && (rect1.y + rect1.height) > rect2.y){
        return true;
    } else { 
        return false;
    }
}

function generateShape (){
    return {
        x: (CONFIG.shapeSize + (Math.random() * (CONFIG.width - (CONFIG.shapeSize*2))))|0,
        y: (CONFIG.shapeSize + (Math.random() * (CONFIG.height - (CONFIG.shapeSize*2))))|0,
        width: CONFIG.shapeSize,
        height:CONFIG.shapeSize
    };
}

function generateData ( options ){
    // generate random squares
    var data = [];

    var rect1,rect2;
    var i = 0;

    // add initial rect
    data.push(generateShape());

    var DELAY = 1;

    function attemptToPlace(){
        var renderIt = true;
        rect1 = generateShape();

        _.each(data, function(rect2){ 
            // Test intersection
            if(testIntersection(rect2,rect1)){
                renderIt = false;
                return false;
            } 
        });

        // if we can't render, do this attempt again
        if(renderIt === false){ 
            return attemptToPlace();
        }
        else { 
            // we can render, add it and render
            data.push(rect1);

            if(data.length >= CONFIG.numShapes){ 
                return false;
            }
            else { 
                return attemptToPlace();
            }
        }
    }
    // generate / place data
    attemptToPlace();

    // return it
    return data;
}


// --------------------------------------
// 
// CONFIG
//
// --------------------------------------
var CONFIG = {
    height: 400,
    width: 800,
    numShapes: 40,
    shapeSize: 26
};

// --------------------------------------
//
// Flash test 1
//
// --------------------------------------
function runFlashTest1 (options) {
    options = options || {};

    // prepare svg
    var $testEl = d3.select('#test-1');
    $testEl.attr({ width: CONFIG.width, height: CONFIG.height });

    // remove existing els
    $testEl.empty();
    d3.select('#test-1-shapes').remove();

    var $shapes;

    // Generate a bunch of random squares

    $shapes = $testEl.append('g').attr({ 
        id: 'test-1-shapes',
        'class': 'test-shape-group' 
    });
    
    var data = generateData();

    // Draw rects
    _.each(data, function(d,i){
        var shape = 'rect';
        if(options.useCircles){
            if(Math.random() < 0.5){ shape = 'circle'; }
        }

        var attrs = {};
        var name = 'test-shape';
        attrs = {
            'class': i===0 ? name += ' selected' : name,
            width: d.width - 6,
            height: d.height - 6,
            x: d.x,
            y: d.y
        };

        // render it
        $shapes.append(shape)
            .attr(attrs);
    });
}
// run it
runFlashTest1();


// TEST 2 - Circles and squares
// --------------------------------------
function runFlashTest2 (options) {
    options = options || {};

    // prepare svg
    var $testEl = d3.select('#test-2');
    $testEl.attr({ width: CONFIG.width, height: CONFIG.height });

    // remove existing els
    $testEl.empty();
    d3.select('#test-2-shapes').remove();

    var $shapes;

    // Generate a bunch of random squares
    $testEl.empty();
    $shapes = $testEl.append('g').attr({ 
        id: 'test-2-shapes',
        'class': 'test-shape-group' 
    });
    
    var data = generateData();

    // Draw rects
    _.each(data, function(d,i){
        var shape = 'rect';

        // first is always a rect
        if(i>0 && Math.random() < 0.3){ shape = 'circle'; }

        var attrs = {};
        var name = 'test-shape';
        
        if(shape === 'rect'){
            attrs = {
                'class': name,
                width: d.width - 6,
                height: d.height - 6,
                x: d.x,
                y: d.y
            };

        } else if (shape === 'circle'){
            attrs = {
                'class': name + ' selected', 
                r: d.width - 16,
                cx: d.x,
                cy: d.y
            };
        }

        if(i===0){ attrs['class'] = name + ' selected'; }
        console.log(i);


        // render it
        $shapes.append(shape)
            .attr(attrs);
    });
}
// run it
runFlashTest2();


// --------------------------------------
//
// Setup functions to run tests
//
// --------------------------------------
d3.select('#button-flash-test1').on('click', function(d){
    // do it on the next paint
    requestAnimationFrame(function renderIt(){

        d3.select('#test-1-shapes').style({ display: 'block' });

        // setting to 100ms may cause it to be slightly over 100ms, so set the
        // time to be a little less
        setTimeout(function(){
            d3.select('#test-1-shapes').style({ display: 'none' });

            runFlashTest1();
        }, 84);

    });
});

d3.select('#button-flash-test2').on('click', function(d){
    // do it on the next paint
    requestAnimationFrame(function renderIt(){

        d3.select('#test-2-shapes').style({ display: 'block' });

        // setting to 100ms may cause it to be slightly over 100ms, so set the
        // time to be a little less
        setTimeout(function(){
            d3.select('#test-2-shapes').style({ display: 'none' });

            runFlashTest2();
        }, 84);

    });
});
