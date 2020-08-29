import React from 'react';

import '../css/App.css';
import CustomCanvas from './CustomCanvas'

import Preview from './Preview'
import arrow_forward from '../icons/arrow_forward.png'
import arrow_back from '../icons/arrow_back.png'

class App extends React.Component {

  constructor(props){
    super(props);

    this.callBackFromCustomCanvas=this.callBackFromCustomCanvas.bind(this);

    this.InputRef = React.createRef();
    

    this.state={

      
      file:null,
      imagePreviewUrl:null,
      showCanvas:false,
      rectArray:[],
      uploadComplete:false,
      showPreview:false,
      canvasWidth:null,
      canvasheight:null,
      scalingCoEf:1,
      labelList:[]
      
      
    }
  }
  
  callBackFromCustomCanvas(rectArray,canvasWidth,canvasHeight,scalingCoEf,labelList){
    //reconsole.log(rectArray);
        this.setState({rectArray:rectArray,canvasWidth:canvasWidth,canvasHeight:canvasHeight,scalingCoEf:scalingCoEf,labelList:labelList})
  }
  
  fileChangedHandler = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        rectArray:[],
        labelList:[]
      },()=>this.uploadHandler());
    }

    reader.readAsDataURL(file)
    
  }
  
  uploadHandler = () => {
    if(this.state.file===null){
      alert("Choose a file for upload");
      return;
    }
    console.log(this.state.imagePreviewUrl)
    this.setState({showCanvas:true,uploadComplete:true})
  }

  submitHandler = () => {
    if(this.state.rectArray.length<=0) {
      alert("Draw a bounding box");
      return;
    }
    this.setState({showCanvas:false,showPreview:true})
  }

 arrowHandler=(type)=>{
      if(type==="back"){

        if(this.state.showCanvas){
          this.setState({showCanvas:false,showPreview:false})
        }

       
        else if(this.state.showPreview){
          this.setState({showCanvas:true,showPreview:false})
        }

      }

      else{
        this.setState({showCanvas:true})
      }
       
 }

  render(){
      return (
        <div className="App">
          <div className="App-header">
            <h2>Manush AI</h2>
            <div className="Arrows-container">
             { (this.state.showCanvas || this.state.showPreview) &&
              <img className="Arrows" onClick={()=>this.arrowHandler("back")}   src={arrow_back}/>}
              
            
             
             
            </div>
          </div>

          <div className="App-container" style={{flexDirection:this.state.showCanvas?'row':'column'}}>
            
              {this.state.showCanvas && <CustomCanvas imgUrl={this.state.imagePreviewUrl} callbackToParent={this.callBackFromCustomCanvas} componentList={this.state.rectArray} labelList={this.state.labelList}/>}
              {this.state.showPreview && <Preview imgUrl={this.state.imagePreviewUrl} scalingCoEf={this.state.scalingCoEf} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} PreviewComponentsList={this.state.rectArray}/>}
              
              {!this.state.showPreview && <div className='File-handling'>
                 {!this.state.showCanvas && !this.state.showPreview?
                  <div>
                    <input ref={this.InputRef} type="file" onChange={this.fileChangedHandler} style={{display:"none"}}/>
                    <div className="Upload-div" style={{opacity:this.state.file===null?.6:1}}>
                      <button className='Upload-button' 
                              onClick={()=>{this.InputRef.current.click()}}>
                  
                                Upload!
                      </button>
                    </div>  
                  </div>
                  :
                  <div className="Submit-div" onClick={this.submitHandler} >
                    <h4>Submit</h4>
                      
                  </div>
                 }
                </div> }
                

            
                     
                
                 
          </div>

          {/*<div className="Side-bar">
              <SideBar list={this.state.rectArray}/>
                </div>*/}
        </div>
      );
  }
}

export default App;
