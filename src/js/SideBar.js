import React from 'react';


class SideBar extends React.Component{
 
    
    render(){
        return(
            <div >
             {
                 this.props.list.map((item)=>{
                     return(
                         <div style={{backgroundColor:item._color,borderWidth:1,fontSize:15,marginTop:5}} >
                             <h4 style={{padding:0,margin:0}}>startX-- {item._startX}</h4>
                             <h4 style={{padding:0,margin:0}}>startY--{item._startY}</h4>
                             <h4 style={{padding:0,margin:0}}>width---{item._width}</h4>
                             <h4 style={{padding:0,margin:0}}>height--{item._height}</h4>
                             <h4 style={{padding:0,margin:0}}>Tag-----{item._label.value}</h4>
                         </div>
                     )
                 })
             }  
            
            </div>
        )
    }

}

export default SideBar;