import React from 'react';
import './headerUserPage.css';

// ROUTER
import { Link, NavLink, Switch, Route } from 'react-router-dom';

// MATERIAL UI
import PeopleIcon from '@material-ui/icons/People';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

// COMPONENTS
import InputsOrders from './OrderPart/InputsOrders';
import ClientPart from './ClientPart/ClientPart';
import OrderPart from './OrderPart/OrderPart';
import DisplayCurrentStatus from './OrderPart/DisplayCurrentStatus';
import DisplayMarkerStatus from './OrderPart/DisplayMarkerStatus';
import SearchBarClients from './ClientPart/SearchBarClients';



/* ============================== */



// MATERIAL-UI STYLES
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: '#0dae8e',
    justifyContent:'center',
    

  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    color: 'black',
    backgroundColor: theme.palette.background.default,
    boxShadow: 'black 0px 0px 7px',
    borderRadius: '10px',
    padding: theme.spacing(3),
    marginTop: "90px"
  },
  avatarImg: {
    width: '100px',
    height: '100px',
    fontSize: '3em',
    margin: '-40px -40px -10px -40px',
  },
}));



export default function Dashboard(props) {
  const classes = useStyles();
  const { match } = props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar >
          <Typography variant="h4" align="center">
            Take-Care
          </Typography>
        </Toolbar> 
        

      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <div className="avatarContent">
          <Avatar className={classes.avatarImg} alt="Travis Howard" src="https://www.walhain.be/ma-commune/informations-utiles/sante/pharmacies/media/pharmacie-site.png/@@images/cd2d2ca9-237a-4721-8da2-d5592c9aaf51.png" />
          <h1 className="avatarSurname">Georges</h1>
          <h5 className="avatarName">Reine Pharma Bvba-Sprl</h5>
        </div>

        <Divider />

        <List>
          <Link style={{textDecoration: 'none'}} to={`${match.url}/client`} >
            <ListItem button key ="Client">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Client"/>
            </ListItem>
          </Link>
        </List>

        <Divider />

        <List>
          <Link style={{textDecoration: 'none'}} to={`${match.url}/orders`} > 
              <ListItem button>
                  <ListItemIcon><DescriptionIcon /></ListItemIcon>
                  <ListItemText style={{textDecoration: 'none'}} primary="Commande"/>
              </ListItem>
          </Link>
        </List>

        <Divider />

        <List>
          <Link style={{textDecoration: 'none'}} to={`${match.url}/new-order`} > 
            <ListItem button>
              <ListItemIcon><DescriptionIcon /></ListItemIcon>
              <ListItemText primary="Nouvelle commande"/>
            </ListItem>
          </Link>
        </List>

      </Drawer>
      
      <div className={classes.content}>
        <Switch>
          <Route 
            path={`${match.path}`}
            exact
            component={props => <OrderPart {...props} />}
          />

          <Route 
            path={`${match.path}/orders`}
            render={props => <OrderPart {...props} />}
          />

          <Route 
            path={`${match.path}/client`}
            render={props => <ClientPart {...props} />}
          />

          <Route 
            path={`${match.path}/new-order`}
            render={props => <InputsOrders {...props} />}
          />
        </Switch>

      </div>  
    </div>
  );
}