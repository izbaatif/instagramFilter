// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];


/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height + 80);
    
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(255);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);

    //keys for other filters
    textSize(20)
    text("Press i for invert filter", 20, imgIn.height + 20);
    text("Press g for greyscale filter", 20, imgIn.height + 50)
    
    noLoop();
}

/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}

function keyPressed()
{
  loop();
}

/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg);

  //Checks the keys pressed and calls functions accordingly
  if(keyIsPressed && keyCode == 73 ) //Invert on i
  {
    resultImg = invertFilter(img);
  } 

  if(keyIsPressed && keyCode == 71 ) //Greyscale on g
  {
    resultImg = greyscaleFilter(img);
  } 

  //returns the final image
  return resultImg;
}

function sepiaFilter(img)
{
  //Creates an image to output
  var imgOut = createImage(img.width, img.height);
    
  //Loas pixels of both input and output image
  imgOut.loadPixels();
  img.loadPixels();
    
  //Loops over output image
  for(var x=0; x<imgOut.width; x++)
  {
    for(var y=0; y<imgOut.height; y++)
    {
      
      //Gets each pixel 
      var index = ((img.width * y) + x) * 4;
      
      //Gets the old pixel values and calculates the new one
      var oldRed = img.pixels[index];
      var oldGreen = img.pixels [index + 1];
      var oldBlue = img.pixels [index + 2];
      
      var newRed = (oldRed * 0.393) + (oldGreen * 0.769) + (oldBlue * 0.189);
      var newGreen = (oldRed * 0.349) + (oldGreen * 0.686) + (oldBlue * 0.168);
      var newBlue = (oldRed * 0.272) + (oldGreen * 0.534) + (oldBlue * 0.131);
      
      //Applies the values on the image to be outputted
      imgOut.pixels[index] = newRed;
      imgOut.pixels[index + 1] = newGreen;
      imgOut.pixels[index + 2] = newBlue;
      imgOut.pixels[index + 3] = 255;
    }
  }
  
  //Updates the pixels and returns the image
  imgOut.updatePixels();
  return imgOut;
}


function darkCorners(img)
{
  //Creates an image to output
  var imgOut = createImage(img.width, img.height);
    
  //Loas pixels of both input and output image
  imgOut.loadPixels();
  img.loadPixels();
    
  //Loops over output image
  for(var x=0; x<imgOut.width; x++)
  {
    for(var y=0; y<imgOut.height; y++)
    {
      
      //Gets each pixel 
      var index = ((img.width * y) + x) * 4;
      
      //Gets the distance between the middle and the current pixel
      var distanceImg = dist(x , y , imgOut.width/2 , imgOut.height/2);
      
      //Gets the previous value of pixels
      var oldRed = img.pixels[index];
      var oldGreen = img.pixels [index + 1];
      var oldBlue = img.pixels [index + 2];
    
    
      //Doesnt change anything if distance is less than 300
      if(distanceImg < 300)
      {
        //Applies the values on the image to be outputted
        imgOut.pixels[index] = oldRed*1;
        imgOut.pixels[index + 1] = oldGreen*1;
        imgOut.pixels[index + 2] = oldBlue*1;
        imgOut.pixels[index + 3] = 255;
      }
      
      //If distance is between 300 and 450 updates values
      else if(distanceImg > 300 && distanceImg < 450)
      {
        //Adds a constrain on the image
        var index = constrain(index, 0, img.pixels.length - 1); 
        
        //Calculates the darkness
        var dynLum = map(distanceImg, 300, 450, 1,  0.4);
        
        //Applies the values on the image to be outputted
        imgOut.pixels[index] = oldRed*dynLum;
        imgOut.pixels[index + 1] = oldGreen*dynLum;
        imgOut.pixels[index + 2] = oldBlue*dynLum;
        imgOut.pixels[index + 3] = 255;
      }
      
      //If distance is greater than 450 updates values
      else
      {
        //Adds a constrain on the image
        var index = constrain(index, 0, img.pixels.length - 1); 
        
        //Calculates the darkness
        var dynLum = map(distanceImg, 450, imgOut.width, 0.4,  0);
        
        //Applies the values on the image to be outputted
        imgOut.pixels[index] = oldRed*dynLum;
        imgOut.pixels[index + 1] = oldGreen*dynLum;
        imgOut.pixels[index + 2] = oldBlue*dynLum;
        imgOut.pixels[index + 3] = 255;
      }

    }
  }
  
  //Updates the pixels and returns the image
  imgOut.updatePixels();
  return imgOut;
}

function radialBlurFilter(img)
{
    //Creates an image to output
    var imgOut = createImage(img.width, img.height);
    
    //Calls the blur filter on the image and returns it
    imgOut = blur(img);
    return imgOut;
}

function borderFilter(img)
{
  //Creates a graphic
  var buffer = createGraphics(img.width, img.height);
  
  //Draws the input image on it
  buffer.image(img,0,0, img.width, img.height)
  
  //Adds two rectangles, a rounded and a normal one
  buffer.noFill();
  buffer.strokeWeight(40);
  buffer.stroke(255);
  buffer.rect(0,0,img.width,img.height,50)
  buffer.strokeWeight(40)
  buffer.rect(0,0,img.width,img.height, 50)
  
  //returns the graphic
  return buffer;
}

function invertFilter(img)
{
  //Creates an image to output
  var imgOut = createImage(img.width, img.height);
    
  //Loas pixels of both input and output image
  imgOut.loadPixels();
  img.loadPixels();
    
  //Loops over output image
  for(var x=0; x<imgOut.width; x++)
  {
    for(var y=0; y<imgOut.height; y++)
    {
      //Gets each pixel 
      var index = ((img.width * y) + x) * 4;
      
      //Calculates the previous values
      var oldRed = img.pixels[index];
      var oldGreen = img.pixels [index + 1];
      var oldBlue = img.pixels [index + 2];
    
      //Calculates and applies the values on the image to be outputted
      imgOut.pixels[index] = 255 - oldRed;
      imgOut.pixels[index + 1] = 255 - oldGreen;
      imgOut.pixels[index + 2] = 255 - oldBlue;
      imgOut.pixels[index + 3] = 255;
    }
  }
  
  //Updates the pixels and returns the image
  imgOut.updatePixels();
  return imgOut;
}

function greyscaleFilter(img)
{
 //Creates an image to output
 var imgOut = createImage(img.width, img.height);
    
 //Loas pixels of both input and output image
 imgOut.loadPixels();
 img.loadPixels();
   
 //Loops over output image
 for(var x=0; x<imgOut.width; x++)
 {
   for(var y=0; y<imgOut.height; y++)
   {
     
    //Gets each pixel 
    var index = ((img.width * y) + x) * 4;
      
     //Calculates the previous values
    var r = img.pixels[index];
    var g = img.pixels [index + 1];
    var b = img.pixels [index + 2];

    //Calculates the mean 
    var grey = (r+g+b)/3
    
    //Applies the values on the image to be outputted
    imgOut.pixels[index] = grey;
    imgOut.pixels[index + 1] = grey;
    imgOut.pixels[index + 2] = grey;
    imgOut.pixels[index + 3] = 255;
    }
  }
  
  //Updates the pixels and returns the image
  imgOut.updatePixels();
  return imgOut;
}

function blur(img){
  //Creates an image to output
  var imgOut = createImage(img.width, img.height);

  //Gets the size of the blur matrix
  var matrixSize = matrix.length
    
  //Loas pixels of both input and output image
  imgOut.loadPixels();
  img.loadPixels();
    
  //Loops over output image
  for(var x=0; x<imgOut.width; x++)
  {
    for(var y=0; y<imgOut.height; y++)
    {
      
      //Gets each pixel 
      var index = ((img.width * y) + x) * 4;
      
      //Applies convulation on image
      var c = convolution(x, y, matrix, matrixSize , img);
      
      //Calculates old values
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];
      
      //Initially sets the dynBlur as 0
      var dynBlur = 0;
      
      //Checks if mouse click is on the left image
      if(mouseIsPressed && mouseX<imgIn.width && mouseY<imgIn.height)
      {
        //Calculates distance between mouse position and current pixel
        var distanceCalc = dist(mouseX + imgIn.width, mouseY, x, y);
        //Maps the value between 100 and 300
        var mapDist = map(distanceCalc , 0, imgIn.width + imgIn.height , 100, 300);
        //Maps 100 and 300 to 0 and 1
        var mapX= map(mapDist, 100, 300 , 0, 1);
        //Constrains the value and sets that as dynBlur
        dynBlur = constrain(mapX, 0, 1);
      }

      //if mouse click isnt on left image set the blur as 0
      else if(mouseIsPressed && mouseX > imgIn.width && mouseY > imgIn.height)
      {
        dynBlur = 0;
      }

      //Calculates and applies the values on the image to be outputted
      imgOut.pixels[index + 0] = c[0] * dynBlur + r*(1-dynBlur);
      imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
      imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1 - dynBlur);
      imgOut.pixels[index + 3] = 255;
      }
  }

  //Updates the pixels and returns the image
  imgOut.updatePixels();
  return imgOut;
}
/////////////////////////////////////////////////////////////////////////
function convolution(x, y, matrix, matrixSize, img) {
    
    //Sets the totals as 0
    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;
    
    var offset = floor(matrixSize/2);
    
    //Loops over matrix
    for(var i=0; i<matrixSize; i++)
    {
      for(var j=0; j<matrixSize; j++)
      {
        //Calculates xloc and yloc
        var xloc = x + i - offset;
        var yloc = y + j - offset;
        
        var index = ((img.width * yloc) + xloc ) * 4;
        
        index = constrain(index, 0, img.pixels.length - 1);
        
        //Calculates the colours
        totalRed += img.pixels[index] * matrix[i][j];
        totalGreen += img.pixels[index + 1] * matrix[i][j];
        totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
    }
    
    //Returns the totals calculated
    return [totalRed, totalGreen, totalBlue]
}
