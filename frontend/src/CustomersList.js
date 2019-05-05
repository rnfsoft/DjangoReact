import  React, { Component } from  'react';
import  CustomersService  from  './CustomersService';

const  customersService  =  new  CustomersService();

class  CustomersList  extends  Component {

constructor(props) {
    super(props);
    this.state  = {
        customers: [],
        previousPageURL: '', //added to go back to the previous
        nextPageURL:  ''
    };
    this.previousPage  =  this.previousPage.bind(this); 
    this.nextPage  =  this.nextPage.bind(this);   
    this.handleDelete  =  this.handleDelete.bind(this);
}

componentDidMount() {
    var  self  =  this;
    customersService.getCustomers().then(function (result) {
        console.log(result);
        self.setState({ customers:  result.data, 
                        previousPageURL: result.prevlink,    
                        nextPageURL:  result.nextlink})
    });
}
handleDelete(e,pk){
    var  self  =  this;
    customersService.deleteCustomer({pk :  pk}).then(()=>{
        var  newArr  =  self.state.customers.filter(function(obj) {
            return  obj.pk  !==  pk;
        });

        self.setState({customers:  newArr})
    });
}

handleEdit(e, pk){
    this.props.history.push("/customer/" + pk)         
}

previousPage(){
    var  self  =  this;       
    customersService.getCustomersByURL(this.state.previousPageURL).then((result) => {
        self.setState({ customers:  result.data, previousPageURL: result.prevlink, nextPageURL:  result.nextlink}) // need to add both prevlink and nextlink
    });
}

nextPage(){
    var  self  =  this;       
    customersService.getCustomersByURL(this.state.nextPageURL).then((result) => {
        self.setState({ customers:  result.data, previousPageURL: result.prevlink, nextPageURL:  result.nextlink}) // need to add both prevlink and nextlink
    });
}
render() {

    return (
        
        <div  className="customers-list">
            <table  className="table">
            <thead  key="thead">
            <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.state.customers.map( c  =>
                <tr  key={c.pk}>
                <td>{c.pk}  </td>
                <td>{c.first_name}</td>
                <td>{c.last_name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td>{c.description}</td>
                <td>
                <button className="btn btn-danger btn-sm" onClick={(e)=>  this.handleDelete(e,c.pk) }> Delete</button>
                <button className="btn btn-warning btn-sm" onClick={(e)=> this.handleEdit(e, c.pk) } >Edit </button>
                {/* <a  href={"/customer/" + c.pk}> Update</a> */}
    
                </td>
            </tr>)}
            </tbody>
            </table>
            
            <button  className="btn btn-link"  onClick=  {  this.previousPage  }>Previous</button>
            <button  className="btn btn-link"  onClick=  {  this.nextPage  }>Next</button>
            {/* <p>{this.state.previousPageURL}</p>
            <p>{this.props.location.pathname}</p>
            <p>{this.state.nextPageURL}</p> */}
        </div>      
        );
  }
}
export  default  CustomersList;