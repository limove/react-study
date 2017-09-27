import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';

class YearItem extends React.Component{
	render(){
		return (<span
					className={'yearItem' + (this.props.active?' active':'') + (this.props.today?' today':'') }
					onClick={()=>{
							let viewTime = new Date(this.props.viewTime);
							viewTime.setFullYear(this.props.year);
							this.props.changeCurView(this.props.curView,"next",viewTime);
						}}
				>{this.props.year}</span>);
	}
}

class MonthItem extends React.Component{
	render(){
		return (<span
					className={'monthItem' + (this.props.active?' active':'') + (this.props.today?' today':'') }
					onClick={()=>{
								let viewTime = new Date(this.props.viewTime);
								viewTime.setMonth(this.props.month-1);
								this.props.changeCurView(this.props.curView,"next",viewTime);
							}}
				>{this.props.month}</span>);
	}
}

class DateItem extends React.Component{
	render(){
		return (<span
					className={'dateItem' + (this.props.active?' active':'') + (this.props.today?' today':'') +(this.props.isThisMonth?'':' notThisMonth')}
					onClick={(e)=>{
						this.props.selectDate(this.props.relDate,e.shiftKey)
					}}
				>{this.props.date}</span>);
	}
}

class Board extends React.Component{
	isSelected(num){
		return this.props.selectTime.some((item)=>{
			return compareTime(num,item,this.props.curView) === 0;
		});
	}
	getDate(date,year,month){
		let lastDays = this.getDays(year,month-1),
			days = this.getDays(year,month);
		if(date<=0){
			return date + lastDays;
		}else if(date > days){
			return date - days;
		}else{
			return date;
		}
	}
	getDays(year,month){
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
	getBoard(){
		let curView = this.props.curView,
			viewTime = this.props.viewTime,
			viewTimeTemp = new Date(viewTime),
			rowList = [];
		switch(curView){
			case 0:
				const firstYear = viewTime.getFullYear() - 9;
				for(let i = 0;i < 4;i++){
					let row = [];
					for(let j = 0;j < 5;j++){
						viewTimeTemp.setFullYear(firstYear + i*5 + j);
						row.push(<YearItem
									key={i*5 + j}
									year={firstYear + i*5 + j}
									today={false}
									//active={this.isSelected(firstYear + i*5 + j)}
									active={this.isSelected(viewTimeTemp)}
									viewTime={viewTime}
									curView={curView}
									changeCurView={(curView,method,viewTime)=>this.props.changeCurView(curView,method,viewTime)}
								/>);
					}
					rowList.push(<div key={i} className="yearRow">{row}</div>);
				}
				break;
			case 1:
				for(let i = 0;i < 3;i++){
					let row = [];
					for(let j = 0;j < 4;j++){
						viewTimeTemp.setDate(1);
						viewTimeTemp.setMonth(i*4 + j);
						row.push(<MonthItem
									key={i*4 + j + 1}
									month={i*4 + j + 1}
									today={false}
									//active={this.isSelected(i*4 + j + 1)}
									active={this.isSelected(viewTimeTemp)}
									viewTime={viewTime}
									curView={curView}
									changeCurView={(curView,method,viewTime)=>this.props.changeCurView(curView,method,viewTime)}
								/>);
					}
					rowList.push(<div key={i} className="monthRow">{row}</div>);
				}
				break;
			case 2:
				let year = viewTime.getFullYear(),
					month = viewTime.getMonth()+1,
					today = this.props.today,
					week = (new Date(year+"-"+month+"-1")).getDay(),
					firstDay = 1 - week,
					days = this.getDays(year,month);
				let title = [],
					weekName=['日','一','二','三','四','五','六'];
				for(let i = 0;i < 7;i++){
					title.push(<span key={"title"+i} className="dateTitle">{weekName[i]}</span>);
				}
				rowList.push(<div key="titleRow" className="dateRow">{title}</div>);
				for(let i = firstDay;i <= days;){
					if(i>100){console.log("error");break;}
					let row = [];
					for(let j = 0;j < 7;j++,i++){
						viewTimeTemp = new Date(viewTime);
						viewTimeTemp.setDate(i);
						row.push(<DateItem
									key={i}
									relDate={i}
									date={this.getDate(i,year,month)}
									today={today.getFullYear()===year&&today.getMonth()===month-1&&today.getDate()===i}
									// active={this.isSelected(i)}
									active={this.isSelected(viewTimeTemp)}
									isThisMonth={i>0&&i<=days}
									selectDate={(selectDate,isSelect)=>this.props.selectDate(selectDate,isSelect)}
								/>);
					}
					rowList.push(<div key={i} className="dateRow">{row}</div>);
				}
				break;
			default:
				break;
		}
		return rowList;
	}
	render(){
		return (
			<div className="calendarBoard">
				{this.getBoard()}
			</div>
		);
	}
}

class Menu extends React.Component{
	render(){
		const curView = this.props.curView,
			  viewTime = this.props.viewTime,
			  year = viewTime.getFullYear();
		let strTime = "";
		switch(curView){
			case 2:
				strTime = viewTime.getMonth() + 1 + "月" + strTime;
			case 1:
				strTime = year + "年" + strTime;
				break;
			case 0:
				strTime = (year - 9)  + "~" + (year + 10);
			default:
				break;
		}
		return (
			<div className="calendarMenu">
				<a className="prevBtn" onClick={()=>this.props.prevBtnClick()}>{"<"}</a>
				<a className="calendarTime" onClick={()=>this.props.changeCurView(this.props.curView,"prev")}>{strTime}</a>
				<a className="nextBtn" onClick={()=>this.props.nextBtnClick()}>{">"}</a>
			</div>
		);
	}
}

class Calendar extends React.Component{
	constructor(){
		super();
		let now = new Date();
		this.state = {
			maxView:2,
			minView:0,
			curView:2,
			viewTime:now,
			selectTime:[]
		};
	}
	prevBtnClick(){
		let curView = this.state.curView,
			viewTime = new Date(this.state.viewTime);
		switch(curView){
			case 0:
				viewTime.setFullYear(viewTime.getFullYear() - 20);
				break;
			case 1:
				viewTime.setFullYear(viewTime.getFullYear() - 1);
				break;
			case 2:
				viewTime.setMonth(viewTime.getMonth() - 1);
				break;
			default:
				break;
		}
		this.setState({viewTime:viewTime});
	}
	nextBtnClick(){
		let curView = this.state.curView,
			viewTime = new Date(this.state.viewTime);
		switch(curView){
			case 0:
				viewTime.setFullYear(viewTime.getFullYear() + 20);
				break;
			case 1:
				viewTime.setFullYear(viewTime.getFullYear() + 1);
				break;
			case 2:
				viewTime.setMonth(viewTime.getMonth() + 1);
				break;
			default:
				break;
		}
		this.setState({viewTime:viewTime});
	}
	changeCurView(curView,method,viewTime){
		if(method === "prev"&&curView>0){
			this.setState({curView:curView-1});
		}else if(method === "next"&&curView<2){
			this.setState({
				curView:curView+1,
				viewTime:viewTime
			});
		}
	}
	selectDate(selectDate,isSelect){
		let time = new Date(this.state.viewTime),
			selectArr = isSelect?this.state.selectTime.slice(0):[],
			len = selectArr.length;
		time.setDate(selectDate);
		selectArr = selectArr.filter((item)=>{
			return compareTime(item,time,this.state.curView)!==0;
		});
		if(len === selectArr.length){
			selectArr.push(time);
		}
		this.setState({
			viewTime:time,
			selectTime:selectArr
		});
	}
	render(){
		return (
			<div className="calendar noselect">
				<Menu
					curView={this.state.curView}
					viewTime={this.state.viewTime}
					prevBtnClick={()=>this.prevBtnClick()}
					nextBtnClick={()=>this.nextBtnClick()}
					changeCurView={(curView,method)=>this.changeCurView(curView,method)}
				/>
				<Board
					today={new Date()}
					maxView={this.state.maxView}
					minView={this.state.minView}
					curView={this.state.curView}
					viewTime={this.state.viewTime}
					selectTime={this.state.selectTime}
					changeCurView={(curView,method,viewTime)=>this.changeCurView(curView,method,viewTime)}
					selectDate={(selectDate,isSelect)=>this.selectDate(selectDate,isSelect)}
				/>
			</div>
		);
	}
}

function compareTime(time1,time2,limit){
	if(limit>=0){
		let year1 = time1.getFullYear(),
			year2 = time2.getFullYear();
		if(year1>year2){
			return 1;
		}else if(year1<year2){
			return -1;
		}
	}
	if(limit>=1){
		let month1 = time1.getMonth(),
			month2 = time2.getMonth();
		if(month1>month2){
			return 1;
		}else if(month1<month2){
			return -1;
		}
	}
	if(limit>=2){
		let date1 = time1.getDate(),
			date2 = time2.getDate();
		if(date1>date2){
			return 1;
		}else if(date1<date2){
			return -1;
		}
	}
	if(limit>=3){
		let hour1 = time1.getHours(),
			hour2 = time2.getHours();
		if(hour1>hour2){
			return 1;
		}else if(hour1<hour2){
			return -1;
		}
	}
	if(limit>=4){
		let minute1 = time1.getMinutes(),
			minute2 = time2.getMinutes();
		if(minute1>minute2){
			return 1;
		}else if(minute1<minute2){
			return -1;
		}
	}
	return 0;
}

//==================================
ReactDOM.render(<Calendar />, document.getElementById('root'));
