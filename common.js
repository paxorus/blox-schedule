function decrypt(){
	var course;
	for(var loop3=0;course=course_data[loop3];loop3++){// for each course_data string
	    course=createClass(course.split(";"));
	    // customize newdiv and then plot
	    newdiv.style.backgroundColor=course.color;
	    if(course.place!="???"){
		    newdiv.title=course.place;
		}
	    if(course.trans){
	        newdiv.style.opacity=0.5;
	    }

	    for(var loop4=0;loop4<=course.times.length-1;loop4++){// for each time span, make block
	        plot(newdiv,course.times[loop4],course.name);
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

function createClass(data_arr){
	console.log(data_arr);
	return new Class(data_arr[0],data_arr[1],data_arr[2],data_arr[3]);
}


function pushAllDays(array,multiday_str,index){
    var day_numbers=multiday_str.substring(0,index);// "134"
    var hours=multiday_str.substring(index+1,multiday_str.length-1);// "13~14"
    for(var i=0;i<day_numbers.length;i++){
    	array.push(day_numbers[i]+"~"+hours);
    }
}

function newDiv(){
	return document.createElement("div");
}
