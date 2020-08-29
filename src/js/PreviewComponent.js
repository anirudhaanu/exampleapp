import React from 'react';

import '../css/PreviewComponent.css';


export default class PreviewComponent extends React.Component{
    constructor(props){
        super(props);

        this.previewCanvasImgRef=React.createRef();
        this.state={
            
    }
}

    componentDidMount(){
    }

    render(){
        return(
            <div style={{width:200,height:200,borderWidth:1,fontSize:15,marginTop:5,marginRight:10}} >
                            
                            <h4 style={{padding:0,margin:0}}>startX--{this.props.item._startX}</h4>
                            <img src={this.props.item._previewSourceURL} style={{backgroundColor:"rgba(255,255,255,.15)",objectFit:"contain",width:200,height:200,borderWidth:3,borderColor:"red",cursor:"crosshair"}} onClick={()=>console.log("clickkkk")}></img>
                             <h4 style={{padding:0,margin:0}}>startY--{this.props.item._startY}</h4>
                             <h4 style={{padding:0,margin:0}}>width---{this.props.item._width}</h4>
                             <h4 style={{padding:0,margin:0}}>height--{this.props.item._height}</h4>
                             <h4 style={{padding:0,margin:0}}>Tag-----{this.props.item._label.value}</h4>
            </div>
        )
    }
}