import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import MenuAppBar from '../components/menuAppBar';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import CloudUploadOutlineIcon from '@material-ui/icons/CloudUpload';
import Divider from '@material-ui/core/Divider';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import config from '../config/config';
const server_url = config.server_url;

const styles = {
  card: {
    maxWidth: 350,
  },
  media: {
    objectFit: 'cover',
  },
  buttonDelete:{
    color: 'tomato'
  }
};


const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);


//class AddProductModal extends React.Component {
class AddPaymentMethodModal extends React.Component {

  	constructor(props){
		super(props);
		this.state = {
			name: '',
			paymentImage: '',
			img: [],
			/*
			format: [],
			*/
			activePrinciples: [],
			
			selectedPrinciples: []

		}
	}

	setPrinciples(){
		fetch(server_url + '/principles', {
			method: 'get',
			headers: {
				'Content-Type':'application/json',
				// 'Authorization': authToken.getToken(),
			}
		})
		.then(response => {
			return response.json()
		})
		.then(data => {
			// var newprod = {name: data.products[0].name}
			// data.products.push(product
			console.log(data.principles)
			this.setState({ 
				principios : data.principles,
			});
		})
		.catch((err) => {
			console.log(err)
		});
	}

	setActivePrinciple(id, principle){
		console.log("HOLA", this.state)
		const { activePrinciples, selectedPrinciples} = this.state
		let auxPrinc = activePrinciples
		let auxIds = selectedPrinciples
		auxPrinc[id]=principle.name
		auxIds[id]=principle.id
		this.setState({ activePrinciples: auxPrinc, selectedPrinciples: auxIds,productSuggestions: false})
	}

	renderSuggestions(idx){
		if(idx == this.state.selectedForm && this.state.productSuggestions)
			return(
				<Paper>
				<List component="nav" aria-label="Secondary mailbox folders">
					{
						this.state.principios.map((principio,i) => {
							if(principio.name.toLowerCase().includes(this.state.activePrinciples[idx].toLowerCase()))
						        return(
						        	<ListItem key={i} onClick={() => {this.setActivePrinciple(idx, principio)}} button>
						        					          <ListItemText  primary={principio.name} />
	    					        </ListItem>
	    					        )
						})
					}
			      </List>
				</Paper>
			)
		return <div/>
	}
	componentDidMount(){
		this.setPrinciples()
		if(this.props.payment_method){
			const { payment_method } = this.props
			let principlesNames = []
			let principlesId = []
			payment_method.ActivePrinciples.forEach(principle => {
				principlesNames.push(principle.name)
				principlesId.push(principle.id)
			})
			this.setState({
				name: payment_method.name,
				paymentImage: payment_method.paymentImage/*,
				vegetarian: product.vegetarian,
				info: product.description,
				img: product.images,
				format: product.formats,
				activePrinciples: principlesNames,
				selectedPrinciples: principlesId
				*/
			})
		}
	}
	
	handleInputChange = (event) => {
		const { value, name } = event.target;
		this.setState({
		  [name]: value
		});
	}

	handleInputListChange = idx => (event) => {
		const { value, name } = event.target;
	    const newInput = this.state[name].map((value, sidx) => {
	      if (idx !== sidx) return value;
	      return event.target.value;
    	});
		this.setState({ [name]: newInput });
	};

	handleAddList = name => (event) => {
		let newList = this.state[name];
		newList.push('');
		this.setState({
		  [name]: newList
		});
	};

	handleRemoveList = (idx, nameList) => (event) => {
		nameList.forEach(name => {
			this.setState({
			  [name]: this.state[name].filter((s, sidx) => idx !== sidx)
			});
		})
	};
	editOld(){
		let payment_method = {
			id: this.props.payment_method.id,
		    name: this.state.name,
			paymentImage: this.state.paymentImage/*,
			vegetarian: this.state.vegetarian,
			info: this.state.info,
			img:  this.state.img,
			format: this.state.format,
			activePrinciples: this.state.selectedPrinciples,
			*/
		};
		console.log(payment_method);
		/*fetch(server_url + '/product/'+this.props.product.id, {*/
		fetch(server_url + '/paymentmethod/'+this.props.payment_method.id, {
		  method: 'put',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(payment_method),
		})
		.then(res => res.json())
		.then(res => {
		  console.log(res,123);
		  this.props.onAdd(res)
		})
		.catch(err => {
		  console.error(err);
		});

	}
	createNew(){
		let payment_method = {
		    name: this.state.name,
			paymentImage: this.state.paymentImage/*,
			vegetarian: this.state.vegetarian,
			info: this.state.info,
			img:  this.state.img,
			format: this.state.format,
			activePrinciples: this.state.selectedPrinciples,
			*/
		};
		console.log(payment_method);
		this.setState({
					name: '',
					paymentImage: ''/*,
					vegetarian: '',
					info: '',
					img: [],
					format: [],
					activePrinciples: [],
					selectedPrinciples: []
					*/
				})
		fetch(server_url + '/methods', {
		  method: 'post',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(payment_method),
		})
		.then(res => res.json())
		.then(res => {
		  console.log(res,123);
		  this.props.onAdd(res)
		})
		.catch(err => {
		  console.error(err);
		});

	}
	onSubmit = (event) => {
		event.preventDefault();
		console.log("HOLA ON SUBMIT")
		if(this.props.payment_method)
			this.editOld()
		else
			this.createNew()
		this.props.handleClose()
	}
  render(){
    const { classes } = this.props;
    return (
        <Dialog
          onClose={this.props.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
        >
          <DialogContent>
					<Avatar className={classes.avatar}>
						<CloudUploadOutlineIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Subir un metodo de pago
					</Typography>
					<form className={classes.form} onSubmit={this.onSubmit}>
			            <FormControl margin="normal" required fullWidth>
			              <InputLabel htmlFor="text">Nombre</InputLabel>
			              <Input id="name"
			              name="name"
			              autoComplete='off'
			              onChange={this.handleInputChange}
			              value={this.state.name}
			              autoFocus />
			            </FormControl>
			            

			            <div style={{margin: '10px'}} className={classes.list}>
				            {this.state.img.map((img, idx) => (
					          	<FormControl margin="normal">
					          	<div className="listInput">
				              		<InputLabel htmlFor="text">Imagen {idx + 1}</InputLabel>
						            <InputBase
						              className={classes.inputInList}
						              name="img"
						              autoComplete='off'
						              placeholder={`Imagen ${idx + 1}`}
						              value={img}
						              onChange={this.handleInputListChange(idx)}
						            />
						            <IconButton className={classes.iconButton}
						              type="button"
						              onClick={this.handleRemoveList(idx, ['img'])}
						              className="small"
						            >
								        <RemoveCircleIcon />
								    </IconButton>
					          	</div>
					        	</FormControl>
					        ))}
					        <Button
					          type="button"
					          fullWidth
					          variant="outlined"
					          color="secondary"
					          onClick={this.handleAddList('img')}
					          className="small"
					        >
					          Agregar Imagen
					        </Button>
			            </div>

			            <div className={classes.list}>
				            {this.state.activePrinciples.map((img, idx) => (
					          	<FormControl margin="normal" >
					          	<div className="listInput" >
				              		<InputLabel htmlFor="text">Categoria {idx + 1}</InputLabel>
						            <InputBase
						              className={classes.inputInList}
						              name="activePrinciples"
						              autoComplete='off'
						              placeholder={`Categoria ${idx + 1}`}
						              onFocus={() => {this.setState({ selectedForm : idx, productSuggestions: true})}}
						              
						              value={img}
						              onChange={this.handleInputListChange(idx)}
						            />
						            <IconButton className={classes.iconButton}
						              type="button"
						              onClick={this.handleRemoveList(idx, ['activePrinciples','selectedPrinciples'])}
						              className="small"
						            >
								        <RemoveCircleIcon />
								    </IconButton>
								    {this.renderSuggestions(idx)}
					          	</div>
					        	</FormControl>
					        ))}
					        
			            </div>

			            <Button
			              type="submit"
			              fullWidth
			              variant="contained"
			              color="primary"
			              className={classes.submit}
			              style={{margin: '10px'}}
			            >
			              Subir
			            </Button>
			        </form>
          </DialogContent>
        </Dialog>
  );

  }  
}



AddPaymentMethodModal.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(AddPaymentMethodModal);