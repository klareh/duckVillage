import React from 'react';
import HeadBar from './HeadBar';
import Farm from './Farm';
import TimerBoard from './TimerBoard';
import TagsBoard from './TagsBoard';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: [
				{ id: 0, display: '-' },
				{ id: 1, display: '-'},
				{ id: 2, display: '-'},
				{ id: 3, display: '-'},
				{ id: 4, display: '-'},
				{ id: 5, display: '-'},
				{ id: 6, display: '-'},
			],
			seconds: 0,
			timer: 0,
			plantingField: -1,
		}
	}

	componentDidUpdate() {
		if(this.isCountDownJustEnded()) {
			this.displayMessageOnTheField('做什麼?');
			this.stopTimer();
		}
	}

	isCountDownJustEnded() {
		return (this.isTimerStart() && this.state.seconds === 0);
	}

	render() {
		return (
			<div >
				<HeadBar />
				<Farm week={ this.state.fields }
					onClickCheckBox={ id => this.onClickField(id)}/>
				{ this.getTimerBoard() }
				{ this.getTagsBoard() }
			</div>
		);
	}

	getTimerBoard() {
		if(this.isTimerStart())
			return(
				<TimerBoard time={ this.getMinutesAndSeconds() }
					onClick={ () => this.onClickToCancelPlanting() } />
			);
		return '';
	}

	getTagsBoard() {
		if(!this.isTimerStart() && this.isPlanting())
			return(
				<TagsBoard onClickTag={ tag => this.onClickTag(tag) }/>
			);
		return '';
	}

	onClickTag(tagName) {
		this.displayMessageOnTheField(tagName);
		this.setState({ plantingField: -1});
	}

	onClickField(id) {
		if(this.isAbleToPlant(id)) {
			this.plantOnTheField(id);
			this.startTimer();
		}
	}

	isAbleToPlant(id) {
		return (!this.isTimerStart() && !this.isTheFieldPlanted(id) && !this.isPlanting());
	}

	plantOnTheField(id) {
		this.displayMessageOnTheFieldWithId('種植中', id);
		this.setState({ plantingField: id });
	}

	isTheFieldPlanted(id){
		return this.state.fields[id].display !== '-';
	}

	startTimer() {
		const timer = setInterval(() => this.decreaseTime(), 1000);
		this.setState({ timer: timer, seconds: 5});
	}

	decreaseTime() {
		this.setState((prevState) => ({ seconds :prevState.seconds - 1 }));
	}

	getMinutesAndSeconds() {
		const seconds = this.state.seconds;
		return Math.floor(seconds / 60) + ':' + (seconds % 60);
	}

	onClickToCancelPlanting() {
		if(this.isPlanting()) {
			this.stopTimer();
			this.clearThePlantingField();
		}
	}

	clearThePlantingField(){
		this.displayMessageOnTheField('-');
		this.setState({ plantingField: -1 });
	}

	displayMessageOnTheFieldWithId(message, id) {
		console.log(id);
		this.setState( preState => this.getFieldsWithUpdateDisplay(preState.fields, id, message));
	}

	displayMessageOnTheField(message) {
		this.setState( preState => this.getFieldsWithUpdateDisplay(preState.fields, preState.plantingField, message));
	}

	getFieldsWithUpdateDisplay(fields, plantingField, display) {
		if(plantingField >= 0) {
			let newFields = [...fields];
			newFields[plantingField].display = display;
			return { fields: newFields};
		}
	}

	stopTimer() {
		clearInterval(this.state.timer);
		this.setState({ timer: 0, seconds: 0});

	}

	isPlanting() {
		return this.state.plantingField != -1;
	}

	isTimerStart() {
		return (this.state.timer !== 0);
	}

	componentWillUnmount() {
		if(this.state.timer != 0)
			clearInterval(this.state.timer);
	}

}

export default Home;

