import React from 'react';
import Select ,{ components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import '../css/DropDown.css'

const SelectContainer = ({ children, ...props }) => {
    return (
      
        <components.SelectContainer {...props}>
          {children}
        </components.SelectContainer>
      
    );
  };
const ValueContainer = ({ children, ...props }) => (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  );

  const Menu = props => {
   
    return (
      
        <components.Menu {...props}>{props.children}</components.Menu>
      
    );
  };
const MenuList = props => {
    return (
      <components.MenuList {...props}>
        
        {props.children}
      </components.MenuList>
    );
  };

  const Option = props => {
    return (
      
        <components.Option {...props} />
      
    );
  }

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export default class DropDownLabels extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            options:this.props.labelList,
            selectedOption: null,
            menuIsOpen:false
        };
}

  handleChange = selectedOption => {
      console.log(selectedOption);
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
    this.handleMenuOpening();
    this.sendslectedLabelToParent(selectedOption);
  };

  sendDataToParent=(newLabel)=>{this.props.callBackToParent(newLabel)}
  sendslectedLabelToParent=(newLabel)=>{this.props.callBackForSelectedLabel(newLabel,this.props.DropDownIndex)}

  handleOnCreate=createdValue=>{
    console.log(createdValue);
    var newLabel={value:createdValue.toLowerCase().replace(/\W/g, ''), label:createdValue}
    this.sendDataToParent(newLabel);
    this.sendslectedLabelToParent(newLabel);
    this.setState((prevState)=>({selectedOption:newLabel,options:[...prevState.options,newLabel]}))
    this.handleMenuOpening();
  }

  handleMenuOpening=()=>{console.log("OPEN");this.setState({menuIsOpen:true})}
  handleMenuClosing=()=>{console.log("CLOSE");this.setState({menuIsOpen:false})}


  render() {
    

    return (
     <div style={{zIndex:this.state.menuIsOpen?100:0,marginTop:-21}}>
      <CreatableSelect
        
      
        value={this.state.selectedOption}
        components={{ ValueContainer,Menu,MenuList,Option,IndicatorSeparator:() => null }}
        onChange={this.handleChange}
        
        onCreateOption={this.handleOnCreate}
        options={this.state.options}
        onMenuOpen={this.handleMenuOpening}
        onMenuClose={this.handleMenuClosing}
      
        
        styles={{
            valueContainer: base => ({
                             ...base,
                             background:"white",
                             
                             color: 'white',
                             width: '100%',
                             padding:0,
                             fontSize:15
                        
              }),
            option: base => ({
                ...base,
                color:'black',
               
                fontSize:15,
                height: '100%',
                padding:0,
                paddingBottom:5
                
              }),
            container: base => ({
                ...base,
                backgroundColor: "white",
                borderColor:this.props.color,
                borderWidth:1,
                borderStyle:"solid"
               
                
               
              }),
              menu: base => ({
                ...base,
                backgroundColor: "white",
                top:-8,
                borderRadius:0,
                left:Math.abs(this.props.itemWidth),
                width:150
              }),
              menuList: base => ({
                ...base,
                backgroundColor:"white"
              }),

              control: base => ({
                ...base,
                minHeight:0,borderRadius:0
              }),
              dropdownIndicator: base => ({
                ...base,
                padding:0,
                borderColor:this.props.color,
                borderWidth:1,
                borderStyle:"solid"
              })
              

          }}
      />
      </div>
    );
  }
}