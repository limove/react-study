import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';

class DayTime extends React.Component{
	render(){
		return (<div></div>);
	}
}

class Data extends React.Component{
	render(){
		return (
			<p className={"date "+this.props.addClass}>{this.props.date}</p>
		);
	}
}

class Month extends React.Component{
	getDaysNum(year,month){
		const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);  
		switch(month){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				return 31;
			case 4:
			case 6:
			case 9:
			case 11:
				return 30;
			case 2:
				return isLeapYear?29:28;
			default:
				return 0;
		}
	}
	//zeller公式
	calWeek(c,y,m,d){
		m = m<3?(y-=m,12+m):m;
		let a = (y+parseInt(y/4,10)+parseInt(c/4,10)-2*c+parseInt(26*(m+1)/10,10)+d-1)%7;
		a=(a+7)%7;
		return a;
	}
	render(){
		const year = this.props.year,month = this.props.month,curTime = this.props.curTime;
		const curTimeObj={
			year:curTime.getFullYear(),
			month:curTime.getMonth()+1,
			date:curTime.getDate(),
		}
		const rows = [],
			  daysNum = this.getDaysNum(year,month);
		// const day = this.calWeek(parseInt(year/100,10),year % 10,month,1);
		const day = (new Date(year+"/"+month+"/"+1)).getDay();
		const firstLineNum = 7-day;
		const line = Math.ceil((daysNum-firstLineNum)/7)+1;
		let date = 0;
	  	for(let i=0;i<line;i++){
	  		var row = [];
	  		for(let j=0;j<7&&date<daysNum;j++){
	  			if(i===0 && j+1>firstLineNum) {break;}
	  			var addClass = i===0?"fr":"fl";
	  			++date;
	  			if(year === curTimeObj.year && month === curTimeObj.month && date === curTimeObj.date){
	  				addClass += " today";
	  			}
	  			if(i===0){
	  				row.unshift(<Data
	  					key={date}
	  					date={date}
	  					addClass={addClass}
  					/>);
	  			}else{
		  			row.push(<Data
	  					key={date}
	  					date={date}
	  					addClass={addClass}
	  				/>);
	  			}
	  		}
	  		rows.push(<div
	  			className="row clearfix"
				key={i}>
	  				{row}
	  			</div>);
	  	}
		return (
			<div
				className="month clearfix fl"
				onClick={()=>{
					if(this.props.onClick){
						this.props.onClick();
					}
				}}
			>
				<h3 className="monthNum">{month}月</h3>
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
				curTime={this.props.curTime}
				onClick={()=>this.props.onClick("toMonth",i+1)}
			/>);
		}
		return (
			<div className="yearBox clearfix">
				{rows}
			</div>
		);
	}
}

class Board extends React.Component{
	renderBoard(item,viewTime,curTime){
		switch(item){
			case "year":
				return (<Year
					year={viewTime.getFullYear()}
					curTime={curTime}
					onClick={(dir,val)=>this.props.onClick(dir,val)}
				/>);
			case "month":
				return (<Month
					curTime={curTime}
					year={viewTime.getFullYear()}
					month={viewTime.getMonth()+1}
				/>);
			case "day":
				return (<DayTime
					curTime={curTime}
					time={viewTime}
				/>);
			default:
				return;
		}
	}
	render(){
		const viewTime = this.props.viewTime,
			  curItem = this.props.curItem,
			  curTime = this.props.curTime;
		let item = this.renderBoard(curItem,viewTime,curTime);
		return (
			<div className={curItem+"Board clearfix"}>
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
			curItem:"month",
			viewTime:time,
		}
	}
	getDaysNum(year,month){
		const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);  
		switch(month){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				return 31;
			case 4:
			case 6:
			case 9:
			case 11:
				return 30;
			case 2:
				return isLeapYear?29:28;
			default:
				return 0;
		}
	}
	prevBtnClick(){
		const curTime = new Date(),
			  curItem = this.state.curItem,
			  viewTime = new Date(this.state.viewTime);
		switch(curItem){
			case "day":
				var date = viewTime.getDate();
				if(date>1){
					viewTime.setDate(date-1);
					break;
				}
				viewTime.setDate(this.getDaysNum(viewTime.getFullYear(),viewTime.getMonth()+1));
			case "month":
				var month = viewTime.getMonth();
				if(month>0){
					viewTime.setMonth(month-1);
					break;
				}
				viewTime.setMonth(11);
			case "year":
				viewTime.setFullYear(viewTime.getFullYear()-1);
				break;
			default:
				break;
		}
		this.setState({
			curTime:curTime,
			curItem:curItem,
			viewTime:viewTime,
		});
	}
	nextBtnClick(){
		const curTime = new Date(),
			  curItem = this.state.curItem,
			  viewTime = new Date(this.state.viewTime);
		switch(curItem){
			case "day":
				var date = viewTime.getDate();
				if(date < this.getDaysNum(viewTime.getFullYear(),viewTime.getMonth()+1) ){
					viewTime.setDate(date+1);
					break;
				}
				viewTime.setDate(1);
			case "month":
				var month = viewTime.getMonth();
				if(month<11){
					viewTime.setMonth(month+1);
					break;
				}
				viewTime.setMonth(0);
			case "year":
				viewTime.setFullYear(viewTime.getFullYear()+1);
				break;
			default:
				break;
		}
		this.setState({
			curTime:curTime,
			curItem:curItem,
			viewTime:viewTime,
		});
	}
	changeBoardClick(dir,val){
		const curTime = new Date(),
			  curItem = this.state.curItem,
			  viewTime = new Date(this.state.viewTime);
		let item;
		if(dir === "toYear"){
			switch(curItem){
				case "month": item = "year";break;
				case "day": item = "month";break;
				default: break;
			}
		}else if(dir === "toMonth"){
			switch(curItem){
				case "year": 
					item = "month";
					viewTime.setMonth(val-1);
					break;
				case "month": 
					item = "day";
					viewTime.setDate(val);
					break;
				default: break;
			}
		}
		this.setState({
			curTime:curTime,
			curItem:item,
			viewTime:viewTime,
		});
	}
	render(){
		const viewTime = this.state.viewTime,
			  curItem = this.state.curItem;
		let strTime=viewTime.getFullYear() + "年";
		let prevStr = "";
		switch(curItem){
			case "month":
				prevStr = strTime;
				strTime += (viewTime.getMonth()+1) + "月";
				break;
			case "day":
				strTime += (viewTime.getMonth()+1) + "月";
				prevStr = strTime;
				strTime += viewTime.getDate() + "日";
				break;
			default:
				break;
		}
		return (
			<div className="calendar">
				<div className="calendarMenu">
					<a className="prevBoard" onClick={()=>this.changeBoardClick("toYear")}><span>{prevStr}</span></a>
					<a className="prevBtn" onClick={()=>this.prevBtnClick()}>{"<"}</a>
					<span className="calendarTime">{strTime}</span>
					<a className="nextBtn" onClick={()=>this.nextBtnClick()}>{">"}</a>
				</div>
				<Board 
					curTime={this.state.curTime}
					curItem={this.state.curItem}
					viewTime={this.state.viewTime}
					onClick={(dir,val)=>this.changeBoardClick(dir,val)}
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
