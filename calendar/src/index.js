import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';

class DayTime extends React.Component{
	getRelation(selectedTime,timeObj){
		const timeBegin = timeObj.start,
			  timeEnd = timeObj.end;
		for(let timeObj of selectedTime){
			if(timeObj.start <= timeBegin){
				if(+timeObj.end > +timeBegin && +timeObj.end < +timeEnd){
					return "halfSelected";
				}else if(+timeObj.end >= +timeEnd){
					return "wholeSelected";
				}
			}else if(+timeObj.start < +timeEnd){
				return "halfSelected";
			}
		}
		return "";
	}
	render(){
		const timeList = [],dayTime = this.props.dayTime;
		let timeObj = {
				start:new Date(dayTime.getFullYear(),dayTime.getMonth(),dayTime.getDate()),
				end:new Date(dayTime.getFullYear(),dayTime.getMonth(),dayTime.getDate()),
			};
		for(let i=0;i<24;i++){
			timeObj.start.setHours(i);
			timeObj.end.setHours(i+1);
			timeList.push(<li
				className={this.getRelation(this.props.select.selectedTime,timeObj)}
				key={i}
				onClick={((i)=>{return (e)=>{
					let keyState = 0;
					let timeObj = {
						start:new Date(dayTime.getFullYear(),dayTime.getMonth(),dayTime.getDate(),i),
						end:new Date(dayTime.getFullYear(),dayTime.getMonth(),dayTime.getDate(),i+1),
					};
					if(e.altKey && !e.shiftKey) {keyState=1;}
					if(!e.altKey && e.shiftKey) {keyState=2;}
					if(e.altKey && e.shiftKey) {keyState=3;}
					this.props.onDateSelect(timeObj,keyState);
				}})(i)}
				>{i>9?i:"0"+i}:00</li>);
		}
		return (<div id="dayTime" className={"dayTime"+(this.props.select.showDayTime?" active":"")}>
				<div
				className="closeDaytime"
				onClick={()=>this.props.closeDaytime()}
				>X</div>
				<ul>{timeList}</ul>
			</div>);
	}
}

class DateBlock extends React.Component{
	render(){
		return (
			<p
			className={"date "+this.props.addClass}
			onClick={(e)=>{
				let keyState = 0,
					timeObj = {
						start:new Date(this.props.year,this.props.month-1,this.props.date,0),
						end:new Date(this.props.year,this.props.month-1,this.props.date,24),
					};
				if(e.altKey && !e.shiftKey) {keyState=1;}
				if(!e.altKey && e.shiftKey) {keyState=2;}
				if(e.altKey && e.shiftKey) {keyState=3;}
				this.props.onDateSelect(timeObj,keyState,e);
			}}
			>
				{this.props.date}
			</p>
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
	getRelation(selectedTime,year,month,date){
		const timeBegin = new Date(year+"/"+month+"/"+date+" 00:00"),
			  timeEnd = new Date(year+"/"+month+"/"+(date)+" 24:00");
		for(let timeObj of selectedTime){
			if(+timeObj.start <= +timeBegin){
				if(+timeObj.end > +timeBegin && +timeObj.end < +timeEnd){
					return "halfSelected";
				}else if(+timeObj.end >= +timeEnd){
					return "wholeSelected";
				}
			}else if(+timeObj.start < +timeEnd){
				return "halfSelected";
			}
		}
		return "";
	}
	render(){
		const year = this.props.year,month = this.props.month,curTime = new Date(this.props.curTime);
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
	  			addClass += " " + this.getRelation(this.props.select.selectedTime,year,month,date);
	  			if(i===0){
	  				row.unshift(<DateBlock
	  					key={date}
	  					year={year}
	  					month={month}
	  					date={date}
	  					addClass={addClass}
						onDateSelect={(timeObj,keyState,event)=>this.props.onDateSelect(timeObj,keyState,event)}
  					/>);
	  			}else{
		  			row.push(<DateBlock
	  					key={date}
	  					year={year}
	  					month={month}
	  					date={date}
	  					addClass={addClass}
						onDateSelect={(timeObj,keyState,event)=>this.props.onDateSelect(timeObj,keyState,event)}
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
					if(this.props.onChangeBoard){
						this.props.onChangeBoard();
					}
				}}
			>
				<h3 className="monthNum"><p>{month}月</p></h3>
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
				onChangeBoard={()=>this.props.onChangeBoard("toMonth",i+1)}
				onDateSelect={(timeObj,keyState,event)=>this.props.onDateSelect(timeObj,keyState,event)}
				select={this.props.select}
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
					select={this.props.select}
					onChangeBoard={(dir,val)=>this.props.onChangeBoard(dir,val)}
					onDateSelect={(timeObj,keyState,event)=>this.props.onDateSelect(timeObj,keyState,event)}
				/>);
			case "month":
				return (<Month
					curTime={curTime}
					year={viewTime.getFullYear()}
					month={viewTime.getMonth()+1}
					select={this.props.select}
					onDateSelect={(timeObj,keyState,event)=>this.props.onDateSelect(timeObj,keyState,event)}
				/>);
			/*case "day":
				return (<DayTime
					curTime={curTime}
					time={viewTime}
				/>);*/
			default:
				return;
		}
	}
	render(){
		const viewTime = new Date(this.props.viewTime),
			  curItem = this.props.curItem,
			  curTime = new Date();
		let item = this.renderBoard(curItem,viewTime,curTime);
		return (
			<div
			className={curItem+"Board clearfix"}
			>
				{item}
				<DayTime
					closeDaytime={()=>this.props.closeDaytime()}
					select={this.props.select}
					dayTime={this.props.dayTime}
					onDateSelect={(timeObj,keyState)=>this.props.onDateSelect(timeObj,keyState)}
				/>
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
			select:{
				showDayTime:false,
				selectedTime:[],
				lastSelectedTime:time,
			},
			dayTime:time,
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
			/*case "day":
				var date = viewTime.getDate();
				if(date>1){
					viewTime.setDate(date-1);
					break;
				}
				viewTime.setDate(this.getDaysNum(viewTime.getFullYear(),viewTime.getMonth()+1));*/
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
			/*case "day":
				var date = viewTime.getDate();
				if(date < this.getDaysNum(viewTime.getFullYear(),viewTime.getMonth()+1) ){
					viewTime.setDate(date+1);
					break;
				}
				viewTime.setDate(1);*/
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
	dateSelect(timeObj,keyState,event){
		if(this.state.curItem === "year") return;
		const select = this.state.select;
		let dayTime = this.state.dayTime;
		const newSelect={
			showDayTime:select.showDayTime,
			selectedTime:[],
			lastSelectedTime:select.lastSelectedTime,
		};
		switch(keyState){
			case 0:
				newSelect.selectedTime.push(timeObj);
				newSelect.lastSelectedTime = timeObj.start;
				break;
			case 1:
				newSelect.showDayTime = true;
				dayTime = timeObj.start;
				newSelect.selectedTime = newSelect.selectedTime.concat(select.selectedTime);
				if(event){
					const oTime = document.getElementById("dayTime");
					oTime.style.top=event.pageY+"px";
					oTime.style.left=event.pageX+"px";
				}
				break;
			case 3:
				if(timeObj.start > newSelect.lastSelectedTime){
					timeObj.start = newSelect.lastSelectedTime;
				}else if(timeObj.end < newSelect.lastSelectedTime){
					timeObj.end = newSelect.lastSelectedTime;
				}
			case 2:
				newSelect.lastSelectedTime = timeObj.start;
				newSelect.selectedTime = newSelect.selectedTime.concat(select.selectedTime);
				let i=0,addArr = [],delIndex=-1,waitDel=[];
				for(let time of newSelect.selectedTime){
					if(+time.start <= +timeObj.start){
						if(+time.end >=+timeObj.end){
							delIndex=i;
							if(+time.start!==+timeObj.start){
								addArr.push({
								start:time.start,
								end:timeObj.start,
								});
							}
							if(+time.end!==+timeObj.end){
								addArr.push({
								start:timeObj.end,
								end:time.end,
								});
							}
							break;
						}else if(+time.end < +timeObj.start){
							i++;
							continue;
						}
						newSelect.selectedTime[i].end = timeObj.end;
						timeObj = newSelect.selectedTime[i];
						waitDel.push(i);

					}else if(+time.start <=+timeObj.end){
						if(+time.end <= +timeObj.end){
							newSelect.selectedTime[i] = timeObj;
							waitDel.push(i);
							i++;
							continue;
						}
						newSelect.selectedTime[i].start = timeObj.start;
						timeObj = newSelect.selectedTime[i];
						waitDel.push(i);
					}
					i++;
				}
				if(waitDel.length>1){
					for(let j=0;j<waitDel.length-1;j++){
						newSelect.selectedTime.splice(waitDel[j],1);
					}
				}
				if(i>=newSelect.selectedTime.length && waitDel.length === 0){
					newSelect.selectedTime.push(timeObj);
				}else if(delIndex!==-1){
					newSelect.selectedTime.splice(delIndex,1,...addArr);
				}
				break;
			default:
			break;
		}
		console.log(newSelect);
		this.setState({
			select:newSelect,
			dayTime:dayTime,
		});
	}
	closeDaytime(){
		var select = {
			showDayTime:false,
			selectedTime:this.state.select.selectedTime,
			lastSelectedTime:this.state.select.lastSelectedTime,
		}
		this.setState({select:select});
	}
	render(){
		const viewTime = this.state.viewTime,
			  curItem = this.state.curItem;
		let strTime=viewTime.getFullYear() + "年";
		let prevStr = "";
		switch(curItem){
			case "month":
				prevStr = "< "+strTime;
				strTime += (viewTime.getMonth()+1) + "月";
				break;
			/*case "day":
				strTime += (viewTime.getMonth()+1) + "月";
				prevStr = strTime;
				strTime += viewTime.getDate() + "日";
				break;*/
			default:
				break;
		}
		return (
			<div className="calendar noselect">
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
					select={this.state.select}
					dayTime={this.state.dayTime}
					onChangeBoard={(dir,val)=>this.changeBoardClick(dir,val)}
					onDateSelect={(timeObj,keyState,event)=>this.dateSelect(timeObj,keyState,event)}
					closeDaytime={()=>this.closeDaytime()}
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
