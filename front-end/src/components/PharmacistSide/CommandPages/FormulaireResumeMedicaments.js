import React, { Component } from 'react';
import './formulairePage.css'; 

// MATERIAL UI
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CreateIcon from '@material-ui/icons/Create';
import Grid from '@material-ui/core/Grid';



/* ============================== */



class FormulaireResumeMedicaments extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    render() {
        const { deleteMedicament , medicaments , editMedicament, recap} = this.props;

        return ( 
            <div className="contentResumeMedicament">
                <Grid container spacing={3}>
                    <div className="titleResumeMedicament">
                        <Grid item xs={12} sm={4}>
                            <h1>Nom</h1>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <h1>Quantité</h1>
                        </Grid>

                        {recap ? null : (
                            <Grid item xs={12} sm={4}>
                                <h1>Action</h1>
                            </Grid>
                        )}
                        
                    </div>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {medicaments.map((item,id) =>
                            <div key={id} className="resumeMedicament">
                                <div className="resumeMedicamentName">{item.name}</div>
                                <div className="resumeMedicamentQuantity">{item.quantity}</div>

                                {recap ? null : (
                                    <div className="resumeMedicamentAction">
                                        <button onClick={() => deleteMedicament(id)} >
                                            < DeleteOutlineIcon />
                                        </button>
    
                                        <button onClick={() => editMedicament(id)} >
                                            < CreateIcon />
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}
                    </Grid> 
                </Grid>
            </div>
         );
    }
}
export default FormulaireResumeMedicaments;