var containDays=document.getElementById("containDays");
var contain=document.getElementById("contain");
var dropdown=document.getElementById("dropdown");
var textInput=document.getElementById("textInput");

var days_width,days_height,time_height;

var newdiv=newDiv();
newdiv.className="block";
dropdown.onchange=function(ev){
	textInput.value=query_results[parseInt(this.value,10)].get("schedule");
	decrypt();
}


window.onresize=function(){location.reload()};


function setup(){
	// adjust grey container, 25px padding
	var contain_width=Math.floor((window.innerWidth-66)/8)*8;// -50 for space, -16 for body, fixed as multiple of 8
	var contain_height=Math.floor((window.innerHeight-108)/16)*16+2;// -50 for space, -16 for body, -42 for header (16 times)
	containDays.style.width=contain_width;
	contain.style.width=contain_width;
	contain.style.height=contain_height;

	// adjust days headers
	var days=containDays.getElementsByClassName("days");
	days_width=contain_width/8-20;
	days_height=20;

	for(var i=0;i<days.length;i++){
		days[i].style.width=days_width;
		days[i].style.height=days_height;
	}

	// adjust line left and width
	var line=newDiv();
	line.className="line";
	line.style.width=7/8*contain_width;
	line.style.left=contain_width/8;

	var time=newDiv();
	time.className="time";
	time_height=(contain_height-2)/16-2;
	time.style.height=time.style.lineHeight=time_height+"px";

	// add pairs of lineNode>line and timeNode>time

	var lineNode=newDiv();
	lineNode.appendChild(line.cloneNode());
	var timeNode=newDiv();
	timeNode.style.width=contain_width/8;
	timeNode.appendChild(time.cloneNode());

	for(var j=0;j<16;j++){
		contain.appendChild(lineNode.cloneNode(true));
		timeNode.firstChild.textContent=(j+8)%12+"-"+(j+9)%12;
		contain.appendChild(timeNode.cloneNode(true));
	}
	contain.appendChild(lineNode.cloneNode(true));
}setup();


// decrypt-->createClass,plot