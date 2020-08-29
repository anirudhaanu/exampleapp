import React from 'react';


import '../css/CustomCanvas.css';
import DropDownLabels from './DropDown'
import cross from '../icons/cross_black.png'



class CustomCanvas extends React.Component {

  constructor(props){
    super(props);

    this.canvasRef = React.createRef();
    this.canvasImgRef=React.createRef();
    this.customCanvasDivRef=React.createRef();
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseOut=this.handleMouseOut.bind(this);
    
    //this.drawOnCanvas= this.drawOnCanvas.bind(this);
    this.canvasInit=this.canvasInit.bind(this);
    this.handleWindowResize=this.handleWindowResize.bind(this);
    this.drawFromRectArray=this.drawFromRectArray.bind(this);
    this.sendListToParent=this.sendListToParent.bind(this);
    
    

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
      labelList:this.props.labelList,
      selectedBoxIndex:null,
      scalingCoEf:1
      
    }
  }


  randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`

  callBackFromDropDown =(newLabel)=> {this.setState((prevState)=>({labelList:[...prevState.labelList,newLabel]}))}
  callBackForSelectedLabel=(selected,index)=>{
          var temp=this.state.rectArray;
          temp[index]._label=selected;
          this.setState({rectArray:[...temp]})
  }
  
  bringLabelToFront=(index)=>{this.setState({selectedBoxIndex:index,refresh:!this.state.refresh})}

  LabelingTextComponent=(refresh)=>{
  
        return(
        <div style={{backgroundColor:"red"}}>
          {
          
          this.state.rectArray.map((item,index)=>{
            
            return(
            <div 
              className="Label" 
              key={index} 
              style={{top:item._height<0?this.state.offsetY+item._startY-10+item._height:this.state.offsetY+item._startY-10,
                      left:this.state.offsetX+item._startX+(item._width<0?item._width:0),
                      backgroundColor:item._color,
                      width:Math.abs(item._width)+2,//strokewidth is 2px
                      zIndex:index===this.state.selectedBoxIndex?100:10,
                      opacity:index===this.state.selectedBoxIndex?1:.8
                      
                      
                    }}
              onClick={()=>this.bringLabelToFront(index)}
            >
              
                  <DropDownLabels itemWidth={item._width}callBackForSelectedLabel={this.callBackForSelectedLabel} DropDownIndex={index} color={item._color} labelList={this.state.labelList} callBackToParent={this.callBackFromDropDown}/>
                  <img onClick={()=>this.crossClickHandler(index)} className="cross" src={cross}/>
            </div>)
          }
          )}
 
        </div>
      )
      
  }

  crossClickHandler=(deletedIndex)=>{
        var temp=this.state.rectArray;
        var filtered =temp.filter((item,index)=>{
              return index!=deletedIndex
        })
        this.setState({rectArray:filtered,refresh:!this.state.refresh},()=>{
          this.state.context.clearRect(0, 0, this.state.canvasWidth,this.state.canvasHeight);
          this.drawFromRectArray();
        })
        
  }

  sendListToParent(){
    this.props.callbackToParent(this.state.rectArray,this.state.canvasWidth,this.state.canvasHeight,this.state.scalingCoEf,this.state.labelList);
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
              
              this.setState((prevState)=>({rectArray:[...prevState.rectArray,newRectItem]}),this.sendListToParent)
              
             
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
    if (!this.state.isDragging) {
        return;
    }

    // get the current mouse position
    var mouseX = parseInt(e.clientX - this.state.offsetX);
    var mouseY = parseInt(e.clientY - this.state.offsetY);

    // Put your mousemove stuff here

    // clear the canvas
    this.state.context.clearRect(0, 0, this.state.canvasWidth,this.state.canvasHeight);

    // calculate the rectangle width/height based
    // on starting vs current mouse position
    var width = mouseX - this.state.currentStartX;
    var height = mouseY - this.state.currentStartY;

    // draw a new rect from the start position 
    // to the current mouse position
    this.drawFromRectArray();
    this.state.context.strokeStyle=this.state.currentRectColor;
    this.state.context.strokeRect(this.state.currentStartX, this.state.currentStartY, width, height);
  }
  
  initRectCanvas=()=>{
    const canvas = this.canvasRef.current;
    
    const context = canvas.getContext('2d');
    this.state.context.lineWidth=2;
    
    this.setState({

      context:context,
      offsetX:canvas.offsetLeft,
      offsetY:canvas.offsetTop
    })

  }

  initImgCanvas=()=>{
    const canvasImg=this.canvasImgRef.current;
    const contextImg=canvasImg.getContext('2d');
    var img = new Image(); 

    img.onload = ()=>{
        console.log(this);
        var coEf=this.findScalingCoEfficient(img.width,img.height)
        console.log(coEf)
        this.setState({canvasWidth:img.width*coEf,canvasHeight:img.height*coEf,scalingCoEf:coEf})
        contextImg.scale(coEf,coEf);
        contextImg.drawImage(img,0,0);
        this.drawFromRectArray();
        
    };

    img.src = this.props.imgUrl; 
  }

  canvasInit(){
   
    this.initImgCanvas();
    this.initRectCanvas();
    
    

  }

  handleWindowResize(){
    const canvas = this.canvasRef.current;
    if(canvas===null) return;
    this.setState({
      offsetX:canvas.offsetLeft,
      offsetY:canvas.offsetTop,
      refresh:!this.state.refresh
    })
  }

  drawFromRectArray(){
    
    this.state.rectArray.forEach((item)=>{
      this.state.context.strokeStyle=item._color;
      this.state.context.strokeRect(item._startX,item._startY, item._width,item._height);
    })

  }

  clippingImagehandler=(startX,startY,width,height)=>{
    //console.log(startX);
    const canvasImg=this.canvasImgRef.current;
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
    var coEf=1;
    const canvasDiv=this.customCanvasDivRef.current;
    var margin=30;
    var divWithMarginWidth=canvasDiv.offsetWidth-margin;
    var divWithMarginHeight=canvasDiv.offsetHeight-margin;
    if(imageWidth<=divWithMarginWidth && imageHeight<=divWithMarginHeight) return coEf;

    var widthCoEf=divWithMarginWidth/imageWidth;
    var heightCoEf=divWithMarginHeight/imageHeight;
    console.log(imageWidth)
    console.log(imageHeight)
    console.log(divWithMarginWidth)
    console.log(divWithMarginHeight)
    console.log(widthCoEf);
    console.log(heightCoEf);
    if(widthCoEf<heightCoEf) coEf= widthCoEf;
    else coEf=heightCoEf;

    return coEf;

  }
 
  componentDidMount(){
    this.canvasInit();
    window.addEventListener("resize", this.handleWindowResize);
   
  }

  componentDidUpdate(prevProps,prevState){
    const canvas = this.canvasRef.current;
   
    if(prevState.offsetX!=canvas.offsetLeft ){
      this.setState({offsetX:canvas.offsetLeft,refresh:!this.state.refresh})
    }

    if( prevState.offsetY!=canvas.offsetTop){
      this.setState({offsetY:canvas.offsetTop,refresh:!this.state.refresh})
    }
  }

  render(){
      return (
        <div className="Custom-canvas" ref={this.customCanvasDivRef}>
          <h4>back</h4>

                   {this.LabelingTextComponent(this.state.refresh)}
         
          <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} className="Canvas"
                  onMouseDown={e => this.handleMouseDown(e.nativeEvent)}
                  onMouseMove={e => this.handleMouseMove(e.nativeEvent)}
                  onMouseUp=  {e => this.handleMouseUp(e.nativeEvent)}
                  onMouseOut= {e=>  this.handleMouseOut(e.nativeEvent)}
                  
          />
          <canvas ref={this.canvasImgRef} width={this.state.canvasWidth} height={this.state.canvasHeight} className="Canvas-img"
                  
      />
         
           
        </div>
      );
  }
}

export default CustomCanvas;
