import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class DayTime extends React.Component{
	render(){
		return (<div></div>);
	}
}

class Data extends React.Component{
	render(){
		return (
			<p className="data">{this.props.data}</p>
		);
	}
}

class Month extends React.Component{
	getDaysNum(year,month){
		return 31;
	}
	calWeek(c,y,m,d){
		let a = (y+parseInt(y/4,10)+parseInt(c/4,10)-2*c+parseInt(26*(m+1)/10,10)+d-1)%7;
		a=a>0?a:a+7;
		return a;
	}
	render(){
		const rows = [],
			  daysNum = this.getDaysNum(this.props.year,this.props.month);
	  	for(let i=0;i<daysNum;i++){
	  		rows.push(<Data
  				key={i}
  				data={i+1}
  			/>);
	  	}
		return (
			<div className="month">
				{rows}
			</div>
		);
	};
}

class Year extends React.Component{
	render(){
		const rows = [];
		for(let i=0;i<12;i++){
			rows.push(<Month
				key={i}
				year={this.props.year}
				month={i+1}
			/>);
		}
		return (
			<div>{rows}</div>
		);
	}
}

class Board extends React.Component{
	renderBoard(item,time){
		switch(item){
			case "year":
				return (<Year
					year={time.getFullYear()}
				/>);
			case "month":
				return (<Month
					year={time.getFullYear()}
					month={time.getMonth()+1}
				/>);
			case "day":
				return (<DayTime
					time={time}
				/>);
			default:
				return;
		}
	}
	render(){
		const viewTime = this.props.viewTime,
			  curItem = this.props.curItem;
		let item = this.renderBoard(curItem,viewTime);
		return (
			<div className={"board "+curItem}>
				{item}
			</div>
		);
	}
}

class Calendar extends React.Component{
	constructor(){
		super();
		const time = new Date();
		this.state={
			curTime:time,
			curItem:"year",
			viewTime:time,
		}
	}
	render(){
		const viewTime = this.state.viewTime;
		let strTime=viewTime.getFullYear() + "年";
		switch(this.state.curItem){
			case "month":
				strTime += (viewTime.getMonth()+1) + "月"; 
				break;
			case "day":
				strTime += (viewTime.getMonth()+1) + "月"; 
				strTime += viewTime.getDate() + "日";
				break;
			default:
				break;
		}
		return (
			<div className="calendar">
				<div className="calendarMenu">
					<h3>{strTime}</h3>
				</div>
				<Board 
					curTime={this.state.curTime}
					curItem={this.state.curItem}
					viewTime={this.state.viewTime}
				/>
			</div>
		);
	}
}

//==================================
ReactDOM.render(
	<Calendar />,
	document.getElementById('root')
);
