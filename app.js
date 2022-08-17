const express = require("express");
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));    // it is made to access static files(in public folder)

//mongoose.connect("mongodb://localhost:27017/todolistDB");

mongoose.connect("mongodb+srv://admin-Shivam:Leetcode-321@cluster0.betnu5h.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item",itemsSchema);

const i1=new Item({
    name:"Welcome to your todo list"
});
const i2 = new Item({
    name: "Hit the + button to add a new item"
});
const i3 = new Item({
    name:"<-- Hit this to delete an item "
});

const defaultItems=[i1,i2,i3]; 

const listSchema = {
    name :String,
    items : [itemsSchema]
};
const List = mongoose.model("List",listSchema);

//const items=["Buy Food","Cook Food","Eat Food"];
// const workItems = [];



app.get("/",function(req,res){

    var today = new Date();  // it is inbuilt JS function
   
    var options = {
        weekday: "long",
        day: "numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-US",options);

   Item.find({},function(err,foundItems){
   
    if(foundItems.length === 0 ){
        Item.insertMany(defaultItems,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Successfully added to database.");
    };
    res.redirect("/");
})
    }
    res.render("list", {kindOfDay: day, newListitems: foundItems});
   }) 

    //res.send("hello");
});


app.get("/:customListName",function(req,res){
  const customListName= req.params.customListName;
  if(List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list = new List({
                    name : customListName,
                    items : defaultItems
                  });
                  list.save();
                  res.redirect("/"+customListName);
            }else{
                //show an existing list
                res.render("list",{kindOfDay: foundList.name , newListitems:foundList.items})
            }
        }
  }));

  
 
 
});


app.post("/",function(req,res){
       
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const i4 = new Item({
        name:itemName
    });
  // items.push(item);


//   var today = new Date();  // it is inbuilt JS function
   
//   var options = {
//       weekday: "long",
//       day: "numeric",
//       month:"long"
//   };
//   var day = today.toLocaleDateString("en-US",options);

//  if(listName === day){
//     itemName.save();
//     res.redirect("/");
//  }else{
//     List.findOne({name:listName},function(err,foundList){
//         foundList.items.push(item);
//         foundList.save();
//         res.redirect("/"+listName);
//     })
//  }


   i4.save();
   
   res.redirect("/");
   
  
  
});
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("successfully deleted checked item");
        }
    });
    res.redirect("/");
});
   

app.listen(3000,function(){
    console.log("server started on port 3000");
});
