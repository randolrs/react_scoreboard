
var PLAYERS = [
	{
		name: "Shane Randolph",
		score: 666,
		id: 1,

	},

	{
		name: "Elise Noel",
		score: 708,
		id: 2,

	},

	{
		name: "Jordan Randolph",
		score: 967,
		id: 3,

	},

]

var nextPlayerId = 4;

function Header(props) {
	return(
		<div className="header">
			<Stats players = {props.players} />
	    	<h1 className="title">{props.title}</h1>
	    	<Stopwatch />
	    </div>
    );
}

Header.propTypes = {

	title: React.PropTypes.string.isRequired,
	players: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		score: React.PropTypes.number.isRequired,
		id: React.PropTypes.number.isRequired,
		})).isRequired,

};

var Stopwatch = React.createClass ({
	
	getInitialState: function () {
		return {
			running: false,
			elapsedTime: 0,
			previousTime: 0,
		}

	},

	componentDidMount: function(){
		this.interval = setInterval(this.onTick, 100);
	},

	componentWillUnmount: function(){
		clearInterval(this.interval);
	},

	onTick: function() {
		if (this.state.running){
			var now = Date.now();
			this.setState({
				previousTime: now,
				elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
			})
		}
		console.log('onTick');
	},

	onStart: function() {
		this.setState({
			running: true,
			previousTime: Date.now(),

		});
	},

	onStop: function() {
		this.setState({running: false});
	},

	onReset: function() {
		this.setState({
			elapsedTime: 0,
			previousTime: Date.now(),
		});
	},

	render: function () {

		var seconds = Math.floor(this.state.elapsedTime / 1000)
		return (

			<div className="stopwatch">
				<h2>Stopwatch</h2>
				<div className="stopwatch-time">
					{seconds}
				</div>
				{this.state.running ? 
					<button onClick={this.onStop}>Stop</button> 
					:  
					<button onClick={this.onStart}>Start</button>
				}
				<button onClick={this.onReset}>Reset</button>
			</div>
		);
	},
});

function Counter(props) {
	return(
		<div className="player-score">
			<div className="counter">
				<button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
				<div className="counter-score">{props.score}</div>
				<button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
			</div>
		</div>
	);
}

Counter.propTypes = {
	score: React.PropTypes.number.isRequired,
	onChange: React.PropTypes.func.isRequired,
}

function Player(props) {
	return(
		<div className="player">
			<div className ="player-name">
				<a className="remove-player" onClick={props.onRemove}>X</a>
				{props.name}
			</div>
			<Counter score = {props.score} onChange={props.onScoreChange} />
			
		</div>
    );
}

Player.propTypes = {

	name: React.PropTypes.string.isRequired,
	score: React.PropTypes.number.isRequired,
	onScoreChange: React.PropTypes.func.isRequired,

};


Player.propTypes = {

	score: React.PropTypes.number.isRequired,

};


var AddPlayerForm = React.createClass({

	propTypes: {
		onAdd: React.PropTypes.func.isRequired,
	},

	onSubmit: function(e) {
		e.preventDefault();
		this.props.onAdd(this.state.name);
		this.setState({name: ""})
	},

	getInitialState: function() {
		return {
			name: "",
		};
	},

	onNameChange: function (e) {
		console.log('onNameChange',e.target.value);
		this.setState({name: e.target.value});
	},

	render: function() {
			return (
				<div className="add-player-form">

					<form onSubmit={this.onSubmit}>
						<input type="text" value={this.state.name} onChange={this.onNameChange} />
						<input type="submit" value="Add Player" />
					</form>

				</div>
			);
	}

});


function Stats(props) {

	var totalPlayersCount = props.players.length; //counts players array entries
	var totalPointsCount = props.players.reduce(function(total, player){ //sums points for each player
		return total + player.score;
	}, 0)

	return(

		<table className="stats">
			<tbody>
				<tr>
					<td>Players:</td>
					<td>{totalPlayersCount}</td>
				</tr>
				<tr>
					<td>Total Points:</td>
					<td>{totalPointsCount}</td>
				</tr>
			</tbody>
		</table>
	)	
}

Stats.propTypes = { //outlines prop type ()

	players: React.PropTypes.arrayOf(React.PropTypes.shape({ //defines permitted type(array) and type of array
		name: React.PropTypes.string.isRequired,
		score: React.PropTypes.number.isRequired,
		id: React.PropTypes.number.isRequired,
		})).isRequired,

};

var Application = React.createClass({ //defines this as a Class (versus function) with state

	propTypes: {

		title: React.PropTypes.string,
		initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			score: React.PropTypes.number.isRequired,
			id: React.PropTypes.number.isRequired,
			})).isRequired,
	},

	getDefaultProps: function() {
		return{
			title: "Scoreboard",
		}

	},

	getInitialState: function () {
		return {
			players: this.props.initialPlayers,
		};
	},

	onScoreChange: function (index, delta) {
		this.state.players[index].score += delta;
		this.setState(this.state);
	},

	onPlayerAdd: function (name) {
		console.log("player Added");
		this.state.players.push({
			name: name,
			score: 0,
			id: nextPlayerId,

		});

		this.setState(this.state);
		nextPlayerId += 1;
	},

	onRemovePlayer: function(index) {
		this.state.players.splice(index, 1);
		this.setState(this.state);
	},

	render: function() {
		return(
			<div className="scoreboard">
		    	<Header title = {this.props.title} players = {this.state.players} />
		    	<div className="players">
		    		{this.state.players.map(function(player, index) {
		    			return (

		    				<Player 
		    					onScoreChange={function(delta) {this.onScoreChange(index, delta)}.bind(this)}
		    					onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
		    					name={player.name} 
		    					score={player.score} 
		    					key={player.id} />
		    			
		    			);
		    		}.bind(this)
		    		)}
		    	</div>

		    	<AddPlayerForm onAdd={this.onPlayerAdd}/>

		    </div>

		);
	}
});


ReactDOM.render(<Application initialPlayers={PLAYERS} />, document.getElementById('container'));