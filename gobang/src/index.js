import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component{
	render(){
		let block = this.props.value?(<div className={"block "+this.props.value}></div>):null;
		return (
			<div className="square" onClick={()=>this.props.onClick()}>
				{block}
			</div>
		);
	}
}

class Board extends React.Component{
  
	randerSquare(i) {
	return (
	  <Square
	  	key={i}
	  	value={this.props.squares[i]}
	  	onClick={()=>this.props.onClick(i)}
	  />);
	}

	render(){
		let rows = [];
		for(let i=0;i<15;i++){
			var row=[];
			for(let j=15*i ; j<15*i+15 ; j++){
				row.push(this.randerSquare(j));
			}
			rows.push(<div className="board-row" key={i}>{row}</div>);
		}
		return (
			<div className="board">
	          <div className="shadow up"></div>
	          <div className="shadow right"></div>
	          <div className="shadow down"></div>
	          <div className="shadow left"></div>
	          {rows}
			</div>
		);
	}
}

class Gobang extends React.Component{
	constructor(){
		super();
		this.state = {
			history:[{
				squares:Array(15*15).fill(null),
				lastStep:-1,
			}],
			step:0,
			isWhite: true,
			winner:null,
		};
	}
	handleClick(i){
	    const history = this.state.history.slice(0, this.state.step + 1);
	    const current = history[history.length - 1];
	    const squares = current.squares.slice();
	    const step = this.state.step;
		if(this.state.winner||squares[i]){
			return;
		}
		squares[i] = this.state.isWhite?"white":"black";
		const winner = this.calculateWinner(squares,i);
		this.setState({
			history:history.concat([{
				squares:squares,
				lastStep:i,
			}]),
			step:step+1,
			isWhite:!this.state.isWhite,
			winner:winner,
		});
	}
	calculateWinner(squares,cur){
		const chessPiece = squares[cur];
		const chessIndexArr = [[cur],[cur],[cur],[cur]];
		this.findSameChess(chessIndexArr,squares,cur);
		
		for(let i=0;i<4;i++){
			if(chessIndexArr[i].length>=5){
				return chessPiece;
			}
		}
		return null;
	}
	calculatePos(pos){
		return {
			x:pos%15,
			y:Number.parseInt(pos/15,10),
		};
	}
	calculateIndex(x,y){
		return (x+y*15);
	}
	findSameChess(arr,squares,cur){
		const curPos = this.calculatePos(cur);
		const chessPiece = squares[cur];
		const dirArr = [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1}];
		for(let i=0;i<4;i++){
			var dir = dirArr[i];
			var step = 1,stepAdd = 1;
			while(true){
				var next = this.calculateIndex(curPos.x + step*dir.x,curPos.y + step*dir.y);
				if(chessPiece !== squares[next]){
					if(step > 0 ){
						step = stepAdd = -1;
						continue;
					}else{
						break;
					}
				}
				step += stepAdd;
				if(step > 0){
					arr[i].push(next);
				}else{
					arr[i].unshift(next);
				}
			}
		}
	}
	jumpTo(i){
	    const history = this.state.history.slice(0, this.state.step + 1);
	    const isWhite = i%2 === 0
		this.setState({
			history:history.slice(0,i+1),
			step:i,
			isWhite:isWhite,
			winner:history[i].winner,
		});
	}
	render(){
	    const history = this.state.history.slice(0, this.state.step + 1);
	    const current = history[history.length - 1];
	    const squares = current.squares.slice();
		let status;
		if(this.state.winner){
			status = 'Winner: ' + this.state.winner;
		}else{
			status = 'Next player: ' + (this.state.isWhite?"white":"black");
		}
		let list = [];
		for(let i=0,len=history.length;i<len;i++){
			var pos = this.calculatePos(history[i].lastStep);
			var str = history[i].lastStep>=0?("("+pos.x+","+pos.y+")"):"Game Start";
			list.push(<li onClick={()=>this.jumpTo(i)} key={i}>{str}</li>);
		}
		return (
			<div className="gobang">
				<Board
					squares={squares}
					onClick={(i)=>this.handleClick(i)}
				/>
				<div className="boardRecord">
					<h3>{status}</h3>
					<ul>
						{list}
					</ul>
				</div>
			</div>
		);
	}
}

// ==============================================

ReactDOM.render(
	<Gobang />,
	document.getElementById('root')
);

