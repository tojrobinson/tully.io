(function() {
   var canvas = document.getElementById('title-canvas');

   if (canvas.getContext) {
      var ctx = canvas.getContext('2d'),
          gridX = 345,
          gridY = 110,
          b = 13, // blockSize 15 default
          pixels = [],
          pixel = function(x, y, colour) {
             return {x: x, y: y, colour: colour};
          },
          defaultColour = '#4d70ea',
          colours = ['blue', 'green', 'orange', 'yellow', 'grey', 'black', 'purple', 'red'],
          addPixel = function(x, y, colour) {
             if (colour && (x >= 0) && (x < gridX) && (y >= 0) && (y < gridY)) {
                pixels.push(pixel(x, y, colour));
             }
          },
          drawBlock = function(x, y, colour) {
             ctx.fillStyle = colour;
             ctx.fillRect(x, y, b, b);
          },
          symbols = {},
          paintGrid = function() {
             for (var i = 0; i < pixels.length; ++i) {
                var p = pixels[i];
                drawBlock(p.x, p.y, p.colour);
             }
          },
          clearCanvas = function() {
             ctx.save();
             ctx.setTransform(1, 0, 0, 1, 0, 0);
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.restore();
          },
          titleEffects = {
             liquidFill: function(colour) {
                for (var i = 0; i < pixels.length; ++i) {
                   (function(i) {
                      setTimeout(function() {
                         pixels[i].colour = colour;
                         paintGrid();
                      }, i*10);
                   }(i));
                }
             }
          };

          canvas.addEventListener('mouseover', function() {
             titleEffects.liquidFill('black');
          });

          canvas.addEventListener('mouseout', function() {
             titleEffects.liquidFill(defaultColour);
          });

          symbols.t = function(x, y, c) {
             addPixel(x + b, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*2, y, c);

             y += b;
             addPixel(x + b, y, c);

             y += b;
             addPixel(x + b, y, c);

             y += b;
             addPixel(x + b, y, c);
             addPixel(x + b*2, y, c);
          }

          symbols.u = function(x, y, c) {
             y += b*2;

             addPixel(x, y, c);
             addPixel(x + b*2, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b*2, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*2, y, c);
          }

          symbols.l = function(x, y, c) {
             addPixel(x, y, c);
             addPixel(x, y+b, c);
             addPixel(x, y+b*2, c);
             addPixel(x, y+b*3, c);
             addPixel(x, y+b*4, c);
          }

          symbols.y = function(x, y, c) {
             y = y + b*2;

             addPixel(x, y, c);
             addPixel(x + 2*b, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + 2*b, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + 2*b, y, c);

             y += b;
             addPixel(x + 2*b, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + 2*b, y, c);
          }

          symbols.dot = function(x, y, c) {
             addPixel(x, y, c);
          }

          symbols.i = function(x, y, c) {
             addPixel(x, y, c);
             addPixel(x, y + b*2, c);
             addPixel(x, y + b*3, c);
             addPixel(x, y + b*4, c);
          }

          symbols.o = function(x, y, c) {
             y += b*2;

             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*2, y, c);

             y += b;
             addPixel(x ,y, c);
             addPixel(x + b*2, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*2, y, c);
          }

          symbols.r = function(x, y, c) {
             y += 2*b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + 2*b, y, c);

             y += b;
             addPixel(x, y, c);

             y += b;
             addPixel(x, y, c);
          }

          symbols.skull = function(x, y, c) {
             addPixel(x+b, y, c);
             addPixel(x+b*2, y, c);
             addPixel(x+b*3, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b*2, y, c);
             addPixel(x + b*4, y, c);

             y += b;
             addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*3, y, c);
             addPixel(x + b*4, y, c);

             y += b;
             addPixel(x + b, y, c);
             addPixel(x + b*3, y, c);

             y += b;
             //addPixel(x, y, c);
             addPixel(x + b, y, c);
             addPixel(x + b*3, y, c);
             //addPixel(x + b*4, y, c);
          }

          symbols.slash = function(x, y, c) {
            addPixel(x + 4*b, y, c);
            addPixel(x + 3*b, y + b, c);
            addPixel(x + 2*b, y + b*2, c);
            addPixel(x + 1*b, y + b*3, c);
            addPixel(x, y + b*4, c);
          }

          symbols.t(0, 0, defaultColour);             // t
          symbols.u(b*3 + b, 0, defaultColour);       // u
          symbols.l(b*3*2 + b*2, 0, defaultColour);   // l
          symbols.l(b*3*3 + b, 0, defaultColour);     // l
          symbols.y(b*3*4, 0, defaultColour);         // y
          //symbols.dot(b*3*5 + b, b*4, 'black');       // .
          //symbols.i(b*3*5 + b*3, 0, defaultColour);   // i
          //symbols.o(b*3*6 + b*2, 0, defaultColour);   // o
          //symbols.skull(b*3*5 + b, 0, 'black');       // '_'

          paintGrid();
   }
}());
