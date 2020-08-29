import React from 'react';
import Modal from '@material-ui/core/Modal'

import PreviewComponent from './PreviewComponent'
import PreviewCanvas from './PreviewCanvas'


import '../css/Preview.css';

export default class Preview extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showModal:false,
            selectedItemIndex:null
        }
    }
    
    modalHandler=(index)=>{
        this.setState((prevState)=>({showModal:!prevState.showModal,selectedItemIndex:index}));
        console.log(this.props.imgUrl)
    }

    isEmpty=(obj)=> {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    render(){
        return(
            <div className="Preview">
                <Modal
                        open={this.state.showModal}
                        onClose={this.modalHandler}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        
                > 

                <div className="Inside-modal" >
                <PreviewCanvas canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight} scalingCoEf={this.props.scalingCoEf} componentList={this.props.PreviewComponentsList} imgUrl={this.props.imgUrl} selectedItemIndex={this.state.selectedItemIndex}/>
                </div>
                        
                </Modal>
                {
                    this.props.PreviewComponentsList.map((item,index)=>{
                        var temp;
                        if(this.isEmpty(item._label)) temp="empty label"
                        else temp=item._label.value
                        return(
                            <div className="Preview-component" style={{borderColor:item._color}} >
                            
                                        
                                        <img src={item._previewSourceURL} 
                                           style={{backgroundColor:"rgba(255,255,255,.15)",
                                           objectFit:"contain",
                                           width:200,
                                           height:200,
                                           borderWidth:3,
                                           borderColor:"red",
                                           cursor:"pointer"
                                           }} 
                                           onClick={()=>this.modalHandler(index)}/>
                                        
                                        <h4 style={{borderColor:item._color,fontStyle:this.isEmpty(item._label)?"italic":"normal"}}>
                                           {temp}
                                        </h4>
            </div>
        )
                            
                        
                    })
                }
            </div>
        )
    }
}