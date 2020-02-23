import React, { Component } from 'react';

// AXIOS
import axios from 'axios';

// ROUTER
import { NavLink } from 'react-router-dom';

// MATERIAL UI
import { 
  Button,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent
} from '@material-ui/core';



/* ============================== */



class DisplayClientInformation extends Component {
  constructor(props) {
      super(props);
      this.state = { 
        user:{},
        orders:this.orders,
        }
    
        this.orders = [{
          order_number:'147258369',
          date_status:'2020-01-01 00:00:00',
          name:'Order_prepared',
        },
        {
          order_number:'147251659',
          date_status:'2020-01-01 00:00:00',
          name:'Paid',
        },
        {
          order_number:'147251659',
          date_status:'2020-01-01 00:00:00',
          name:'Paid',
        },
      ]

        this.idClient = this.props.match.params.id_order
  }

  componentDidMount = () => {
    axios
      .get(`http://localhost:5000/dashboard/clients/${this.idClient}`)
      .then(res => {
        this.setState({
          user: res.data[0]
        })
      })
      .catch(error => {
        console.error('Error_message: ', error.response.data)
      })
  }


  render() { 
    const {
      lastname, 
      firstname, 
      mail, 
      GSM, 
      zip_code,
      adress,
      city,
      street_number
    } = this.state.user
    

    return ( 
      <Grid container spacing={3} >
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginBottom:"5px"
        }}>
          <Button
            variant="contained" 
            style={{
              backgroundColor: 'rgb(32,173,143)',
            }} 
          >
            <NavLink
              to="/dashboard/client"
              activeClassName="selectedLink"
              style={{textDecoration: 'none',color:'#fff'}}
            >
              Retour
            </NavLink>
          </Button>
        </div>

        <div className="containerFormRecap">

          <Grid item xs={12} sm={12}>
            <Typography className="titleResumeCommande" align="left" variant='h4'>{lastname} {firstname}</Typography>
          </Grid>

          <div className="adressResumeClient">
            <Grid item>
              <Typography align="left">{adress}, {street_number}</Typography>
              <Typography align="left">{zip_code} - {city}</Typography>
            </Grid> 

            <Grid item>
              <Typography align="left">{mail} </Typography>
              <Typography align="left">{GSM} </Typography>
            </Grid>
          </div>

        </div>

        <Grid item xs={12} sm={12} >
          <Typography align="left" style= {{fontWeight:"bold"}}>Liste des commandes</Typography>
          {this.orders.map((item, id) => (
              <Card key={id} style={{marginBottom:"3px", border:"1px solid black"}}>
                <CardActionArea>
                  <CardContent>
                    <Typography style={{fontSize:"10px"}} align="left">{item.order_number}</Typography>
                    <Typography style={{fontSize:"10px"}} align="right">{item.name}</Typography>
                    <Typography style={{fontSize:"10px"}} align="left">{item.date_status}</Typography> 
                  </CardContent>
                </CardActionArea>
              </Card> 
            ))
          } 
        </Grid>
      </Grid>
    );
  }
}
 
export default DisplayClientInformation;