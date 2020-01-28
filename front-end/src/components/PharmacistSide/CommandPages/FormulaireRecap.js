import React, { Component } from 'react';

// MATERIAL UI
//import { makeStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
//import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

// COMPONENTS
import FormulaireResumeMedicaments from './FormulaireResumeMedicaments'
import TitleComponent from "./TitleComponent"



/* ============================== */



class FormulaireRecap extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            count: this.countPharmaceuticals(props.recap.pharmaceuticals),
            anchorEl: null,
        }
        this.open = Boolean(this.state.anchorEl)
    }

    handlePopoverOpen = event => {
        this.setState({
            ...this.state, 
            anchorEl: event.currentTarget
        })
      };
    
    handlePopoverClose = () => {
        this.setState({
            ...this.state, 
            anchorEl: null
        })
      };
    
    countPharmaceuticals = (details) => {
        console.log(details)
        let result= 0;
        for (let i = 0; i < details.length; i ++){
            console.log(details[i].price)
            result = result + (parseInt(details[i].price, 10) * parseInt(details[i].quantity, 10))
        }
        console.log(result)
        return result
    }

    render() { 
        const {pharmaceuticals}  = this.props.recap;
        const {price}            = this.props.recap.pharmaceuticals;
        const {clientAdress}     = this.props.recap;
        const {pharmacistAdress} = this.props.recap;
        const {orderInformation} = this.props.recap;
        
        console.log('mon state :', this.state.anchorEl)

        return (
      
            <form>

                <Typography variant="h4" align="left" > Récapitulatif de la commande </Typography>
                <br/>
                <Grid container spacing={3}>
                    <Grid container  item xs={12} sm={12}>
                        <div className="commandeStatus">
                            < TitleComponent />
                        </div>
                    </Grid>
                    <Grid container item xs={12} sm={4} alignContent="center">
                        <div className="containerFormRecap">
                            <Typography className="titleResumeCommande" align="left" variant="h6" style= {{fontWeight:"bold"}}>Adresse de facturation</Typography>
                            <div className="adressResume height">
                                <Typography align="left">{clientAdress.lastname} {clientAdress.firstname}</Typography>
                                <Typography align="left">{clientAdress.primary_adress.adress}, {clientAdress.primary_adress.street_number}</Typography>
                                <Typography align="left">{clientAdress.primary_adress.zip_code} - {clientAdress.primary_adress.city}</Typography>
                                <Typography align="left">{clientAdress.mail}</Typography>
                                <Typography align="left">{clientAdress.GSM}</Typography>
                            </div>
                        </div>
                    </Grid>
                    
                    <Grid container item xs={12} sm={4} alignContent="center">
                        <div className="containerFormRecap">
                            <Typography align="left" className="titleResumeCommande" variant="h6" style={{fontWeight:"bold"}}>Adresse pharmacie</Typography>
                            <div className="adressResume height">
                                <Typography align="left">{pharmacistAdress.pharmacy_name}</Typography>
                                <Typography align="left">{pharmacistAdress.lastname} {pharmacistAdress.firstname}</Typography> 
                                <Typography align="left">{pharmacistAdress.primary_adress.adress}, {pharmacistAdress.primary_adress.street_number}</Typography>
                                <Typography align="left">{pharmacistAdress.primary_adress.zip_code} - {pharmacistAdress.primary_adress.city}</Typography>
                                <Typography align="left">{pharmacistAdress.mail}</Typography>
                                <Typography align="left">{pharmacistAdress.GSM}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className="containerFormRecap" style={{height:"30vh", overflowX:'auto'}}>
                            <Typography align="left" className="titleResumeCommande" variant="h6" style={{fontWeight:"bold"}}>Panier</Typography>
                            <FormulaireResumeMedicaments className="adressResume height" medicaments={pharmaceuticals} readRecap={true} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div className="containerFormRecap">
                            <Typography align="left" className="titleResumeCommande" variant="h6" style={{fontWeight:"bold"}}>Autres informations </Typography>
                            <div className="adressResume height">{orderInformation.delivery_comment}</div>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <div className="containerFormRecap">
                            <Typography align="left" className="titleResumeCommande" variant="h6" style={{fontWeight:"bold"}}>Facture</Typography>
                            <img align="center" className="adressResume height" src="https://upload.wikimedia.org/wikipedia/commons/0/0b/ReceiptSwiss.jpg" alt="order ticket" />
                        </div>
                    </Grid>
                    
                    
                    <Grid item xs={12} sm={4}>
                        <div className="containerFormRecap">
                            <Typography align="left" className="titleResumeCommande" variant="h6" style={{fontWeight:"bold"}}>Récapitulatif de votre commande </Typography>
                            <Grid className="height" style={{fontSize:'0.9rem'}} container spacing={3}>
                                <Grid item xs={12} sm={9} align="right" className="titlePrixResume">
                                    <p>Sous-total : </p>
                                    <p>Livraison < HelpOutlineIcon /></p>

                                    {/* <Typography
                                        aria-owns={this.open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={this.handlePopoverOpen}
                                        onMouseLeave={this.handlePopoverClose}
                                    >
                                        Livraison< HelpOutlineIcon />
                                    </Typography>
                                    <Popover
                                        style={{
                                            pointerEvents: 'none',
                                        }}
                                        id="mouse-over-popover"
                                        open={true}
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        onClose={this.handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                        <Typography>I use Popover.</Typography>
                                    </Popover> */}
                                    
                                    <p>Réduction livraison : </p>
                                    <br/>
                                    <p>Montant total : </p>
                                </Grid>

                                <Grid item xs={12} sm={3} align="right" className="priceResume">
                                    <p>{this.state.count} €</p>
                                    <p>5,00 €</p>
                                    {this.state.count >= 35 ? <p>- 5,00€</p> : <p>0,00 €</p>}
                                    <br/>
                                    {this.state.count >= 35 ? <p>{this.state.count} € </p> : <p>{this.state.count + 5} € </p>}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </form>            
        );
    }
}

export default FormulaireRecap;