import React,  {Component} from 'react';
import AuthContext from '../context/auth-context';

class CreateEvent extends Component {

    constructor(props) {
        super(props);
            this.nameEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();

    }

    static contextType = AuthContext;

    submitHandler = (event) => {
        event.preventDefault();
        var name = this.nameEl.current.value;
        var description = this.descriptionEl.current.value;
        var price = this.priceEl.current.value;
        var date = this.dateEl.current.value;

        console.log(name, description, price, date);

        if(name.trim().length === 0 || description.trim().length === 0 || price.trim().length === 0 || date.trim().length === 0) {
            return;
        }

        var requestBody = {
            query: `
            mutation{
                createEvent(eventInput:{
                  title:"${name}",
                  description: "${description}",
                  price: ${price},
                  date:"${date}"
                }) {
                  _id
                  title
                  date
                  description
                  price
                  creator{
                    email
                  }
                }
              }
            `
        }
        const token = this.context.token;
        console.log('Bearer ' + token);
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body : JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData => {
            console.log(resData);
            // navigate to event page

        })
        .catch(err => {
            console.log(err);
        }); 
    }
    
    render() {
        return (
            
                <div className="row">
                    <div className="col-5">
                        <form onSubmit={this.submitHandler}> 
                            <div className="form-group">
                                <label >Name</label>
                                <input  ref={this.nameEl} type="text" className="form-control" />
                            </div>
                            
                            <div className="form-group">
                                <label >Description</label>
                                <textarea  ref={this.descriptionEl} className="form-control" rows="3"></textarea>
                            </div>

                            <div className="form-group">
                                <label >Price</label>
                                <input  ref={this.priceEl} type="text" className="form-control" />
                            </div>

                            <div className="form-group">
                                <label >Date </label>
                                <input  ref={this.dateEl} type="text" className="form-control" />
                            </div>

                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
        );
    }
}

export default CreateEvent;