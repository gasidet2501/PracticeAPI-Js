const express = require ('express');
const Sequelize = require( 'sequelize');
const app = express();

// parse incoming requests
app.use (express.json());

// create a connection to the database
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'Database/Company.db'
});

//Employee
const Emp = sequelize.define('employee', {
    id_emp: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_dep: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

//Department
const Dep = sequelize.define('department', {
    id_dep: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    dep_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dep_amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


sequelize.sync();

//------------------------------>Employee<------------------------------------
app.get('/emp', (req, res) => {
    Emp.findAll().then(emp => {
        res.json(emp);
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.get('/emp/:id', (req, res) => {
    Emp.findByPk(req.params.id).then(emp => {
        if(!emp) {
            res.status(404).send('emp not found');
        } else {
            res.json(emp);
        }
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.post('/emp',(req,res) => {
    Emp.create(req.body).then(emp => {
        Dep.findByPk(req.body.id_dep).then(dep => {
            if (!dep) {
                res.status(404).send('Dep not found');
            }else {
                dep.update({
                    dep_amount : ++dep.dep_amount
                });
            }
        }).catch(err => {
            res.status(500).send(err);
        });
        res.send(emp);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.put('/emp/:id', (req,res) => {

    let old_dep;
    Emp.findByPk(req.params.id).then(emp => {
        old_dep = emp.id_dep;
        }).catch(err => {
            res.status(500).send(err);
    });

    Emp.findByPk(req.params.id).then(emp => {
        if (!emp) {
            res.status(404).send('emp not found');
        }else {

            if(req.body.id_dep != old_dep){
                emp.update(req.body).then(() => {
                    Dep.findByPk(req.body.id_dep).then(dep => {
                        dep.update({
                            dep_amount : ++dep.dep_amount
                        })});
                }).catch(err => {
                    res.status(500).send(err);
                });


                Dep.findByPk(old_dep).then(dep => {
                    dep.update({
                        dep_amount : --dep.dep_amount
                    });
                    
                }).catch(err => {
                    res.status(500).send(err);
                });
                res.send(emp);

            }
            else{
                emp.update(req.body).then(() => {
                    res.send(emp);
                }).catch(err => {
                    res.status(500).send(err);
                });

            }
        }
        
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/emp/:id', (req, res) => {
    
    let old_dep;
    Emp.findByPk(req.params.id).then(emp => {
        old_dep = emp.id_dep;
    }).catch(err => {
        res.status(500).send(err);
    });

    Emp.findByPk(req.params.id).then(emp => {
        if(!emp) {
            res.status(404).send('emp not found');
        }else {

            Dep.findByPk(old_dep).then(dep => {
                if (!dep) {
                    res.status(404).send('Dep not found');
                }else {
                    let am = dep.dep_amount;
                    dep.update({
                        dep_amount : --am
                    }).catch(err => {
                        res.status(500).send(err);
                    });
                }
            }).catch(err => {
                res.status(500).send(err);
            });
                
            emp.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});


//------------------------------>End Employee<------------------------------------


// {
//     "name": "emp2",
//     "tel": "0909975160",
//     "id_dep": 3
// }


//------------------------------>Department<------------------------------------
app.get('/dep', (req, res) => {
    Dep.findAll().then(dep => {
        res.json(dep);
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.get('/dep/:id', (req, res) => {
    Dep.findByPk(req.params.id).then(dep => {
        if(!dep) {
            res.status(404).send('dep not found');
        } else {
            res.json(dep);
        }
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.post('/dep',(req,res) => {
    Dep.create(req.body).then(dep => {
        res.send(dep);
    }).catch(err => {
        res.status(500).send(err);
    });

});

app.put('/dep/:id', (req,res) => {
    Dep.findByPk(req.params.id).then(dep => {
        if (!dep) {
            res.status(404).send('Dep not found');
        }else {
            dep.update(req.body).then(() => {
                res.send(dep);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/dep/:id', (req, res) => {
    Dep.findByPk(req.params.id).then(dep => {
        if(!dep) {
            res.status(404).send('Dep not found');
        }else {
            dep.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});
//------------------------------>End Department<------------------------------------


//------------------------------>All Employee IN Department<------------------------------------
app.get('/alldep/:id', (req, res) => {
    Emp.findAll({
        where:{
            id_dep : req.params.id
        }
    }).then(emp => {
        res.json(emp);
    }).catch(err =>{
        res.status(500).send(err);
    });
});
//------------------------------>End All Employee IN Department<------------------------------------




const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
