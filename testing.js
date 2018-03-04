var images = [

{id: 1,
description:'none',
location: 'images/img_01.jpg'
},
{id: 2,
description:'none',
location: 'images/img_02.jpg'
}]

for (var i = 3; i<=8;i++){
images.push(

  {id: i,
  description:'none',
  location: 'images/img_0'+i+'.jpg'
  }
)

}







var myJSON = JSON.stringify(images);

console.log(myJSON);
