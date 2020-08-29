import React from 'react';

import '../css/App.css';
import '../css/PreviewCanvas.css';



class PreviewCanvas extends React.Component {

  constructor(props){
    super(props);

    this.canvasRefPreview = React.createRef();
    this.canvasImgRefPreview=React.createRef();
    this.customCanvasPreviewDivRef=React.createRef();
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOut=this.handleMouseOut.bind(this);
    
    //this.drawOnCanvas= this.drawOnCanvas.bind(this);
    this.canvasInit=this.canvasInit.bind(this);
    this.handleWindowResize=this.handleWindowResize.bind(this);
    this.drawFromRectArray=this.drawFromRectArray.bind(this);
   
    
    

    this.state={
      
      context:{},
      contextImg:{},
      currentStartX:null,
      currentStartY:null,
      offsetX:null,
      offsetY:null,
      isDragging:false,
      rectArray:this.props.componentList,
      canvasWidth:0,
      canvasHeight:0,
      refresh:true,
      currentRectColor:null,
      labelList:[],
      scalingCoEf:1
      
    }
  }


  randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`

 

  LabelingTextComponent=(refresh)=>{
  
        return(
        <div style={{backgroundColor:"red"}}>
          {
          
          this.state.rectArray.map((item,index)=>{
            
            return(
            <div 
              className="Label-preview" 
              key={index} 
              style={{top:item._height<0?this.state.offsetY+item._startY-20+item._height:this.state.offsetY+item._startY-20,
                      left:this.state.offsetX+item._startX+(item._width<0?item._width:0),
                      backgroundColor:index===this.props.selectedItemIndex?item._color:"rgba(255,255,255,.4)",
                      width:Math.abs(item._width)+2 //strokewidth is 2px
                    }}
            >
              <h4 className="Label-txt">{item._label.value}</h4>
                  

            </div>)
          }
          )}
 
        </div>
      )
      
  }

 
  handleMouseOut(e){
    console.log("reddd");
    e.preventDefault();
    e.stopPropagation();
    //this.setState({isDragging:false})
  }


  handleMouseDown(e){
    //console.log(e);
    
    const newColor=this.randomHsl();
    
    e.preventDefault();
    e.stopPropagation();

    var _startX = parseInt(e.clientX - this.state.offsetX);
    var _startY = parseInt(e.clientY - this.state.offsetY);
    
    this.setState({
      currentStartX:_startX,
      currentStartY:_startY,
      isDragging:true,
      currentRectColor:newColor
    })

    
  }


  handleMouseUp(e){
    console.log(e);
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.isDragging) {
      return;
  }

    var mouseX = parseInt(e.clientX - this.state.offsetX);
    var mouseY = parseInt(e.clientY - this.state.offsetY);
    // calculate the rectangle width/height based
    // on starting vs current mouse position
    var width = mouseX - this.state.currentStartX;
    var height = mouseY - this.state.currentStartY;


   
   

    //pushing into rectArray for future drawing and avoiding zero height and width
    if(!(height===0 || width===0)){

              var newRectItem = {
                                  _startX:this.state.currentStartX,
                                  _startY:this.state.currentStartY,
                                  _width:width,
                                  _height:height,
                                  _color:this.state.currentRectColor,
                                  _label:{},
                                  _previewSourceURL:this.clippingImagehandler(this.state.currentStartX,this.state.currentStartY,width,height)
                                }
              
              this.setState((prevState)=>({rectArray:[...prevState.rectArray,newRectItem]}))
              
             
      }
    
    // the drag is over, clearing the dragging flag
    this.setState({isDragging:false,
                   refresh:!this.state.refresh,

                   })

    
  }


  handleMouseMove(e){
    e.preventDefault();
    e.stopPropagation();

    // not dragging, just return
   

    // clear the canvas
    //this.state.context.clearRect(0, 0, 640, 425);

   
    //this.drawFromRectArray();
   
  }
  
  initRectCanvas=()=>{
    const canvas = this.canvasRefPreview.current;
    
    const context = canvas.getContext('2d');
    this.state.context.lineWidth=2;
    
    this.setState({

      context:context,
      offsetX:canvas.offsetLeft,
      offsetY:canvas.offsetTop
    },()=>{})

    //setTimeout(()=>{this.drawFromRectArray()},2000)

  }

  initImgCanvas=()=>{
    const canvasImg=this.canvasImgRefPreview.current;
    const contextImg=canvasImg.getContext('2d');
    var img = new Image(); 

    img.onload = ()=>{
        console.log(this);
        var coEf=this.props.scalingCoEf;
        contextImg.scale(coEf,coEf);
        contextImg.drawImage(img,0,0);
        this.drawFromRectArray()
        
    };

    img.src = this.props.imgUrl; 
  }

  canvasInit(){
   
    this.initImgCanvas();
    this.initRectCanvas();
    
    

  }

  handleWindowResize(){
    const canvas = this.canvasRefPreview.current;
    if(canvas===null) return;
    this.setState({
      offsetX:canvas.offsetLeft,
      offsetY:canvas.offsetTop,
      refresh:!this.state.refresh
    })
  }

  drawFromRectArray(){
    this.state.context.clearRect(0, 0, this.state.canvasWidth,this.state.canvasHeight);
    this.state.rectArray.forEach((item,index)=>{
      if(index===this.props.selectedItemIndex) {this.state.context.strokeStyle=item._color;}
      else {this.state.context.strokeStyle="rgba(255,255,255,.6)";}
      //console.log(item._color)
      var coEf=this.state.scalingCoEf;
      this.state.context.strokeRect(item._startX,item._startY, item._width,item._height);
    })

  }

  clippingImagehandler=(startX,startY,width,height)=>{
    //console.log(startX);
    const canvasImg=this.canvasImgRefPreview.current;
    const contextImg=canvasImg.getContext('2d');
    var ImageData = contextImg.getImageData(startX,startY,width,height);


        // create image element
        var MyImage = new Image();
        return this.getImageURL(ImageData,Math.abs(width),Math.abs(height));
      }

    getImageURL=(imgData, width, height)=>{
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      console.log(ctx);
      canvas.width = width;
      canvas.height = height;
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL(); 

    }

    findScalingCoEfficient=(imageWidth,imageHeight)=>{
      const canvasDiv=this.customCanvasPreviewDivRef.current;
      var margin=30;
      var divWithMarginWidth=canvasDiv.offsetWidth-margin;
      var divWithMarginHeight=canvasDiv.offsetHeight-margin;
      var widthCoEf=divWithMarginWidth/imageWidth;
      var heightCoEf=divWithMarginHeight/imageHeight;
      console.log(imageWidth)
      console.log(imageHeight)
      console.log(divWithMarginWidth)
      console.log(divWithMarginHeight)
      console.log(widthCoEf);
      console.log(heightCoEf);
      if(widthCoEf<heightCoEf) return widthCoEf;
      else return heightCoEf;
  
    }
 
  componentDidMount(){
    this.canvasInit();
    //this.drawFromRectArray();
    window.addEventListener("resize", this.handleWindowResize);
   
  }

  componentDidUpdate(prevProps,prevState){
    const canvas = this.canvasRefPreview.current;
    
   
    if(prevState.offsetX!==canvas.offsetLeft ){
      this.setState({offsetX:canvas.offsetLeft,refresh:!this.state.refresh})
    }

    if( prevState.offsetY!==canvas.offsetTop){
      this.setState({offsetY:canvas.offsetTop,refresh:!this.state.refresh})
    }
  }

  render(){
      return (
        <div className="Preview-canvas" ref={this.customCanvasPreviewDivRef}>
          <h4>back</h4>

          {this.LabelingTextComponent(this.state.refresh)}
         
          <canvas ref={this.canvasRefPreview} width={this.props.canvasWidth} height={this.props.canvasHeight} className="Canvas"/>
          <canvas ref={this.canvasImgRefPreview} width={this.props.canvasWidth} height={this.props.canvasHeight} className="Canvas-img"
                  
      />
         
           
        </div>
      );
  }
}

export default PreviewCanvas;
