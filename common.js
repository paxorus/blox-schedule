var blox;

function savify(){// 'Save to Cloud'
	var obj=queryResults[parseInt(dropdown.value,10)];
	obj.set("schedule",textInput.value);
	obj.save();
}

function toggleDisplay(style){
	if(style.display=="block"){
		style.display="none";
		edit.textContent="Edit";
		decrypt();
	}else{
		style.display="block";
		edit.textContent="Done";
	}
}

function decrypt(){
	// delete old blox
	$(".block").remove();

	// data to blox
	var courses=textInput.value.split(",");
	for(var i in courses){// for each courseData string
		var data=courses[i].split(";");
		var course=new Class(data[0],data[1],data[2],data[3]);
	    // customize newdiv and then plot
	    newdiv.style.backgroundColor=course.color;
	    if(course.place!="???"){
		    newdiv.title=course.place;
		}else if(newdiv.title){
			newdiv.removeAttribute("title");
		}
	    newdiv.style.opacity=(course.trans)?0.5:1.0;// set opacity
	    for(var j in course.times){
	    	plot(newdiv,course.times[j],course.name);// for each time span, make block
	    }
	}
}

// given styled div and "1~13~14" produce its block
function plot(div_template,time_str,name){
	var div=div_template.cloneNode();
	div.textContent=name;

	var time_arr=time_str.split("~");// ["1","13","14"]
	var hours=parseFloat(time_arr[2])-parseFloat(time_arr[1]);// 14-13

	div.style.width=days_width; 
	div.style.height=(hours*(time_height+2)-2)+"px";
	div.style.lineHeight=div.style.height;
	div.style.top=2+(time_height+2)*(parseFloat(time_arr[1])-8)+"px";
	div.style.left=(days_width+20)*(parseInt(time_arr[0],10)+1)+"px";// +20 for padding
	contain.appendChild(div);
}

function Class(name,color,time_str,place){// four strings from split(';')
	this.name=name.substring(this.trans=(name[0]=='z'));// set boolean .trans,set name 
    this.color=color;
    this.place=place;
    this.times=[];
    var times=time_str.split('+');

    for(var i=0;i<times.length;i++){// for each in "134(13~14),5(12.5~14)"
    	var index=times[i].indexOf("(");
    	if(index>-1){// multiday push
    		pushAllDays(this.times,times[i],index);
    	}else{
    		this.times.push(times[i]);// normal push
    	}
    }
}

function pushAllDays(array,multiday_str,index){
    var day_numbers=multiday_str.substring(0,index);// "134"
    var hours=multiday_str.substring(index+1,multiday_str.length-1);// "13~14"
    for(var i=0;i<day_numbers.length;i++){
    	array.push(day_numbers[i]+"~"+hours);
    }
}

var schedNames;
function loadOptions(scheds){
	schedNames=[];
	for(var k=0;k<scheds.length;k++){
		var op=document.createElement("option");
		schedNames.push(op.textContent=scheds[k].get("name"));
		op.value=k;
		dropdown.appendChild(op);
	}

	var index;
	if((index=localStorage.default) && schedNames.indexOf(index)>=0){
		index=schedNames.indexOf(index);
	}else{
		index=0;
	}
	textInput.value=scheds[index].get("schedule");
	dropdown.childNodes[index].selected=true;
	title.textContent="::"+scheds[index].get("name")+"::";
	decrypt();
}

function newDiv(){
	return document.createElement("div");
}
function localStore(){// upon 'Make Default'
	var index=parseInt(dropdown.value,10);
	localStorage.default=schedNames[index];
}
function deleteSchedule(){
	if(confirm("Are you sure?")){
		var index=parseInt(dropdown.value,10);
		queryResults[index].destroy({
			success:function(obj){location.reload()}
		});
	}
}
function cloneSchedule(){
	var bloxSchedule=new BloxSchedule();
	var name=prompt("Enter a name for the new schedule:");
	bloxSchedule.set("name",name);
	bloxSchedule.set("schedule",textInput.value);
	bloxSchedule.save({
		success:function(obj){location.reload()}
	});
}