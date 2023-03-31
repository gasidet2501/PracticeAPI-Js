const express = require("express");
const axios = require("axios");
var bodyParser = require("body-parser");
const app = express();

const base_url = "http://localhost:3000";

// Set the template engine

app.set ('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files
app.use(express.static(__dirname + '/public'));


app.get("/", async (req, res) => {
    try {
      const res_emp = await axios.get(base_url + "/emp");
      const res_dep = await axios.get(base_url + "/dep");
      res.render("booksANDshelf", { emp: res_emp.data, dep: res_dep.data});  //"books"คือชื่อไฟล์ .ejs  { books: response.data} คือชื่อตัวแปรที่ส่งไป
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
});

// <--------------------------------- Book ------------------------------------->
app.get("/book/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/emp/" + req.params.id);
      res.render("book", { book: response.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.get("/create", async(req, res) => {
    const res_shelf = await axios.get(base_url + "/dep");
    res.render("create", {shelf: res_shelf.data}); //เรียกไฟล์ ejs
  });
  
  app.post("/create", async (req, res) => {
    try {
      const data = { name: req.body.name, tel: req.body.tel, id_dep: req.body.id_dep };
      await axios.post(base_url + "/emp", data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.get("/update/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/emp/" + req.params.id);
      const res_shelf = await axios.get(base_url + "/dep");
      res.render("update", { book: response.data, shelf: res_shelf.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.post("/update/:id", async (req, res) => {
    try {
      const data = { name: req.body.name, tel: req.body.tel, id_dep: req.body.id_dep };
      await axios.put(base_url + "/emp/" + req.params.id, data); //ตัวแก้ไข
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.get("/delete/:id", async (req, res) => {
    try {
      await axios.delete(base_url + "/emp/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  
  // <--------------------------------- Department ------------------------------------->
  
  app.get("/shelf/:id", async (req, res) => {
    try {
      const response = await axios.get(base_url + "/dep/" + req.params.id);
      const response_inshelf = await axios.get(base_url + "/alldep/" + req.params.id);
      res.render("shelf", { shelf: response.data, inshelf: response_inshelf.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  
  app.get("/create_shelf", async(req, res) => {
    const res_shelf = await axios.get(base_url + "/dep");
    res.render("create_shelf", {shelf: res_shelf.data}); //เรียกไฟล์ ejs
  });
  
  app.post("/create_shelf", async (req, res) => {
    try {
      const data = { dep_name: req.body.dep_name, dep_amount: req.body.dep_amount };
      await axios.post(base_url + "/dep", data);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  
  app.get("/update_shelf/:id", async (req, res) => {
    try {
      const res_shelf = await axios.get(base_url + "/dep/" + req.params.id);
      res.render("update_shelf", {shelf: res_shelf.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.post("/update_shelf/:id", async (req, res) => {
    try {
      const data = { dep_name: req.body.dep_name, dep_amount: req.body.dep_amount };
      await axios.put(base_url + "/dep/" + req.params.id, data); //ตัวแก้ไข
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.get("/delete_shelf/:id", async (req, res) => {
    try {
      const res_shelf = await axios.get(base_url + "/dep/" + req.params.id);
      res.render("delete_shelf", {shelf: res_shelf.data });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });
  
  app.post("/delete_shelf_true/:id", async (req, res) => {
    try {
      await axios.delete(base_url + "/dep/" + req.params.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  });


app.listen(5500, () => {
console.log("Server started on port 5500");
});